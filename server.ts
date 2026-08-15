import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { OAuth2Client } from 'google-auth-library';
import { db } from './server/db';
import { sendOtpSms } from './server/sms';
import {
  resolveJwtSecret,
  signAdminToken,
  makeAuthenticateAdmin,
  requireRole,
  requireCsrf,
  issueCsrfCookie,
  loginRateLimiter,
  generalApiRateLimiter,
  uploadRateLimiter,
  inquiryRateLimiter,
  SESSION_COOKIE,
  type AuthedRequest,
  signCustomerToken,
  makeAuthenticateCustomer,
  makeOptionalAuthenticateCustomer,
  authRateLimiter,
  otpRateLimiter,
  CUSTOMER_SESSION_COOKIE,
  type CustomerRequest
} from './server/security';
import {
  loginSchema,
  changePasswordSchema,
  vehicleSchema,
  vehicleUpdateSchema,
  messageSchema,
  messageStatusSchema,
  customerSignupSchema,
  customerLoginSchema,
  googleAuthSchema,
  otpRequestSchema,
  otpVerifySchema,
  financeInquirySchema,
  financeInquiryStatusSchema,
  commissionUpdateSchema,
  commissionGoalsSchema
} from './server/validation';

const JWT_SECRET = resolveJwtSecret();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || '').trim();
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Buffer uploads in memory first so we can sniff the real file signature
// before anything touches disk — the browser-supplied MIME type/extension
// can't be trusted on its own.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 15 }
});

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
};

async function validateAndStoreImage(file: Express.Multer.File): Promise<string> {
  const { fileTypeFromBuffer } = await import('file-type');
  const detected = await fileTypeFromBuffer(file.buffer);

  if (!detected || !ALLOWED_IMAGE_TYPES[detected.mime]) {
    throw new Error(`Rejected file "${file.originalname}": not a valid JPEG/PNG/WebP image`);
  }

  const ext = ALLOWED_IMAGE_TYPES[detected.mime];
  // Randomized name — never trust or reuse the original filename.
  const filename = `${crypto.randomUUID()}${ext}`;
  await fs.promises.writeFile(path.join(UPLOADS_DIR, filename), file.buffer);
  return `/uploads/${filename}`;
}

function parseOrigins(value: string | undefined): string[] {
  return (value || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);

  const allowedOrigins = [
    ...parseOrigins(process.env.ALLOWED_PUBLIC_ORIGIN),
    ...parseOrigins(process.env.ALLOWED_ADMIN_ORIGIN)
  ];

  app.use(
    helmet({
      // Public/admin bundles rely on inline styles injected by Vite/Tailwind in
      // dev and load Google Fonts; a hand-tuned CSP is a follow-up once the
      // production asset pipeline (and any CDN) is finalized.
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );

  app.use(
    cors({
      // Same-origin requests (no Origin header, e.g. curl/server-to-server) are
      // allowed through; browser cross-origin requests must match the allowlist.
      origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use('/api', generalApiRateLimiter);

  // Static serving for uploaded files
  app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

  const authenticateAdmin = makeAuthenticateAdmin(JWT_SECRET);
  const authenticateCustomer = makeAuthenticateCustomer(JWT_SECRET);
  const optionalAuthenticateCustomer = makeOptionalAuthenticateCustomer(JWT_SECRET);

  function audit(req: AuthedRequest, action: string, target: string, metadata?: Record<string, unknown>) {
    if (!req.admin) return;
    db.addAuditLog({ actorId: req.admin.id, actorEmail: req.admin.email, action, target, metadata });
  }

  // --- PUBLIC API ROUTES ---

  app.get('/api/vehicles', (req, res) => {
    try {
      // Public listing must only ever show published/available inventory —
      // never expose draft/internal-only vehicles or fields here.
      const result = db.getVehicles(req.query);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
  });

  app.get('/api/vehicles/makes-models', (req, res) => {
    try {
      res.json(db.getMakesAndModels());
    } catch {
      res.status(500).json({ error: 'Failed to fetch makes/models' });
    }
  });

  app.get('/api/vehicles/:id', (req, res) => {
    try {
      const vehicle = db.getVehicleById(req.params.id);
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
      res.json(vehicle);
    } catch {
      res.status(500).json({ error: 'Failed to fetch vehicle' });
    }
  });

  app.post('/api/messages', inquiryRateLimiter, optionalAuthenticateCustomer, (req: CustomerRequest, res) => {
    const parsed = messageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid submission', details: parsed.error.issues });
    }
    try {
      const msg = db.createMessage({ ...parsed.data, customerId: req.customer?.id });
      res.status(201).json({ success: true, message: msg });
    } catch {
      res.status(500).json({ error: 'Failed to submit inquiry' });
    }
  });

  // --- CUSTOMER AUTH ---

  function issueCustomerSession(res: express.Response, customerId: string) {
    const token = signCustomerToken(JWT_SECRET, customerId);
    res.cookie(CUSTOMER_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    issueCsrfCookie(res);
  }

  app.post('/api/auth/signup', authRateLimiter, (req, res) => {
    const parsed = customerSignupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid signup details', details: parsed.error.issues });
    }
    const { name, email, password } = parsed.data;
    if (db.findCustomerByEmail(email)) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const customer = db.createCustomer({ name, email, passwordHash, authProvider: 'password' });
    issueCustomerSession(res, customer.id);
    res.status(201).json({ success: true, user: customer });
  });

  app.post('/api/auth/login', authRateLimiter, (req, res) => {
    const parsed = customerLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { email, password } = parsed.data;
    const customer = db.findCustomerByEmail(email);
    if (!customer || !db.verifyCustomerPassword(customer, password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    issueCustomerSession(res, customer.id);
    const safe = db.getCustomerById(customer.id);
    res.json({ success: true, user: safe });
  });

  app.post('/api/auth/google', authRateLimiter, async (req, res) => {
    if (!googleClient) {
      return res.status(503).json({
        error: 'Google sign-in is not configured yet. Set GOOGLE_CLIENT_ID in the server .env to enable it.'
      });
    }
    const parsed = googleAuthSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Missing Google credential' });
    }
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: parsed.data.idToken,
        audience: GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.sub) {
        return res.status(401).json({ error: 'Invalid Google credential' });
      }

      let customer = db.findCustomerByGoogleId(payload.sub);
      if (!customer && payload.email) {
        // Same person signing in with Google after previously using email/password.
        const existing = db.findCustomerByEmail(payload.email);
        if (existing) customer = existing;
      }
      if (!customer) {
        customer = db.createCustomer({
          name: payload.name || payload.email || 'Kandela Customer',
          email: payload.email,
          googleId: payload.sub,
          avatarUrl: payload.picture,
          authProvider: 'google'
        });
      }

      issueCustomerSession(res, customer.id);
      const safe = db.getCustomerById(customer.id);
      res.json({ success: true, user: safe });
    } catch (err: any) {
      // Safe error logging for auth failures — no token/secret contents, just
      // enough to diagnose Client ID mismatches or provider outages in prod.
      const diagnostic = {
        name: err?.name,
        message: err?.message,
        // google-auth-library attaches this on audience/issuer mismatches
        expected: err?.expected,
        actual: err?.actual
      };
      console.error('[google-auth] verifyIdToken failed:', diagnostic);

      // Map to a specific-but-safe client message so the failure mode is
      // visible in the browser without needing server console access.
      let clientMessage = 'Google sign-in failed. Please try again.';
      const msg = String(err?.message || '');
      if (msg.includes('audience')) {
        clientMessage = 'Google sign-in failed: Client ID mismatch (audience). Check GOOGLE_CLIENT_ID matches VITE_GOOGLE_CLIENT_ID.';
      } else if (msg.includes('Token used too late') || msg.includes('expired')) {
        clientMessage = 'Google sign-in failed: the credential expired before it reached the server. Try again.';
      } else if (msg.includes('ENOTFOUND') || msg.includes('ETIMEDOUT') || msg.includes('fetch')) {
        clientMessage = 'Google sign-in failed: the server could not reach Google to verify the token (network issue).';
      } else if (msg.includes('Wrong number of segments') || msg.includes('Wrong recipient') || msg.includes('malformed')) {
        clientMessage = 'Google sign-in failed: malformed credential received by the server.';
      }

      res.status(401).json({ error: clientMessage });
    }
  });

  app.post('/api/auth/otp/request', otpRateLimiter, async (req, res) => {
    const parsed = otpRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'A valid phone number is required (e.g. +251911234567)' });
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    db.createOtp(parsed.data.phone, code);

    const result = await sendOtpSms(parsed.data.phone, code);
    if (result.provider === 'console') {
      // Dev fallback — code is in the server console, not actually texted.
      res.json({ success: true, message: 'Verification code sent', devMode: true });
    } else if (!result.delivered) {
      // Real provider configured but the send failed (bad number, carrier
      // issue, etc). The code is still valid if they already received it via
      // another channel, but be honest that delivery isn't confirmed.
      res.status(502).json({ error: 'Could not send the verification code. Please check the number and try again.' });
    } else {
      res.json({ success: true, message: 'Verification code sent' });
    }
  });

  app.post('/api/auth/otp/verify', otpRateLimiter, (req, res) => {
    const parsed = otpVerifySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'A valid phone number and 6-digit code are required' });
    }
    const { phone, code, name } = parsed.data;
    if (!db.verifyOtp(phone, code)) {
      return res.status(401).json({ error: 'Invalid or expired verification code' });
    }
    let customer = db.findCustomerByPhone(phone);
    if (!customer) {
      customer = db.createCustomer({ name: name || phone, phone, authProvider: 'phone' });
    }
    issueCustomerSession(res, customer.id);
    const safe = db.getCustomerById(customer.id);
    res.json({ success: true, user: safe });
  });

  app.post('/api/auth/logout', authenticateCustomer, (req, res) => {
    res.clearCookie(CUSTOMER_SESSION_COOKIE, { path: '/' });
    res.json({ success: true });
  });

  app.get('/api/auth/me', authenticateCustomer, (req: CustomerRequest, res) => {
    const user = db.getCustomerById(req.customer!.id);
    if (!user) return res.status(401).json({ error: 'Account not found' });
    res.json({ user });
  });

  // --- CUSTOMER FAVORITES ---

  app.get('/api/me/favorites', authenticateCustomer, (req: CustomerRequest, res) => {
    res.json({ vehicles: db.getFavoriteVehicles(req.customer!.id) });
  });

  app.post('/api/me/favorites/:vehicleId', authenticateCustomer, requireCsrf, (req: CustomerRequest, res) => {
    const vehicle = db.getVehicleById(req.params.vehicleId);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    db.addFavorite(req.customer!.id, req.params.vehicleId);
    res.json({ success: true });
  });

  app.delete('/api/me/favorites/:vehicleId', authenticateCustomer, requireCsrf, (req: CustomerRequest, res) => {
    db.removeFavorite(req.customer!.id, req.params.vehicleId);
    res.json({ success: true });
  });

  // --- CUSTOMER INQUIRIES ---

  app.get('/api/me/inquiries', authenticateCustomer, (req: CustomerRequest, res) => {
    res.json({ messages: db.getMessagesByCustomer(req.customer!.id) });
  });

  // --- ADMIN AUTH ---

  app.post('/api/admin/login', loginRateLimiter, (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { email, password } = parsed.data;

    if (db.isLockedOut()) {
      return res.status(429).json({ error: 'Account temporarily locked due to repeated failed logins. Try again later.' });
    }

    const admin = db.getAdmin();
    // Constant-shape response either way to avoid leaking whether the email matched.
    if (email.toLowerCase() !== admin.email.toLowerCase() || !db.verifyPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signAdminToken(JWT_SECRET, {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    });

    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'strict',
      path: '/',
      maxAge: 12 * 60 * 60 * 1000
    });
    issueCsrfCookie(res);

    db.addAuditLog({ actorId: admin.id, actorEmail: admin.email, action: 'admin.login', target: 'session' });

    res.json({ success: true, user: db.getAdminSafe() });
  });

  app.post('/api/admin/logout', authenticateAdmin, (req: AuthedRequest, res) => {
    audit(req, 'admin.logout', 'session');
    res.clearCookie(SESSION_COOKIE, { path: '/' });
    res.json({ success: true });
  });

  app.get('/api/admin/me', authenticateAdmin, (req: AuthedRequest, res) => {
    res.json({ user: db.getAdminSafe() });
  });

  app.post('/api/admin/change-password', authenticateAdmin, requireCsrf, (req: AuthedRequest, res) => {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'A current password and a new password (10+ chars) are required' });
    }
    const ok = db.changePassword(parsed.data.currentPassword, parsed.data.newPassword);
    if (!ok) return res.status(401).json({ error: 'Current password is incorrect' });
    audit(req, 'admin.change_password', 'session');
    res.json({ success: true });
  });

  // --- PROTECTED ADMIN ROUTES ---
  // requireRole is scaffolding for editor/viewer roles; today every admin
  // account is a super_admin, so this is a no-op gate that's ready to be
  // tightened once more roles/accounts exist.

  app.get('/api/admin/stats', authenticateAdmin, requireRole('super_admin', 'admin', 'editor', 'viewer'), (req, res) => {
    try {
      res.json(db.getStats());
    } catch {
      res.status(500).json({ error: 'Failed to load stats' });
    }
  });

  app.get('/api/admin/audit-logs', authenticateAdmin, requireRole('super_admin'), (req, res) => {
    res.json(db.getAuditLog());
  });

  // Unlike /api/vehicles (public, published-only), this returns every vehicle
  // including drafts so admins can manage inventory that isn't live yet.
  app.get('/api/admin/vehicles', authenticateAdmin, requireRole('super_admin', 'admin', 'editor', 'viewer'), (req, res) => {
    try {
      const result = db.getVehicles(req.query, { publicOnly: false });
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
  });

  app.get('/api/admin/vehicles/:id', authenticateAdmin, requireRole('super_admin', 'admin', 'editor', 'viewer'), (req, res) => {
    const vehicle = db.getVehicleById(req.params.id, { publicOnly: false });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  });

  app.post(
    '/api/upload',
    authenticateAdmin,
    requireCsrf,
    uploadRateLimiter,
    requireRole('super_admin', 'admin', 'editor'),
    upload.array('images', 15),
    async (req: AuthedRequest, res) => {
      try {
        const files = (req.files as Express.Multer.File[]) || [];
        if (files.length === 0) return res.status(400).json({ error: 'No image files uploaded' });

        const imagePaths: string[] = [];
        for (const file of files) {
          imagePaths.push(await validateAndStoreImage(file));
        }
        audit(req, 'media.upload', 'vehicle_images', { count: imagePaths.length });
        res.json({ success: true, imagePaths });
      } catch (err: any) {
        res.status(400).json({ error: err.message || 'Image upload failed' });
      }
    }
  );

  app.post('/api/vehicles', authenticateAdmin, requireCsrf, requireRole('super_admin', 'admin', 'editor'), (req: AuthedRequest, res) => {
    const parsed = vehicleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid vehicle data', details: parsed.error.issues });
    }
    try {
      const vehicle = db.createVehicle(parsed.data);
      audit(req, 'vehicle.create', vehicle.id);
      res.status(201).json({ success: true, vehicle });
    } catch {
      res.status(500).json({ error: 'Failed to create vehicle' });
    }
  });

  app.put('/api/vehicles/:id', authenticateAdmin, requireCsrf, requireRole('super_admin', 'admin', 'editor'), (req: AuthedRequest, res) => {
    const parsed = vehicleUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid vehicle data', details: parsed.error.issues });
    }
    try {
      const updated = db.updateVehicle(req.params.id, parsed.data);
      if (!updated) return res.status(404).json({ error: 'Vehicle not found' });
      audit(req, 'vehicle.update', req.params.id, { fields: Object.keys(parsed.data) });
      if (typeof parsed.data.published === 'boolean') {
        audit(req, parsed.data.published ? 'vehicle.publish' : 'vehicle.unpublish', req.params.id);
      }
      if (parsed.data.status === 'Sold') {
        audit(req, 'vehicle.mark_sold', req.params.id);
      }
      res.json({ success: true, vehicle: updated });
    } catch {
      res.status(500).json({ error: 'Failed to update vehicle' });
    }
  });

  app.delete('/api/vehicles/:id', authenticateAdmin, requireCsrf, requireRole('super_admin', 'admin'), (req: AuthedRequest, res) => {
    try {
      const deleted = db.deleteVehicle(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Vehicle not found' });
      audit(req, 'vehicle.delete', req.params.id);
      res.json({ success: true, message: 'Vehicle deleted successfully' });
    } catch {
      res.status(500).json({ error: 'Failed to delete vehicle' });
    }
  });

  app.get('/api/messages', authenticateAdmin, requireRole('super_admin', 'admin', 'editor', 'viewer'), (req, res) => {
    try {
      res.json(db.getMessages());
    } catch {
      res.status(500).json({ error: 'Failed to load messages' });
    }
  });

  app.patch('/api/messages/:id', authenticateAdmin, requireCsrf, requireRole('super_admin', 'admin', 'editor'), (req: AuthedRequest, res) => {
    const parsed = messageStatusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid status' });
    try {
      const updated = db.updateMessageStatus(req.params.id, parsed.data.status);
      if (!updated) return res.status(404).json({ error: 'Message not found' });
      audit(req, 'message.update_status', req.params.id, { status: parsed.data.status });
      res.json({ success: true, message: updated });
    } catch {
      res.status(500).json({ error: 'Failed to update message' });
    }
  });

  app.delete('/api/messages/:id', authenticateAdmin, requireCsrf, requireRole('super_admin', 'admin'), (req: AuthedRequest, res) => {
    try {
      const deleted = db.deleteMessage(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Message not found' });
      audit(req, 'message.delete', req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Failed to delete message' });
    }
  });

  // --- FINANCE INQUIRIES ---

  app.post('/api/finance-inquiries', inquiryRateLimiter, (req, res) => {
    const parsed = financeInquirySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid submission', details: parsed.error.issues });
    }
    // Only allow finance inquiries on vehicles the admin has actually opted into
    // financing for — prevents a crafted request from generating a finance
    // inquiry against a car with no financing set up.
    const vehicle = db.getVehicleById(parsed.data.vehicleId);
    if (!vehicle || !vehicle.financingAvailable) {
      return res.status(400).json({ error: 'Financing is not available for this vehicle' });
    }
    try {
      const inquiry = db.createFinanceInquiry(parsed.data);
      res.status(201).json({ success: true, inquiry });
    } catch {
      res.status(500).json({ error: 'Failed to submit financing inquiry' });
    }
  });

  app.get('/api/admin/finance-inquiries', authenticateAdmin, requireRole('super_admin', 'admin', 'editor', 'viewer'), (req, res) => {
    try {
      res.json(db.getFinanceInquiries());
    } catch {
      res.status(500).json({ error: 'Failed to load financing inquiries' });
    }
  });

  app.patch('/api/admin/finance-inquiries/:id', authenticateAdmin, requireCsrf, requireRole('super_admin', 'admin', 'editor'), (req: AuthedRequest, res) => {
    const parsed = financeInquiryStatusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid status' });
    try {
      const updated = db.updateFinanceInquiryStatus(req.params.id, parsed.data.status);
      if (!updated) return res.status(404).json({ error: 'Financing inquiry not found' });
      audit(req, 'finance_inquiry.update_status', req.params.id, { status: parsed.data.status });
      res.json({ success: true, inquiry: updated });
    } catch {
      res.status(500).json({ error: 'Failed to update financing inquiry' });
    }
  });

  // --- COMMISSION & SALES GOALS (admin-only — financial/earnings data, never on a public route) ---

  app.get('/api/admin/commissions', authenticateAdmin, requireRole('super_admin', 'admin'), (req, res) => {
    try {
      res.json(db.getCommissionRecords());
    } catch {
      res.status(500).json({ error: 'Failed to load commission records' });
    }
  });

  app.patch('/api/admin/commissions/:id', authenticateAdmin, requireCsrf, requireRole('super_admin', 'admin'), (req: AuthedRequest, res) => {
    const parsed = commissionUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid commission update', details: parsed.error.issues });
    try {
      const updated = db.updateCommissionRecord(req.params.id, parsed.data);
      if (!updated) return res.status(404).json({ error: 'Commission record not found' });
      audit(req, 'commission.manual_edit', req.params.id, { fields: Object.keys(parsed.data) });
      res.json({ success: true, commission: updated });
    } catch {
      res.status(500).json({ error: 'Failed to update commission record' });
    }
  });

  app.get('/api/admin/commission-goals', authenticateAdmin, requireRole('super_admin', 'admin'), (req, res) => {
    try {
      res.json(db.getCommissionGoals());
    } catch {
      res.status(500).json({ error: 'Failed to load commission goals' });
    }
  });

  app.put('/api/admin/commission-goals', authenticateAdmin, requireCsrf, requireRole('super_admin', 'admin'), (req: AuthedRequest, res) => {
    const parsed = commissionGoalsSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid goals', details: parsed.error.issues });
    try {
      const updated = db.setCommissionGoals(parsed.data);
      audit(req, 'commission_goals.update', 'goals', parsed.data);
      res.json({ success: true, goals: updated });
    } catch {
      res.status(500).json({ error: 'Failed to update commission goals' });
    }
  });

  app.get('/api/admin/commission-summary', authenticateAdmin, requireRole('super_admin', 'admin'), (req, res) => {
    try {
      res.json(db.getCommissionSummary());
    } catch {
      res.status(500).json({ error: 'Failed to load commission summary' });
    }
  });

  // Generic error handler last, so validation/CORS errors never leak stack traces.
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.message || err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ error: 'Something went wrong' });
  });

  // --- FRONTEND SERVING: two separate bundles (public + admin) ---
  // Admin code is a distinct Vite entry (admin.html/src/admin-entry.tsx) so it
  // never ships inside the public site's JS bundle. This is a code-split, not
  // yet a separately *deployed* app/domain — that's the next phase.
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const isAdmin = req.originalUrl.startsWith('/admin');
        const htmlPath = path.join(process.cwd(), isAdmin ? 'admin.html' : 'index.html');
        let html = await fs.promises.readFile(htmlPath, 'utf-8');
        html = await vite.transformIndexHtml(req.originalUrl, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get(/^\/admin/, (req, res) => {
      res.sendFile(path.join(distPath, 'admin.html'));
    });
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kandela Cars server running on http://0.0.0.0:${PORT} (${IS_PROD ? 'production' : 'development'})`);
  });
}

startServer();
