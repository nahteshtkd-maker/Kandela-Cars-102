import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Vehicle, InquiryMessage, DashboardStats, Customer, CustomerAuthProvider, FinanceInquiry, CommissionRecord, CommissionGoals, CommissionSummary, GoalProgress } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  target: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

interface Favorite {
  id: string;
  customerId: string;
  vehicleId: string;
  createdAt: string;
}

interface StoredCustomer extends Customer {
  passwordHash?: string;
  googleId?: string;
}

interface OtpRecord {
  phone: string;
  codeHash: string;
  expiresAt: string;
  attempts: number;
}

interface Schema {
  vehicles: Vehicle[];
  messages: InquiryMessage[];
  customers: StoredCustomer[];
  favorites: Favorite[];
  otpRequests: OtpRecord[];
  financeInquiries: FinanceInquiry[];
  commissionRecords: CommissionRecord[];
  commissionGoals: CommissionGoals;
  admin: {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: AdminRole;
    mustChangePassword: boolean;
    failedLoginAttempts: number;
    lockedUntil: string | null;
  };
  auditLog: AuditLogEntry[];
}

// Initial realistic seed data for Kandela Cars (Ethiopian Dealership)
const RAW_SEED_VEHICLES: Array<Omit<Vehicle, "published" | "priceType" | "financingAvailable">> = [
  {
    id: 'veh-lc300-2024',
    make: 'Toyota',
    model: 'Land Cruiser 300 VXR',
    year: 2024,
    price: 28500000,
    currency: 'ETB',
    mileage: 4500,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '3.5L V6 Twin-Turbo (409 HP)',
    bodyType: 'SUV',
    driveType: '4WD',
    condition: 'Brand New',
    exteriorColor: 'Super White',
    interiorColor: 'Beige Premium Leather',
    importedFrom: 'Dubai, UAE',
    plateNumber: 'Unregistered Code 3',
    description: 'Flagship luxury off-road SUV. Full options VXR edition featuring 12.3-inch touchscreen, JBL 14-speaker sound system, rear seat entertainment screens, crawl control, and active height suspension. Perfect for Ethiopian road conditions.',
    features: [
      'Sunroof',
      'Leather Seats',
      '360 Camera',
      'Adaptive Cruise Control',
      'JBL Sound System',
      'Heated & Ventilated Seats',
      'Apple CarPlay & Android Auto',
      'Crawl Control',
      'Power Tailgate',
      'Head-Up Display'
    ],
    images: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
    status: 'Available',
    featured: true,
    newArrival: true,
    hotDeal: true,
    createdAt: new Date('2026-07-28').toISOString(),
    updatedAt: new Date('2026-07-28').toISOString()
  },
  {
    id: 'veh-byd-atto3-2024',
    make: 'BYD',
    model: 'Atto 3 EV Design',
    year: 2024,
    price: 8800000,
    currency: 'ETB',
    mileage: 1200,
    fuelType: 'Electric',
    transmission: 'Automatic',
    engine: 'Single Motor 150kW (201 HP) 60.4 kWh Blade Battery',
    bodyType: 'Crossover',
    driveType: 'FWD',
    condition: 'Brand New',
    exteriorColor: 'Ski White',
    interiorColor: 'Eclipse Blue & Grey Synthetic Leather',
    importedFrom: 'Shanghai, China',
    plateNumber: 'Unregistered Code 3 EV',
    description: 'Ultra-modern 100% electric crossover powered by BYD revolutionary Blade Battery with 420km range. Features rotating 12.8-inch touchscreen, panoramic glass roof, ambient lighting, and mobile app connectivity.',
    features: [
      'Panoramic Sunroof',
      'Rotating Touchscreen',
      'Blade Battery (420km Range)',
      '360 Degree Camera',
      'Wireless Phone Charger',
      'Keyless Entry & Push Start',
      'Ambient Interior Lighting',
      'Radar Blind Spot Detection'
    ],
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    status: 'Available',
    featured: true,
    newArrival: true,
    hotDeal: false,
    createdAt: new Date('2026-07-29').toISOString(),
    updatedAt: new Date('2026-07-29').toISOString()
  },
  {
    id: 'veh-g63-2023',
    make: 'Mercedes-Benz',
    model: 'G 63 AMG Biturbo',
    year: 2023,
    price: 42000000,
    currency: 'ETB',
    mileage: 8900,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '4.0L V8 Biturbo (577 HP)',
    bodyType: 'SUV',
    driveType: 'AWD',
    condition: 'Slightly Used',
    exteriorColor: 'Obsidian Black Metallic',
    interiorColor: 'Nappa Red & Black Leather',
    importedFrom: 'Stuttgart, Germany',
    plateNumber: 'AA 3-C99882',
    description: 'The ultimate luxury performance off-roader. AMG Performance exhaust, Burmester Surround Sound, Exclusive Interior Package Plus, and carbon fiber accents throughout.',
    features: [
      'AMG Night Package',
      'Burmester 3D Surround Sound',
      'AMG Performance Exhaust',
      'Massage & Climate Seats',
      'Carbon Fiber Steering Wheel',
      '360 Surround View',
      'Differential Locks'
    ],
    images: [
      'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80',
    status: 'Available',
    featured: true,
    newArrival: false,
    hotDeal: true,
    createdAt: new Date('2026-07-25').toISOString(),
    updatedAt: new Date('2026-07-25').toISOString()
  },
  {
    id: 'veh-tucson-2024',
    make: 'Hyundai',
    model: 'Tucson Limited AWD',
    year: 2024,
    price: 13500000,
    currency: 'ETB',
    mileage: 3100,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '2.5L 4-Cylinder GDI (187 HP)',
    bodyType: 'SUV',
    driveType: 'AWD',
    condition: 'Brand New',
    exteriorColor: 'Amazon Gray',
    interiorColor: 'Black Leather',
    importedFrom: 'Korea',
    plateNumber: 'Unregistered Code 3',
    description: 'Futuristic design meets practical versatility. Features digital instrument cluster, remote smart parking assist, panoramic sunroof, and Bose premium audio.',
    features: [
      'Panoramic Sunroof',
      '10.25-inch Digital Cluster',
      'Bose Audio System',
      'Smart Cruise Control',
      'Heated Seats & Steering',
      'Hands-Free Smart Liftgate'
    ],
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8d205293f24?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1609521263047-f8d205293f24?auto=format&fit=crop&w=1200&q=80',
    status: 'Available',
    featured: false,
    newArrival: true,
    hotDeal: false,
    createdAt: new Date('2026-07-30').toISOString(),
    updatedAt: new Date('2026-07-30').toISOString()
  },
  {
    id: 'veh-lx600-2024',
    make: 'Lexus',
    model: 'LX 600 Ultra Luxury',
    year: 2024,
    price: 36000000,
    currency: 'ETB',
    mileage: 2200,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '3.5L Twin-Turbo V6 (409 HP)',
    bodyType: 'SUV',
    driveType: '4WD',
    condition: 'Brand New',
    exteriorColor: 'Eminent White Pearl',
    interiorColor: 'Sunflare Tan Semi-Aniline Leather',
    importedFrom: 'Japan',
    plateNumber: 'Unregistered Code 3',
    description: 'Supreme refinement and commanding presence. Ultra Luxury trim includes executive rear captain seats with ottoman, dual 11.4-inch rear entertainment displays, Mark Levinson 25-speaker 3D audio, and active height control.',
    features: [
      'Rear Seat Ottoman & Massager',
      'Mark Levinson 25-Speaker Audio',
      'Dual Rear Screens',
      'Adaptive Variable Suspension',
      'Cool Box',
      'Wireless Smartphone Charger'
    ],
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    status: 'Available',
    featured: true,
    newArrival: true,
    hotDeal: false,
    createdAt: new Date('2026-07-31').toISOString(),
    updatedAt: new Date('2026-07-31').toISOString()
  },
  {
    id: 'veh-defender-2023',
    make: 'Land Rover',
    model: 'Defender 110 X-Dynamic SE',
    year: 2023,
    price: 24500000,
    currency: 'ETB',
    mileage: 14000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engine: '3.0L i6 Turbo MHEV (395 HP)',
    bodyType: 'SUV',
    driveType: 'AWD',
    condition: 'Slightly Used',
    exteriorColor: 'Gondwana Stone',
    interiorColor: 'Ebony Resistance Seats',
    importedFrom: 'UK',
    plateNumber: 'AA 3-B44120',
    description: 'Iconic adventure SUV equipped with electronic air suspension, Terrain Response 2, Meridian Sound system, 3D Surround Camera, and panoramic sliding roof.',
    features: [
      'Electronic Air Suspension',
      'Terrain Response 2',
      'Meridian Sound System',
      'Sliding Panoramic Roof',
      'Wade Sensing System',
      'Tow Hitch Package'
    ],
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
    status: 'Reserved',
    featured: false,
    newArrival: false,
    hotDeal: false,
    createdAt: new Date('2026-07-20').toISOString(),
    updatedAt: new Date('2026-07-20').toISOString()
  }
];


const SEED_VEHICLES: Vehicle[] = RAW_SEED_VEHICLES.map(v => ({
  ...v,
  published: true,
  priceType: 'Fixed',
  financingAvailable: false
}));
const SEED_MESSAGES: InquiryMessage[] = [
  {
    id: 'msg-1',
    name: 'Abebe Bikila',
    phone: '+251 91 123 4567',
    email: 'abebe.b@gmail.com',
    message: 'Hello Kandela Cars, I am interested in inspecting the Toyota Land Cruiser 300 VXR. Is it available for showroom visit in Bole tomorrow morning?',
    vehicleId: 'veh-lc300-2024',
    vehicleTitle: 'Toyota Land Cruiser 300 VXR (2024)',
    status: 'New',
    createdAt: new Date('2026-08-01T14:20:00Z').toISOString()
  },
  {
    id: 'msg-2',
    name: 'Tigist Haile',
    phone: '+251 91 987 6543',
    email: 'tigist.haile@yahoo.com',
    message: 'Good day. Please send me full bank financing details and tariff breakdown for the BYD Atto 3 EV.',
    vehicleId: 'veh-byd-atto3-2024',
    vehicleTitle: 'BYD Atto 3 EV Design (2024)',
    status: 'Read',
    createdAt: new Date('2026-07-31T09:15:00Z').toISOString()
  }
];

const DEFAULT_COMMISSION_RATE = 0.02; // 2% per sale, per Kandela Cars' business model

export class Database {
  private data: Schema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): Schema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return this.migrate(parsed);
      } catch (err) {
        console.error('Failed to parse db.json, re-initializing', err);
      }
    }

    // Admin credentials must come from the environment. If ADMIN_INITIAL_PASSWORD
    // isn't set, generate a random one-time password and force a change on first login
    // rather than shipping a guessable default.
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || crypto.randomBytes(9).toString('base64url');
    const usedGeneratedPassword = !process.env.ADMIN_INITIAL_PASSWORD;
    const defaultSalt = bcrypt.genSaltSync(10);
    const defaultHash = bcrypt.hashSync(initialPassword, defaultSalt);

    const initialData: Schema = {
      vehicles: SEED_VEHICLES,
      messages: SEED_MESSAGES,
      customers: [],
      favorites: [],
      otpRequests: [],
      financeInquiries: [],
      commissionRecords: [],
      commissionGoals: { weekly: 0, monthly: 0, annual: 0, updatedAt: new Date().toISOString() },
      admin: {
        id: 'admin-1',
        email: process.env.ADMIN_INITIAL_EMAIL || 'admin@kandelacars.et',
        passwordHash: defaultHash,
        name: 'Kandela Admin',
        role: 'super_admin',
        mustChangePassword: true,
        failedLoginAttempts: 0,
        lockedUntil: null
      },
      auditLog: []
    };

    this.saveData(initialData);

    if (usedGeneratedPassword) {
      // Printed once, at first boot only. Not persisted anywhere in plaintext.
      console.log('\n==============================================');
      console.log(' FIRST-RUN ADMIN ACCOUNT CREATED');
      console.log(` Email:    ${initialData.admin.email}`);
      console.log(` Password: ${initialPassword}`);
      console.log(' You will be required to change this password on first login.');
      console.log(' Set ADMIN_INITIAL_PASSWORD in your .env to control this next time.');
      console.log('==============================================\n');
    }

    return initialData;
  }

  // Backfill fields for schemas written before role/audit/lockout support existed.
  private migrate(data: any): Schema {
    if (!data.admin.role) data.admin.role = 'super_admin';
    if (typeof data.admin.mustChangePassword !== 'boolean') data.admin.mustChangePassword = false;
    if (typeof data.admin.failedLoginAttempts !== 'number') data.admin.failedLoginAttempts = 0;
    if (data.admin.lockedUntil === undefined) data.admin.lockedUntil = null;
    if (!Array.isArray(data.auditLog)) data.auditLog = [];
    if (Array.isArray(data.vehicles)) {
      data.vehicles.forEach((v: any) => {
        if (typeof v.published !== 'boolean') v.published = true;
        if (!v.priceType) v.priceType = 'Fixed';
        if (typeof v.financingAvailable !== 'boolean') v.financingAvailable = false;
      });
    }
    if (!Array.isArray(data.customers)) data.customers = [];
    if (!Array.isArray(data.favorites)) data.favorites = [];
    if (!Array.isArray(data.otpRequests)) data.otpRequests = [];
    if (!Array.isArray(data.financeInquiries)) data.financeInquiries = [];
    if (!Array.isArray(data.commissionRecords)) data.commissionRecords = [];
    if (!data.commissionGoals) {
      data.commissionGoals = { weekly: 0, monthly: 0, annual: 0, updatedAt: new Date().toISOString() };
    }
    return data as Schema;
  }

  private saveData(data: Schema) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Vehicles
  public getVehicles(filters: any = {}, options: { publicOnly?: boolean } = {}): { vehicles: Vehicle[]; total: number } {
    let list = [...this.data.vehicles];

    // The public API must never return draft vehicles. Admin callers pass
    // publicOnly: false to see everything, including drafts, for management.
    if (options.publicOnly !== false) {
      list = list.filter(v => v.published !== false);
    }

    // Search query across Make, Model, Engine, Description
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        v =>
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.engine.toLowerCase().includes(q) ||
          v.year.toString().includes(q)
      );
    }

    if (filters.make && filters.make !== 'All') {
      list = list.filter(v => v.make.toLowerCase() === filters.make.toLowerCase());
    }

    if (filters.model && filters.model !== 'All') {
      list = list.filter(v => v.model.toLowerCase() === filters.model.toLowerCase());
    }

    if (filters.fuelType && filters.fuelType !== 'All') {
      list = list.filter(v => v.fuelType.toLowerCase() === filters.fuelType.toLowerCase());
    }

    if (filters.transmission && filters.transmission !== 'All') {
      list = list.filter(v => v.transmission.toLowerCase() === filters.transmission.toLowerCase());
    }

    if (filters.bodyType && filters.bodyType !== 'All') {
      list = list.filter(v => v.bodyType.toLowerCase() === filters.bodyType.toLowerCase());
    }

    if (filters.condition && filters.condition !== 'All') {
      const cond = filters.condition.toLowerCase();
      if (cond === 'new') {
        list = list.filter(v => v.condition.toLowerCase().includes('new'));
      } else if (cond === 'used') {
        list = list.filter(v => v.condition.toLowerCase().includes('used'));
      } else {
        list = list.filter(v => v.condition.toLowerCase() === cond);
      }
    }

    if (filters.status && filters.status !== 'All') {
      list = list.filter(v => v.status.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.featured === true || filters.featured === 'true') {
      list = list.filter(v => v.featured === true);
    }

    // Reuses the existing financing fields rather than a separate flag —
    // "Bank Loan" is one of the financingType options a vehicle can have.
    if (filters.bankLoan === true || filters.bankLoan === 'true') {
      list = list.filter(v => v.financingAvailable === true && v.financingType === 'Bank Loan');
    }

    if (filters.yearMin) {
      list = list.filter(v => v.year >= Number(filters.yearMin));
    }
    if (filters.yearMax) {
      list = list.filter(v => v.year <= Number(filters.yearMax));
    }

    if (filters.priceMin) {
      list = list.filter(v => v.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      list = list.filter(v => v.price <= Number(filters.priceMax));
    }

    // Sort
    const sort = filters.sort || 'newest';
    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'mileage-asc') {
      list.sort((a, b) => a.mileage - b.mileage);
    }

    const total = list.length;
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 50;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return { vehicles: paginated, total };
  }

  public getVehicleById(id: string, options: { publicOnly?: boolean } = {}): Vehicle | null {
    const vehicle = this.data.vehicles.find(v => v.id === id) || null;
    if (vehicle && options.publicOnly !== false && vehicle.published === false) return null;
    return vehicle;
  }

  public createVehicle(vehicleData: Partial<Vehicle>): Vehicle {
    const id = 'veh-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();

    const newVehicle: Vehicle = {
      id,
      make: vehicleData.make || 'Toyota',
      model: vehicleData.model || 'Model',
      year: Number(vehicleData.year) || new Date().getFullYear(),
      price: Number(vehicleData.price) || 0,
      currency: vehicleData.currency || 'ETB',
      priceType: vehicleData.priceType || 'Fixed',
      mileage: Number(vehicleData.mileage) || 0,
      fuelType: vehicleData.fuelType || 'Petrol',
      transmission: vehicleData.transmission || 'Automatic',
      engine: vehicleData.engine || '',
      bodyType: vehicleData.bodyType || 'SUV',
      driveType: vehicleData.driveType || '4WD',
      condition: vehicleData.condition || 'Brand New',
      exteriorColor: vehicleData.exteriorColor || '',
      interiorColor: vehicleData.interiorColor || '',
      importedFrom: vehicleData.importedFrom || '',
      plateNumber: vehicleData.plateNumber || '',
      description: vehicleData.description || '',
      features: Array.isArray(vehicleData.features) ? vehicleData.features : [],
      images: Array.isArray(vehicleData.images) && vehicleData.images.length > 0
        ? vehicleData.images
        : ['https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80'],
      primaryImage: vehicleData.primaryImage || vehicleData.images?.[0] || 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
      status: vehicleData.status || 'Available',
      published: vehicleData.published === true,
      featured: Boolean(vehicleData.featured),
      newArrival: Boolean(vehicleData.newArrival),
      hotDeal: Boolean(vehicleData.hotDeal),
      financingAvailable: Boolean(vehicleData.financingAvailable),
      financingType: vehicleData.financingAvailable ? vehicleData.financingType : undefined,
      lenderName: vehicleData.financingAvailable ? vehicleData.lenderName : undefined,
      minDownPaymentPercent: vehicleData.financingAvailable ? vehicleData.minDownPaymentPercent : undefined,
      maxLoanTermMonths: vehicleData.financingAvailable ? vehicleData.maxLoanTermMonths : undefined,
      annualInterestRate: vehicleData.financingAvailable ? vehicleData.annualInterestRate : undefined,
      financeNotes: vehicleData.financingAvailable ? vehicleData.financeNotes : undefined,
      createdAt: now,
      updatedAt: now
    };

    this.data.vehicles.unshift(newVehicle);
    this.saveData(this.data);
    return newVehicle;
  }

  public updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const idx = this.data.vehicles.findIndex(v => v.id === id);
    if (idx === -1) return null;

    const existing = this.data.vehicles[idx];
    const updated: Vehicle = {
      ...existing,
      ...updates,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };

    if (updates.images && updates.images.length > 0 && !updates.primaryImage) {
      updated.primaryImage = updates.images[0];
    }

    if (updated.financingAvailable === false) {
      updated.financingType = undefined;
      updated.lenderName = undefined;
      updated.minDownPaymentPercent = undefined;
      updated.maxLoanTermMonths = undefined;
      updated.annualInterestRate = undefined;
      updated.financeNotes = undefined;
    }

    this.data.vehicles[idx] = updated;

    if (existing.status !== 'Sold' && updated.status === 'Sold') {
      this.createCommissionRecord(updated, false);
    }

    this.saveData(this.data);
    return updated;
  }

  public deleteVehicle(id: string): boolean {
    const initialLen = this.data.vehicles.length;
    this.data.vehicles = this.data.vehicles.filter(v => v.id !== id);
    if (this.data.vehicles.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Makes & Models helper
  public getMakesAndModels(): { makes: string[]; modelsByMake: Record<string, string[]> } {
    const makesSet = new Set<string>();
    const modelsByMake: Record<string, Set<string>> = {};

    this.data.vehicles.forEach(v => {
      makesSet.add(v.make);
      if (!modelsByMake[v.make]) {
        modelsByMake[v.make] = new Set();
      }
      modelsByMake[v.make].add(v.model);
    });

    const makes = Array.from(makesSet).sort();
    const resultModels: Record<string, string[]> = {};
    Object.keys(modelsByMake).forEach(m => {
      resultModels[m] = Array.from(modelsByMake[m]).sort();
    });

    return { makes, modelsByMake: resultModels };
  }

  // Messages
  public getMessages(): InquiryMessage[] {
    return [...this.data.messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getMessagesByCustomer(customerId: string): InquiryMessage[] {
    return this.data.messages
      .filter(m => m.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createMessage(msgData: Partial<InquiryMessage>): InquiryMessage {
    const id = 'msg-' + Date.now();
    const newMessage: InquiryMessage = {
      id,
      name: msgData.name || 'Anonymous',
      phone: msgData.phone || '',
      email: msgData.email || '',
      message: msgData.message || '',
      vehicleId: msgData.vehicleId,
      vehicleTitle: msgData.vehicleTitle,
      customerId: msgData.customerId,
      status: 'New',
      createdAt: new Date().toISOString()
    };

    this.data.messages.unshift(newMessage);
    this.saveData(this.data);
    return newMessage;
  }

  public updateMessageStatus(id: string, status: InquiryMessage['status']): InquiryMessage | null {
    const msg = this.data.messages.find(m => m.id === id);
    if (!msg) return null;
    msg.status = status;
    this.saveData(this.data);
    return msg;
  }

  public deleteMessage(id: string): boolean {
    const len = this.data.messages.length;
    this.data.messages = this.data.messages.filter(m => m.id !== id);
    if (this.data.messages.length !== len) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Dashboard Stats
  public getStats(): DashboardStats {
    const totalVehicles = this.data.vehicles.length;
    const availableVehicles = this.data.vehicles.filter(v => v.status === 'Available').length;
    const soldVehicles = this.data.vehicles.filter(v => v.status === 'Sold').length;
    const featuredVehicles = this.data.vehicles.filter(v => v.featured).length;
    const draftVehicles = this.data.vehicles.filter(v => v.published === false).length;
    const newMessages = this.data.messages.filter(m => m.status === 'New').length;
    const totalInquiries = this.data.messages.length;

    return {
      totalVehicles,
      availableVehicles,
      soldVehicles,
      featuredVehicles,
      draftVehicles,
      newMessages,
      totalInquiries
    };
  }

  // Admin User Auth
  public getAdmin() {
    return this.data.admin;
  }

  /** Admin object safe to send to the client / put in a JWT payload. */
  public getAdminSafe() {
    const { passwordHash, ...safe } = this.data.admin;
    return safe;
  }

  public isLockedOut(): boolean {
    const until = this.data.admin.lockedUntil;
    if (!until) return false;
    return new Date(until).getTime() > Date.now();
  }

  public verifyPassword(plain: string): boolean {
    const ok = bcrypt.compareSync(plain, this.data.admin.passwordHash);
    if (ok) {
      this.data.admin.failedLoginAttempts = 0;
      this.data.admin.lockedUntil = null;
    } else {
      this.data.admin.failedLoginAttempts += 1;
      // Lock out for 15 minutes after 5 consecutive failures.
      if (this.data.admin.failedLoginAttempts >= 5) {
        this.data.admin.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      }
    }
    this.saveData(this.data);
    return ok;
  }

  public changePassword(currentPassword: string, newPassword: string): boolean {
    if (!bcrypt.compareSync(currentPassword, this.data.admin.passwordHash)) {
      return false;
    }
    this.data.admin.passwordHash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    this.data.admin.mustChangePassword = false;
    this.saveData(this.data);
    return true;
  }

  // Audit log
  public addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>) {
    const record: AuditLogEntry = {
      ...entry,
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      createdAt: new Date().toISOString()
    };
    this.data.auditLog.unshift(record);
    // Keep the log from growing unbounded on the JSON-file backend.
    if (this.data.auditLog.length > 2000) {
      this.data.auditLog = this.data.auditLog.slice(0, 2000);
    }
    this.saveData(this.data);
    return record;
  }

  public getAuditLog(limit = 200): AuditLogEntry[] {
    return this.data.auditLog.slice(0, limit);
  }

  // --- Customer accounts ---

  public findCustomerByEmail(email: string): StoredCustomer | null {
    return this.data.customers.find(c => c.email?.toLowerCase() === email.toLowerCase()) || null;
  }

  public findCustomerByPhone(phone: string): StoredCustomer | null {
    return this.data.customers.find(c => c.phone === phone) || null;
  }

  public findCustomerByGoogleId(googleId: string): StoredCustomer | null {
    return this.data.customers.find(c => c.googleId === googleId) || null;
  }

  public getCustomerById(id: string): Customer | null {
    const c = this.data.customers.find(c => c.id === id);
    if (!c) return null;
    const { passwordHash, googleId, ...safe } = c;
    return safe;
  }

  public createCustomer(data: {
    name: string;
    email?: string;
    phone?: string;
    passwordHash?: string;
    googleId?: string;
    avatarUrl?: string;
    authProvider: CustomerAuthProvider;
  }): Customer {
    const customer: StoredCustomer = {
      id: 'cust-' + crypto.randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatarUrl: data.avatarUrl,
      authProvider: data.authProvider,
      passwordHash: data.passwordHash,
      googleId: data.googleId,
      createdAt: new Date().toISOString()
    };
    this.data.customers.push(customer);
    this.saveData(this.data);
    const { passwordHash, googleId, ...safe } = customer;
    return safe;
  }

  public verifyCustomerPassword(customer: StoredCustomer, plain: string): boolean {
    if (!customer.passwordHash) return false;
    return bcrypt.compareSync(plain, customer.passwordHash);
  }

  // --- Favorites ---

  public getFavoriteVehicleIds(customerId: string): string[] {
    return this.data.favorites.filter(f => f.customerId === customerId).map(f => f.vehicleId);
  }

  public getFavoriteVehicles(customerId: string): Vehicle[] {
    const ids = new Set(this.getFavoriteVehicleIds(customerId));
    return this.data.vehicles.filter(v => ids.has(v.id));
  }

  public addFavorite(customerId: string, vehicleId: string): void {
    const exists = this.data.favorites.some(f => f.customerId === customerId && f.vehicleId === vehicleId);
    if (exists) return;
    this.data.favorites.push({
      id: 'fav-' + crypto.randomUUID(),
      customerId,
      vehicleId,
      createdAt: new Date().toISOString()
    });
    this.saveData(this.data);
  }

  public removeFavorite(customerId: string, vehicleId: string): void {
    const before = this.data.favorites.length;
    this.data.favorites = this.data.favorites.filter(
      f => !(f.customerId === customerId && f.vehicleId === vehicleId)
    );
    if (this.data.favorites.length !== before) this.saveData(this.data);
  }

  // --- Phone OTP ---
  // Hashed + expiring, same pattern as admin password handling. Delivery is
  // pluggable: server.ts logs the code to the console when no SMS provider is
  // configured (dev), or calls a real provider once one is wired up (prod).

  public createOtp(phone: string, code: string): void {
    this.data.otpRequests = this.data.otpRequests.filter(o => o.phone !== phone);
    this.data.otpRequests.push({
      phone,
      codeHash: bcrypt.hashSync(code, bcrypt.genSaltSync(8)),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      attempts: 0
    });
    this.saveData(this.data);
  }

  public verifyOtp(phone: string, code: string): boolean {
    const record = this.data.otpRequests.find(o => o.phone === phone);
    if (!record) return false;
    if (new Date(record.expiresAt).getTime() < Date.now()) {
      this.data.otpRequests = this.data.otpRequests.filter(o => o.phone !== phone);
      this.saveData(this.data);
      return false;
    }
    record.attempts += 1;
    if (record.attempts > 5) {
      this.data.otpRequests = this.data.otpRequests.filter(o => o.phone !== phone);
      this.saveData(this.data);
      return false;
    }
    const ok = bcrypt.compareSync(code, record.codeHash);
    if (ok) {
      this.data.otpRequests = this.data.otpRequests.filter(o => o.phone !== phone);
    }
    this.saveData(this.data);
    return ok;
  }

  // --- Finance inquiries ---

  public createFinanceInquiry(data: Omit<FinanceInquiry, 'id' | 'status' | 'createdAt'>): FinanceInquiry {
    const record: FinanceInquiry = {
      ...data,
      id: 'fin-' + crypto.randomUUID(),
      status: 'New',
      createdAt: new Date().toISOString()
    };
    this.data.financeInquiries.unshift(record);
    this.saveData(this.data);
    return record;
  }

  public getFinanceInquiries(): FinanceInquiry[] {
    return this.data.financeInquiries;
  }

  public updateFinanceInquiryStatus(id: string, status: FinanceInquiry['status']): FinanceInquiry | null {
    const idx = this.data.financeInquiries.findIndex(f => f.id === id);
    if (idx === -1) return null;
    this.data.financeInquiries[idx].status = status;
    this.saveData(this.data);
    return this.data.financeInquiries[idx];
  }

  // --- Commission tracking (admin-only) ---
  // Never returned from any public/unauthenticated route.

  /** Called automatically when a vehicle's status transitions to Sold.
   *  persist=false lets updateVehicle batch this into its own single save. */
  private createCommissionRecord(vehicle: Vehicle, persist = true): CommissionRecord {
    const rate = DEFAULT_COMMISSION_RATE;
    const record: CommissionRecord = {
      id: 'comm-' + crypto.randomUUID(),
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      salePrice: vehicle.price,
      commissionRate: rate,
      commissionAmount: Math.round(vehicle.price * rate),
      isManualOverride: false,
      soldAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.commissionRecords.unshift(record);
    if (persist) this.saveData(this.data);
    return record;
  }

  public getCommissionRecords(): CommissionRecord[] {
    return this.data.commissionRecords;
  }

  public updateCommissionRecord(
    id: string,
    updates: { commissionAmount?: number; commissionRate?: number; notes?: string }
  ): CommissionRecord | null {
    const idx = this.data.commissionRecords.findIndex(c => c.id === id);
    if (idx === -1) return null;
    const record = this.data.commissionRecords[idx];

    if (updates.commissionRate != null) {
      record.commissionRate = updates.commissionRate;
      // Recompute amount from the rate unless an explicit amount override was also given.
      record.commissionAmount = Math.round(record.salePrice * updates.commissionRate);
    }
    if (updates.commissionAmount != null) {
      record.commissionAmount = updates.commissionAmount;
    }
    if (updates.notes !== undefined) {
      record.notes = updates.notes;
    }
    record.isManualOverride = true;
    record.updatedAt = new Date().toISOString();

    this.data.commissionRecords[idx] = record;
    this.saveData(this.data);
    return record;
  }

  public getCommissionGoals(): CommissionGoals {
    return this.data.commissionGoals;
  }

  public setCommissionGoals(goals: { weekly: number; monthly: number; annual: number }): CommissionGoals {
    this.data.commissionGoals = { ...goals, updatedAt: new Date().toISOString() };
    this.saveData(this.data);
    return this.data.commissionGoals;
  }

  public getCommissionSummary(): CommissionSummary {
    const now = new Date();

    // Week starts Monday.
    const dayOfWeek = (now.getDay() + 6) % 7;
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(now.getDate() - dayOfWeek);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const records = this.data.commissionRecords;
    const since = (start: Date) => records.filter(r => new Date(r.soldAt).getTime() >= start.getTime());

    const weekRecords = since(weekStart);
    const monthRecords = since(monthStart);
    const yearRecords = since(yearStart);

    const sumCommission = (recs: CommissionRecord[]) => recs.reduce((sum, r) => sum + r.commissionAmount, 0);
    const totalCommissionEarned = sumCommission(records);

    const goals = this.data.commissionGoals;
    const progress = (target: number, earned: number): GoalProgress => ({
      target,
      earned,
      remaining: Math.max(target - earned, 0),
      progressPercent: target > 0 ? Math.min(Math.round((earned / target) * 100), 100) : 0
    });

    return {
      carsSoldThisWeek: weekRecords.length,
      carsSoldThisMonth: monthRecords.length,
      carsSoldThisYear: yearRecords.length,
      commissionThisWeek: sumCommission(weekRecords),
      commissionThisMonth: sumCommission(monthRecords),
      commissionThisYear: sumCommission(yearRecords),
      totalCommissionEarned,
      goals: {
        weekly: progress(goals.weekly, sumCommission(weekRecords)),
        monthly: progress(goals.monthly, sumCommission(monthRecords)),
        annual: progress(goals.annual, sumCommission(yearRecords))
      }
    };
  }
}

export const db = new Database();
