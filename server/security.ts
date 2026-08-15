import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
import type { AdminRole } from './db';

export const SESSION_COOKIE = 'kandela_admin_session';
export const CUSTOMER_SESSION_COOKIE = 'kandela_customer_session';
export const CSRF_COOKIE = 'kandela_csrf';
export const CSRF_HEADER = 'x-csrf-token';

// Fail fast rather than fall back to a hardcoded secret. In dev, generate an
// ephemeral one so `npm run dev` still works out of the box, but refuse to
// boot in production without an explicit, persistent secret (otherwise every
// restart invalidates all sessions, and a leaked default is a backdoor).
export function resolveJwtSecret(): string {
  const fromEnv = process.env.JWT_SECRET;
  if (fromEnv && fromEnv.length >= 32) return fromEnv;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_SECRET is missing or too short (needs 32+ chars). Set it in your production environment before starting the server.'
    );
  }

  console.warn(
    '\n[dev] JWT_SECRET not set (or too short) — using a random one-off secret for this process only.' +
      '\n[dev] Existing admin sessions will not survive a restart. Set JWT_SECRET in .env to avoid this.\n'
  );
  return crypto.randomBytes(48).toString('hex');
}

export interface AdminTokenPayload {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export function signAdminToken(secret: string, payload: AdminTokenPayload): string {
  return jwt.sign(payload, secret, { expiresIn: '12h' });
}

export interface AuthedRequest extends Request {
  admin?: AdminTokenPayload;
}

export function makeAuthenticateAdmin(secret: string) {
  return function authenticateAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
    // Cookie is the primary transport; Authorization header kept as a fallback
    // for non-browser/API clients during the transition off localStorage tokens.
    const cookieToken = req.cookies?.[SESSION_COOKIE];
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: admin session required' });
    }

    try {
      const decoded = jwt.verify(token, secret) as AdminTokenPayload;
      req.admin = decoded;
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
  };
}

/** RBAC groundwork: only super_admin/admin exist today, but routes are already
 *  tagged with the roles they require so adding editor/viewer later is a
 *  config change, not a rewrite. */
export function requireRole(...roles: AdminRole[]) {
  return function (req: AuthedRequest, res: Response, next: NextFunction) {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

/** Double-submit CSRF check for cookie-authenticated state-changing requests. */
export function requireCsrf(req: Request, res: Response, next: NextFunction) {
  const cookieValue = req.cookies?.[CSRF_COOKIE];
  const headerValue = req.get(CSRF_HEADER);
  if (!cookieValue || !headerValue || cookieValue !== headerValue) {
    return res.status(403).json({ error: 'Invalid or missing CSRF token' });
  }
  next();
}

export function issueCsrfCookie(res: Response) {
  const token = crypto.randomBytes(24).toString('hex');
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false, // must be readable by the frontend to echo back in the header
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  return token;
}

export interface CustomerTokenPayload {
  id: string;
  kind: 'customer';
}

export function signCustomerToken(secret: string, customerId: string): string {
  return jwt.sign({ id: customerId, kind: 'customer' }, secret, { expiresIn: '30d' });
}

export interface CustomerRequest extends Request {
  customer?: CustomerTokenPayload;
}

export function makeAuthenticateCustomer(secret: string) {
  return function authenticateCustomer(req: CustomerRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.[CUSTOMER_SESSION_COOKIE];
    if (!token) return res.status(401).json({ error: 'Unauthorized: please log in' });
    try {
      const decoded = jwt.verify(token, secret) as CustomerTokenPayload;
      if (decoded.kind !== 'customer') throw new Error('wrong token kind');
      req.customer = decoded;
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
  };
}

/** Attaches req.customer if a valid session cookie is present, but never blocks
 *  the request — used on public routes (like submitting an inquiry) that work
 *  for guests but should link to an account when the visitor is logged in. */
export function makeOptionalAuthenticateCustomer(secret: string) {
  return function optionalAuthenticateCustomer(req: CustomerRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.[CUSTOMER_SESSION_COOKIE];
    if (token) {
      try {
        const decoded = jwt.verify(token, secret) as CustomerTokenPayload;
        if (decoded.kind === 'customer') req.customer = decoded;
      } catch {
        // ignore invalid/expired token on optional routes
      }
    }
    next();
  };
}

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' }
});

export const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many OTP requests. Please try again later.' }
});
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' }
});

export const generalApiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' }
});

export const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many upload requests. Please try again later.' }
});

export const inquiryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many inquiries submitted. Please try again later.' }
});
