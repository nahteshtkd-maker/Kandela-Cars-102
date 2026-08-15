import React, { useState } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { Vehicle } from '../../types';
import { api } from '../../services/api';

interface FinanceInquiryModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const TERM_OPTIONS = [12, 24, 36, 48, 60, 72, 84];

export const FinanceInquiryModal: React.FC<FinanceInquiryModalProps> = ({ vehicle, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [downPayment, setDownPayment] = useState<number | ''>('');
  const [loanTermMonths, setLoanTermMonths] = useState<number>(vehicle.maxLoanTermMonths || 60);
  const [financingType, setFinancingType] = useState(vehicle.financingType || 'Bank Loan');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.submitFinanceInquiry({
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        vehiclePrice: vehicle.price,
        name,
        phone,
        email: email || undefined,
        downPayment: downPayment === '' ? undefined : Number(downPayment),
        loanTermMonths,
        financingType,
        message: message || undefined
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        id="finance-inquiry-modal"
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <h2 className="text-base font-bold text-white uppercase tracking-wide">Request Financing Help</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white" id="finance-inquiry-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-white font-bold">Request received</p>
            <p className="text-sm text-neutral-400">
              A Kandela Cars representative will review your request and contact you shortly. This is not an
              approval or a submitted loan application.
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase px-5 py-2.5 rounded-lg"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm">
              <span className="text-neutral-400">{vehicle.year} {vehicle.make} {vehicle.model}</span>
              <span className="block text-white font-bold">ETB {vehicle.price.toLocaleString('en-US')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Your Name *</label>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                  id="finance-inquiry-name-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Phone Number *</label>
                <input
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+251..."
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                  id="finance-inquiry-phone-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                id="finance-inquiry-email-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Preferred Down Payment (ETB)</label>
                <input
                  type="number"
                  min={0}
                  value={downPayment}
                  onChange={e => setDownPayment(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                  id="finance-inquiry-down-payment-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Preferred Loan Term</label>
                <select
                  value={loanTermMonths}
                  onChange={e => setLoanTermMonths(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                  id="finance-inquiry-term-select"
                >
                  {TERM_OPTIONS.map(m => (
                    <option key={m} value={m}>{m} months</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Preferred Financing Type</label>
              <select
                value={financingType}
                onChange={e => setFinancingType(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
                id="finance-inquiry-type-select"
              >
                <option value="Bank Loan">Bank Loan</option>
                <option value="Microfinance">Microfinance</option>
                <option value="Interest-Free Financing">Interest-Free Financing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                placeholder="Anything else Kandela Cars should know about your financing needs"
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600 resize-none"
                id="finance-inquiry-message-textarea"
              />
            </div>

            <p className="text-[11px] text-neutral-500">
              Kandela Cars staff will review this request before it goes to any bank or microfinance partner.
              Submitting this form is not a loan application.
            </p>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-2"
              id="finance-inquiry-submit-btn"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
