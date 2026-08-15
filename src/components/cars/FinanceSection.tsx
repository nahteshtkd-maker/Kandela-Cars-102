import React, { useState } from 'react';
import { Calculator, HandCoins } from 'lucide-react';
import { Vehicle } from '../../types';
import { FinanceCalculator } from './FinanceCalculator';
import { FinanceInquiryModal } from './FinanceInquiryModal';

interface FinanceSectionProps {
  vehicle: Vehicle;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({ vehicle }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);

  const details: Array<{ label: string; value: string }> = [];
  if (vehicle.financingType) details.push({ label: 'Financing Type', value: vehicle.financingType });
  if (vehicle.lenderName) details.push({ label: 'Partner / Lender', value: vehicle.lenderName });
  if (vehicle.minDownPaymentPercent != null) details.push({ label: 'Minimum Down Payment', value: `${vehicle.minDownPaymentPercent}%` });
  if (vehicle.maxLoanTermMonths != null) details.push({ label: 'Maximum Loan Term', value: `${vehicle.maxLoanTermMonths} months` });

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4" id="finance-section">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-[9px] font-black tracking-wider px-2 py-0.5 uppercase">
            Financing Available
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCalculator(true)}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors"
            id="calculate-finance-btn"
          >
            <Calculator className="w-4 h-4 text-red-500" />
            Calculate Finance
          </button>
          <button
            onClick={() => setShowInquiry(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors"
            id="request-financing-help-btn"
          >
            <HandCoins className="w-4 h-4" />
            Request Financing Help
          </button>
        </div>
      </div>

      {details.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-neutral-800">
          {details.map(d => (
            <div key={d.label}>
              <span className="text-[9px] text-neutral-500 uppercase tracking-wider block font-medium">{d.label}</span>
              <span className="text-sm text-white font-semibold">{d.value}</span>
            </div>
          ))}
        </div>
      )}

      {vehicle.financeNotes && (
        <p className="text-xs text-neutral-400 border-t border-neutral-800 pt-3">{vehicle.financeNotes}</p>
      )}

      {showCalculator && <FinanceCalculator vehicle={vehicle} onClose={() => setShowCalculator(false)} />}
      {showInquiry && <FinanceInquiryModal vehicle={vehicle} onClose={() => setShowInquiry(false)} />}
    </div>
  );
};
