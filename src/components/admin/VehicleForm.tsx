import React, { useState } from 'react';
import { Save, ArrowLeft, Plus, X, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Vehicle, FuelType, TransmissionType, BodyType, VehicleCondition, VehicleStatus, PriceType, FinancingType } from '../../types';
import { ImageUploader } from './ImageUploader';

interface VehicleFormProps {
  initialVehicle?: Vehicle | null;
  onSave: (data: Partial<Vehicle>) => Promise<void>;
  onCancel: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  initialVehicle,
  onSave,
  onCancel
}) => {
  const isEditing = Boolean(initialVehicle?.id);

  const [make, setMake] = useState(initialVehicle?.make || 'Toyota');
  const [model, setModel] = useState(initialVehicle?.model || '');
  const [year, setYear] = useState<number>(initialVehicle?.year || 2024);
  const [price, setPrice] = useState<number>(initialVehicle?.price || 0);
  const [currency, setCurrency] = useState(initialVehicle?.currency || 'ETB');
  const [priceType, setPriceType] = useState<PriceType>(initialVehicle?.priceType || 'Fixed');
  const [mileage, setMileage] = useState<number>(initialVehicle?.mileage || 0);
  const [fuelType, setFuelType] = useState<FuelType>(initialVehicle?.fuelType || 'Petrol');
  const [transmission, setTransmission] = useState<TransmissionType>(initialVehicle?.transmission || 'Automatic');
  const [engine, setEngine] = useState(initialVehicle?.engine || '');
  const [bodyType, setBodyType] = useState<BodyType>(initialVehicle?.bodyType || 'SUV');
  const [driveType, setDriveType] = useState<'4WD' | 'AWD' | 'FWD' | 'RWD'>(initialVehicle?.driveType || '4WD');
  const [condition, setCondition] = useState<VehicleCondition>(initialVehicle?.condition || 'Brand New');
  const [exteriorColor, setExteriorColor] = useState(initialVehicle?.exteriorColor || '');
  const [interiorColor, setInteriorColor] = useState(initialVehicle?.interiorColor || '');
  const [importedFrom, setImportedFrom] = useState(initialVehicle?.importedFrom || 'Dubai, UAE');
  const [plateNumber, setPlateNumber] = useState(initialVehicle?.plateNumber || 'Unregistered Code 3');
  const [description, setDescription] = useState(initialVehicle?.description || '');
  
  const [features, setFeatures] = useState<string[]>(
    initialVehicle?.features || ['Sunroof', 'Leather Seats', '360 Camera', 'Adaptive Cruise Control', 'Apple CarPlay']
  );
  const [newFeatureInput, setNewFeatureInput] = useState('');

  const [images, setImages] = useState<string[]>(
    initialVehicle?.images || [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80'
    ]
  );
  const [primaryImage, setPrimaryImage] = useState<string>(
    initialVehicle?.primaryImage || initialVehicle?.images?.[0] || 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80'
  );

  const [status, setStatus] = useState<VehicleStatus>(initialVehicle?.status || 'Available');
  const [published, setPublished] = useState<boolean>(initialVehicle?.published ?? false);
  const [featured, setFeatured] = useState<boolean>(initialVehicle?.featured ?? true);
  const [newArrival, setNewArrival] = useState<boolean>(initialVehicle?.newArrival ?? true);
  const [hotDeal, setHotDeal] = useState<boolean>(initialVehicle?.hotDeal ?? false);
  const [financingAvailable, setFinancingAvailable] = useState<boolean>(initialVehicle?.financingAvailable ?? false);
  const [financingType, setFinancingType] = useState<FinancingType>(initialVehicle?.financingType || 'Bank Loan');
  const [lenderName, setLenderName] = useState(initialVehicle?.lenderName || '');
  const [minDownPaymentPercent, setMinDownPaymentPercent] = useState<number | ''>(
    initialVehicle?.minDownPaymentPercent ?? ''
  );
  const [maxLoanTermMonths, setMaxLoanTermMonths] = useState<number | ''>(
    initialVehicle?.maxLoanTermMonths ?? ''
  );
  const [annualInterestRate, setAnnualInterestRate] = useState<number | ''>(
    initialVehicle?.annualInterestRate ?? ''
  );
  const [financeNotes, setFinanceNotes] = useState(initialVehicle?.financeNotes || '');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    if (!features.includes(newFeatureInput.trim())) {
      setFeatures([...features, newFeatureInput.trim()]);
    }
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (feat: string) => {
    setFeatures(features.filter(f => f !== feat));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim()) {
      setError('Please provide Vehicle Make and Model');
      return;
    }
    if (price <= 0) {
      setError('Please enter a valid asking price in ETB');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSave({
        make,
        model,
        year: Number(year),
        price: Number(price),
        currency,
        priceType,
        mileage: Number(mileage),
        fuelType,
        transmission,
        engine,
        bodyType,
        driveType,
        condition,
        exteriorColor,
        interiorColor,
        importedFrom,
        plateNumber,
        description,
        features,
        images,
        primaryImage: primaryImage || images[0],
        status,
        published,
        featured,
        newArrival,
        hotDeal,
        financingAvailable,
        ...(financingAvailable
          ? {
              financingType,
              lenderName,
              minDownPaymentPercent: minDownPaymentPercent === '' ? undefined : Number(minDownPaymentPercent),
              maxLoanTermMonths: maxLoanTermMonths === '' ? undefined : Number(maxLoanTermMonths),
              annualInterestRate: annualInterestRate === '' ? undefined : Number(annualInterestRate),
              financeNotes
            }
          : {})
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl" id="admin-vehicle-form">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-neutral-400 hover:text-white flex items-center space-x-1.5 mb-2 font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 text-red-500" />
            <span>Cancel and Return</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            {isEditing ? `EDIT VEHICLE: ${make} ${model}` : 'ADD NEW VEHICLE'}
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase px-4 py-2.5 rounded-lg transition-colors border border-neutral-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg transition-all shadow-md shadow-red-600/30 flex items-center space-x-2"
            id="save-vehicle-submit-btn"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEditing ? 'UPDATE VEHICLE' : 'SAVE VEHICLE'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-lg font-medium">
          {error}
        </div>
      )}

      {/* SECTION 1: BASIC INFORMATION */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 font-sans border-b border-neutral-800 pb-2">
          1. BASIC INFORMATION
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Make / Brand *</label>
            <input
              type="text"
              required
              value={make}
              onChange={e => setMake(e.target.value)}
              placeholder="e.g. Toyota, BYD, Hyundai, Mercedes-Benz"
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-make-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Model Name *</label>
            <input
              type="text"
              required
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="e.g. Land Cruiser 300 VXR, Atto 3 EV"
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-model-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Manufacturing Year *</label>
            <input
              type="number"
              required
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-year-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Asking Price (ETB) *</label>
            <input
              type="number"
              required
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              placeholder="e.g. 28500000"
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600 font-bold"
              id="form-price-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Price Type *</label>
            <select
              value={priceType}
              onChange={e => setPriceType(e.target.value as PriceType)}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-price-type-select"
            >
              <option value="Fixed">Fixed Price</option>
              <option value="Negotiable">Negotiable</option>
              <option value="ContactForPrice">Contact for Price</option>
            </select>
            <p className="text-[11px] text-neutral-500 mt-1">
              {priceType === 'Fixed' && 'Customers see the exact price above.'}
              {priceType === 'Negotiable' && 'Price shows with a "Negotiable" badge.'}
              {priceType === 'ContactForPrice' && 'The numeric price is hidden — customers see "Contact for Price".'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Vehicle Condition</label>
            <select
              value={condition}
              onChange={e => setCondition(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-condition-select"
            >
              <option value="Brand New">Brand New</option>
              <option value="Slightly Used">Slightly Used</option>
              <option value="Ethiopian Used">Ethiopian Used</option>
              <option value="Imported / Unregistered">Imported / Unregistered</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Availability Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-status-select"
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: SPECIFICATIONS */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 font-sans border-b border-neutral-800 pb-2">
          2. SPECIFICATIONS & MECHANICALS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Mileage (KM)</label>
            <input
              type="number"
              value={mileage}
              onChange={e => setMileage(Number(e.target.value))}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-mileage-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Fuel Type</label>
            <select
              value={fuelType}
              onChange={e => setFuelType(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-fuel-select"
            >
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Plug-in Hybrid">Plug-in Hybrid</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Transmission</label>
            <select
              value={transmission}
              onChange={e => setTransmission(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-transmission-select"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Tiptronic">Tiptronic</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Body Style</label>
            <select
              value={bodyType}
              onChange={e => setBodyType(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-bodytype-select"
            >
              <option value="SUV">SUV</option>
              <option value="Crossover">Crossover</option>
              <option value="Sedan">Sedan</option>
              <option value="Pickup">Pickup</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="Van">Van</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Engine / Battery</label>
            <input
              type="text"
              value={engine}
              onChange={e => setEngine(e.target.value)}
              placeholder="e.g. 3.5L V6 Twin-Turbo or 60.4kWh Electric"
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-engine-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Drive Train</label>
            <select
              value={driveType}
              onChange={e => setDriveType(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-drivetype-select"
            >
              <option value="4WD">4WD</option>
              <option value="AWD">AWD</option>
              <option value="FWD">FWD</option>
              <option value="RWD">RWD</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Exterior Color</label>
            <input
              type="text"
              value={exteriorColor}
              onChange={e => setExteriorColor(e.target.value)}
              placeholder="e.g. Super White, Obsidian Black"
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-exteriorcolor-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Interior Color</label>
            <input
              type="text"
              value={interiorColor}
              onChange={e => setInteriorColor(e.target.value)}
              placeholder="e.g. Beige Leather, Ebony Black"
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-interiorcolor-input"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: IMPORT & REGISTRATION */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 font-sans border-b border-neutral-800 pb-2">
          3. IMPORTATION & REGISTRATION
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Imported From</label>
            <input
              type="text"
              value={importedFrom}
              onChange={e => setImportedFrom(e.target.value)}
              placeholder="e.g. Dubai UAE, Germany, China, Japan"
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-importedfrom-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Plate Number / Status</label>
            <input
              type="text"
              value={plateNumber}
              onChange={e => setPlateNumber(e.target.value)}
              placeholder="e.g. Unregistered Code 3 or AA 3-C99882"
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="form-platenumber-input"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: DESCRIPTION & FEATURES */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 font-sans border-b border-neutral-800 pb-2">
          4. DESCRIPTION & FEATURES
        </h3>
        
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Detailed Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Write full vehicle overview, trim details, condition notes..."
            className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-red-600 resize-none"
            id="form-description-textarea"
          />
        </div>

        {/* Feature Tags List */}
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-400 mb-1.5">
            Key Vehicle Features ({features.length})
          </label>
          
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="text"
              value={newFeatureInput}
              onChange={e => setNewFeatureInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
              placeholder="Add feature e.g. Sunroof, 360 Camera..."
              className="flex-1 bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-600"
              id="form-new-feature-input"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase px-3.5 py-2 rounded-lg border border-neutral-700 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {features.map((feat, idx) => (
              <span
                key={idx}
                className="bg-neutral-950 text-neutral-200 border border-neutral-800 text-xs px-2.5 py-1 rounded-md flex items-center space-x-1.5"
              >
                <span>{feat}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(feat)}
                  className="text-neutral-500 hover:text-red-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: IMAGE UPLOADER */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 font-sans border-b border-neutral-800 pb-2">
          5. GALLERY & PHOTOS
        </h3>
        <ImageUploader
          images={images}
          primaryImage={primaryImage}
          onChangeImages={setImages}
          onChangePrimary={setPrimaryImage}
        />
      </div>

      {/* SECTION 6: VISIBILITY */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 font-sans border-b border-neutral-800 pb-2">
          6. VISIBILITY
        </h3>
        <label className="flex items-start space-x-3 cursor-pointer bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <input
            type="checkbox"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
            className="mt-0.5 rounded bg-neutral-950 border-neutral-700 text-red-600 focus:ring-red-600"
            id="form-published-checkbox"
          />
          <span>
            <span className="font-bold text-white text-sm block">Published (visible on the public website)</span>
            <span className="text-xs text-neutral-400">
              Leave unchecked to save as a Draft — customers will never see this vehicle until you publish it.
            </span>
          </span>
        </label>
      </div>

      {/* SECTION 7: MARKETING FLAGS */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 font-sans border-b border-neutral-800 pb-2">
          7. MARKETING FLAGS
        </h3>
        <div className="flex flex-wrap gap-6 text-xs font-medium text-neutral-300">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={e => setFeatured(e.target.checked)}
              className="rounded bg-neutral-950 border-neutral-700 text-red-600 focus:ring-red-600"
              id="form-featured-checkbox"
            />
            <span className="font-bold text-white">Featured Listing</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newArrival}
              onChange={e => setNewArrival(e.target.checked)}
              className="rounded bg-neutral-950 border-neutral-700 text-red-600 focus:ring-red-600"
              id="form-newarrival-checkbox"
            />
            <span className="font-bold text-white">New Arrival Badge</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hotDeal}
              onChange={e => setHotDeal(e.target.checked)}
              className="rounded bg-neutral-950 border-neutral-700 text-red-600 focus:ring-red-600"
              id="form-hotdeal-checkbox"
            />
            <span className="font-bold text-white">Hot Deal Highlight</span>
          </label>
        </div>
      </div>

      {/* SECTION 8: FINANCING */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 font-sans border-b border-neutral-800 pb-2">
          8. FINANCING
        </h3>

        <label className="flex items-start space-x-3 cursor-pointer bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <input
            type="checkbox"
            checked={financingAvailable}
            onChange={e => setFinancingAvailable(e.target.checked)}
            className="mt-0.5 rounded bg-neutral-950 border-neutral-700 text-red-600 focus:ring-red-600"
            id="form-financing-available-checkbox"
          />
          <span>
            <span className="font-bold text-white text-sm block">Financing Available for This Vehicle</span>
            <span className="text-xs text-neutral-400">
              Leave unchecked (default) to hide all financing UI, the calculator, and the finance inquiry button on the public site for this vehicle.
            </span>
          </span>
        </label>

        {financingAvailable && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-950/50 border border-neutral-800 rounded-lg p-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Financing Type</label>
              <select
                value={financingType}
                onChange={e => setFinancingType(e.target.value as FinancingType)}
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                id="form-financing-type-select"
              >
                <option value="Bank Loan">Bank Loan</option>
                <option value="Microfinance">Microfinance</option>
                <option value="Interest-Free Financing">Interest-Free Financing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Partner / Lender Name</label>
              <input
                type="text"
                value={lenderName}
                onChange={e => setLenderName(e.target.value)}
                placeholder="e.g. Awash Bank, Wasasa Microfinance"
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                id="form-lender-name-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Minimum Down Payment (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={minDownPaymentPercent}
                onChange={e => setMinDownPaymentPercent(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 30"
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                id="form-min-down-payment-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Maximum Loan Term (months)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={maxLoanTermMonths}
                onChange={e => setMaxLoanTermMonths(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 60"
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                id="form-max-loan-term-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                Estimated Annual Interest / Profit Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={annualInterestRate}
                onChange={e => setAnnualInterestRate(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 15"
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                id="form-annual-interest-rate-input"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Used as the calculator's default rate. Customers can still enter their own quoted rate.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Finance Notes</label>
              <textarea
                value={financeNotes}
                onChange={e => setFinanceNotes(e.target.value)}
                rows={2}
                placeholder="Any conditions customers should know — collateral, insurance requirements, etc."
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600 resize-none"
                id="form-finance-notes-textarea"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Save Action */}
      <div className="pt-6 border-t border-neutral-800 flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase px-5 py-3 rounded-lg border border-neutral-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-lg transition-all shadow-xl shadow-red-600/30 flex items-center space-x-2"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isEditing ? 'SAVE CHANGES' : 'ADD VEHICLE'}</span>
        </button>
      </div>

    </form>
  );
};
