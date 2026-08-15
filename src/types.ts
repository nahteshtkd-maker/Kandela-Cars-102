export type VehicleStatus = 'Available' | 'Reserved' | 'Sold';

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid';

export type TransmissionType = 'Automatic' | 'Manual' | 'Tiptronic';

export type BodyType = 'SUV' | 'Sedan' | 'Hatchback' | 'Pickup' | 'Coupe' | 'Van' | 'Crossover';

export type VehicleCondition = 'Brand New' | 'Slightly Used' | 'Ethiopian Used' | 'Imported / Unregistered';

export type PriceType = 'Fixed' | 'Negotiable' | 'ContactForPrice';

export type FinancingType = 'Bank Loan' | 'Microfinance' | 'Interest-Free Financing' | 'Other';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string; // Default "ETB"
  priceType: PriceType;
  mileage: number; // in KM
  fuelType: FuelType;
  transmission: TransmissionType;
  engine: string;
  bodyType: BodyType;
  driveType: '4WD' | 'AWD' | 'FWD' | 'RWD';
  condition: VehicleCondition;
  exteriorColor: string;
  interiorColor: string;
  importedFrom?: string;
  plateNumber?: string;
  description: string;
  features: string[];
  images: string[];
  primaryImage: string;
  status: VehicleStatus;
  /** Draft/Published gate — only published vehicles are ever returned by the
   *  public API. Independent of `status`, which tracks sale progress. */
  published: boolean;
  featured: boolean;
  newArrival: boolean;
  hotDeal: boolean;
  // Financing is opt-in per vehicle. When financingAvailable is false, none of
  // the fields below should ever be rendered on the public site.
  financingAvailable: boolean;
  financingType?: FinancingType;
  lenderName?: string;
  minDownPaymentPercent?: number;
  maxLoanTermMonths?: number;
  annualInterestRate?: number;
  financeNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceInquiry {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehiclePrice: number;
  name: string;
  phone: string;
  email?: string;
  downPayment?: number;
  loanTermMonths?: number;
  financingType?: FinancingType | string;
  message?: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export interface InquiryMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  vehicleId?: string;
  vehicleTitle?: string;
  customerId?: string;
  status: 'New' | 'Read' | 'Contacted' | 'Archived' | 'Closed';
  createdAt: string;
}

export interface SearchFilters {
  search?: string;
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  condition?: string;
  status?: string;
  featured?: boolean;
  bankLoan?: boolean;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'mileage-asc';
  page?: number;
  limit?: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  token?: string;
}

export type CustomerAuthProvider = 'password' | 'google' | 'phone';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  authProvider: CustomerAuthProvider;
  createdAt: string;
}

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  featuredVehicles: number;
  draftVehicles: number;
  newMessages: number;
  totalInquiries: number;
}

// --- Commission & Sales Goals (admin-only, never exposed on public routes) ---

export interface CommissionRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  salePrice: number;
  commissionRate: number; // e.g. 0.02 for 2%
  commissionAmount: number;
  isManualOverride: boolean;
  notes?: string;
  soldAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionGoals {
  weekly: number;
  monthly: number;
  annual: number;
  updatedAt: string;
}

export interface GoalProgress {
  target: number;
  earned: number;
  remaining: number;
  progressPercent: number;
}

export interface CommissionSummary {
  carsSoldThisWeek: number;
  carsSoldThisMonth: number;
  carsSoldThisYear: number;
  commissionThisWeek: number;
  commissionThisMonth: number;
  commissionThisYear: number;
  totalCommissionEarned: number;
  goals: {
    weekly: GoalProgress;
    monthly: GoalProgress;
    annual: GoalProgress;
  };
}
