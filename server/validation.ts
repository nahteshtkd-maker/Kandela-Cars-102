import { z } from 'zod';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'] as const;
const TRANSMISSIONS = ['Automatic', 'Manual', 'Tiptronic'] as const;
const BODY_TYPES = ['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Coupe', 'Van', 'Crossover'] as const;
const DRIVE_TYPES = ['4WD', 'AWD', 'FWD', 'RWD'] as const;
const CONDITIONS = ['Brand New', 'Slightly Used', 'Ethiopian Used', 'Imported / Unregistered'] as const;

export const customerSignupSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(200)
});

export const customerLoginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200)
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(20).max(4000)
});

// E.164-ish: + followed by 8-15 digits. Loose on purpose — real validation of
// Ethiopian numbers happens at the SMS provider once one is configured.
const PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

export const otpRequestSchema = z.object({
  phone: z.string().trim().regex(PHONE_REGEX, 'Phone must be in international format, e.g. +251911234567')
});

export const otpVerifySchema = z.object({
  phone: z.string().trim().regex(PHONE_REGEX),
  code: z.string().trim().length(6).regex(/^\d{6}$/),
  name: z.string().trim().min(1).max(120).optional()
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200)
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(10).max(200)
});

// Loose but bounded — this mirrors the existing Vehicle shape in src/types.ts.
// Anything not listed here is stripped by .strip() so clients can't smuggle
// extra fields (e.g. id, createdAt) into a create/update payload.
export const vehicleSchema = z
  .object({
    make: z.string().trim().min(1).max(60),
    model: z.string().trim().min(1).max(120),
    year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1),
    price: z.coerce.number().min(0).max(1_000_000_000),
    currency: z.string().trim().max(10).default('ETB'),
    priceType: z.enum(['Fixed', 'Negotiable', 'ContactForPrice']).optional().default('Fixed'),
    mileage: z.coerce.number().min(0).max(2_000_000),
    fuelType: z.enum(FUEL_TYPES),
    transmission: z.enum(TRANSMISSIONS),
    engine: z.string().trim().max(200),
    bodyType: z.enum(BODY_TYPES),
    driveType: z.enum(DRIVE_TYPES),
    condition: z.enum(CONDITIONS),
    exteriorColor: z.string().trim().max(60).optional().default(''),
    interiorColor: z.string().trim().max(60).optional().default(''),
    importedFrom: z.string().trim().max(100).optional().default(''),
    plateNumber: z.string().trim().max(60).optional().default(''),
    description: z.string().trim().max(5000).optional().default(''),
    features: z.array(z.string().trim().max(100)).max(40).optional().default([]),
    images: z.array(z.string().trim().max(2000)).max(30).optional().default([]),
    primaryImage: z.string().trim().max(2000).optional(),
    status: z.enum(['Available', 'Reserved', 'Sold']).optional().default('Available'),
    published: z.coerce.boolean().optional().default(false),
    featured: z.coerce.boolean().optional().default(false),
    newArrival: z.coerce.boolean().optional().default(false),
    hotDeal: z.coerce.boolean().optional().default(false),
    financingAvailable: z.coerce.boolean().optional().default(false),
    financingType: z.enum(['Bank Loan', 'Microfinance', 'Interest-Free Financing', 'Other']).optional(),
    lenderName: z.string().trim().max(120).optional(),
    minDownPaymentPercent: z.coerce.number().min(0).max(100).optional(),
    maxLoanTermMonths: z.coerce.number().int().min(1).max(120).optional(),
    annualInterestRate: z.coerce.number().min(0).max(100).optional(),
    financeNotes: z.string().trim().max(1000).optional()
  })
  .strip();

export const vehicleUpdateSchema = z
  .object({
    make: z.string().trim().min(1).max(60).optional(),
    model: z.string().trim().min(1).max(120).optional(),
    year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1).optional(),
    price: z.coerce.number().min(0).max(1_000_000_000).optional(),
    currency: z.string().trim().max(10).optional(),
    priceType: z.enum(['Fixed', 'Negotiable', 'ContactForPrice']).optional(),
    mileage: z.coerce.number().min(0).max(2_000_000).optional(),
    fuelType: z.enum(FUEL_TYPES).optional(),
    transmission: z.enum(TRANSMISSIONS).optional(),
    engine: z.string().trim().max(200).optional(),
    bodyType: z.enum(BODY_TYPES).optional(),
    driveType: z.enum(DRIVE_TYPES).optional(),
    condition: z.enum(CONDITIONS).optional(),
    exteriorColor: z.string().trim().max(60).optional(),
    interiorColor: z.string().trim().max(60).optional(),
    importedFrom: z.string().trim().max(100).optional(),
    plateNumber: z.string().trim().max(60).optional(),
    description: z.string().trim().max(5000).optional(),
    features: z.array(z.string().trim().max(100)).max(40).optional(),
    images: z.array(z.string().trim().max(2000)).max(30).optional(),
    primaryImage: z.string().trim().max(2000).optional(),
    status: z.enum(['Available', 'Reserved', 'Sold']).optional(),
    published: z.coerce.boolean().optional(),
    featured: z.coerce.boolean().optional(),
    newArrival: z.coerce.boolean().optional(),
    hotDeal: z.coerce.boolean().optional(),
    financingAvailable: z.coerce.boolean().optional(),
    financingType: z.enum(['Bank Loan', 'Microfinance', 'Interest-Free Financing', 'Other']).optional(),
    lenderName: z.string().trim().max(120).optional(),
    minDownPaymentPercent: z.coerce.number().min(0).max(100).optional(),
    maxLoanTermMonths: z.coerce.number().int().min(1).max(120).optional(),
    annualInterestRate: z.coerce.number().min(0).max(100).optional(),
    financeNotes: z.string().trim().max(1000).optional()
  })
  .strip();

export const financeInquirySchema = z.object({
  vehicleId: z.string().trim().min(1).max(100),
  vehicleName: z.string().trim().min(1).max(200),
  vehiclePrice: z.coerce.number().min(0).max(1_000_000_000),
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(30),
  email: z.string().trim().email().max(200).optional().or(z.literal('')),
  downPayment: z.coerce.number().min(0).max(1_000_000_000).optional(),
  loanTermMonths: z.coerce.number().int().min(1).max(120).optional(),
  financingType: z.string().trim().max(60).optional(),
  message: z.string().trim().max(2000).optional()
});

export const financeInquiryStatusSchema = z.object({
  status: z.enum(['New', 'Contacted', 'Closed'])
});

export const messageSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    phone: z.string().trim().max(30).optional().default(''),
    email: z.string().trim().email().max(200).optional().or(z.literal('')).default(''),
    message: z.string().trim().max(3000).optional().default(''),
    vehicleId: z.string().trim().max(100).optional(),
    vehicleTitle: z.string().trim().max(200).optional()
  })
  .strip()
  .refine(data => data.phone || data.email, {
    message: 'Either phone or email is required'
  });

export const messageStatusSchema = z.object({
  status: z.enum(['New', 'Read', 'Contacted', 'Archived', 'Closed'])
});

export const commissionUpdateSchema = z.object({
  commissionAmount: z.coerce.number().min(0).max(1_000_000_000).optional(),
  commissionRate: z.coerce.number().min(0).max(1).optional(),
  notes: z.string().trim().max(1000).optional()
});

export const commissionGoalsSchema = z.object({
  weekly: z.coerce.number().min(0).max(1_000_000_000),
  monthly: z.coerce.number().min(0).max(1_000_000_000),
  annual: z.coerce.number().min(0).max(1_000_000_000)
});
