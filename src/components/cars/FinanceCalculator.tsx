import React, { useMemo, useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { Vehicle } from '../../types';

interface FinanceCalculatorProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const TERM_OPTIONS = [12, 24, 36, 48, 60, 72, 84];

function formatETB(val: number): string {
  return `ETB ${Math.round(val).toLocaleString('en-US')}`;
}

export const FinanceCalculator: React.FC<FinanceCalculatorProps> = ({ vehicle, onClose }) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(
    vehicle.minDownPaymentPercent ?? 20
  );
  const [termMonths, setTermMonths] = useState<number>(vehicle.maxLoanTermMonths || 60);
  const [annualRate, setAnnualRate] = useState<number>(vehicle.annualInterestRate ?? 0);

  const price = vehicle.price;
  const downPaymentETB = Math.round((price * downPaymentPercent) / 100);
  const loanAmount = Math.max(price - downPaymentETB, 0);

  const { monthlyPayment, totalRepayment, totalInterest, totalCost } = useMemo(() => {
    const monthlyRate = annualRate / 100 / 12;
    let payment: number;
    if (monthlyRate === 0) {
      payment = termMonths > 0 ? loanAmount / termMonths : 0;
    } else {
      const factor = Math.pow(1 + monthlyRate, termMonths);
      payment = (loanAmount * monthlyRate * factor) / (factor - 1);
    }
    const repayment = payment * termMonths;
    const interest = repayment - loanAmount;
    return {
      monthlyPayment: payment,
      totalRepayment: repayment,
      totalInterest: interest,
      totalCost: repayment + downPaymentETB
    };
  }, [loanAmount, termMonths, annualRate, downPaymentETB]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        id="finance-calculator-modal"
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Finance Calculator</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white" id="finance-calculator-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">Vehicle Price</span>
            <span className="text-lg font-bold text-white">{formatETB(price)}</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase text-neutral-400">Down Payment</label>
              <span className="text-xs text-neutral-300 font-semibold">
                {downPaymentPercent}% • {formatETB(downPaymentETB)}
              </span>
            </div>
            <input
              type="range"
              min={vehicle.minDownPaymentPercent ?? 0}
              max={90}
              step={1}
              value={downPaymentPercent}
              onChange={e => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-red-600"
              id="finance-calc-down-payment-slider"
            />
            {vehicle.minDownPaymentPercent != null && (
              <p className="text-[11px] text-neutral-500 mt-1">
                Minimum down payment for this vehicle: {vehicle.minDownPaymentPercent}%
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-neutral-400 block mb-1">Loan Term</label>
            <select
              value={termMonths}
              onChange={e => setTermMonths(Number(e.target.value))}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600"
              id="finance-calc-term-select"
            >
              {TERM_OPTIONS.map(m => (
                <option key={m} value={m}>
                  {m} months ({(m / 12).toFixed(m % 12 === 0 ? 0 : 1)} years)
                </option>
              ))}
            </select>
            {vehicle.maxLoanTermMonths != null && (
              <p className="text-[11px] text-neutral-500 mt-1">
                Maximum term offered for this vehicle: {vehicle.maxLoanTermMonths} months
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-neutral-400 block mb-1">
              Annual Interest / Profit Rate (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={annualRate}
              onChange={e => setAnnualRate(Number(e.target.value) || 0)}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-red-600 font-bold"
              id="finance-calc-rate-input"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              {vehicle.annualInterestRate != null
                ? `Pre-filled with the rate Kandela Cars has on file for this vehicle — adjust if your lender quotes something different.`
                : `No rate is on file for this vehicle yet — enter your lender's quoted rate to estimate payments.`}
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-2.5">
            <Row label="Down Payment" value={formatETB(downPaymentETB)} />
            <Row label="Estimated Loan Amount" value={formatETB(loanAmount)} />
            <Row label="Loan Term" value={`${termMonths} months`} />
            <Row label="Estimated Monthly Payment" value={formatETB(monthlyPayment)} highlight />
            <Row label="Total Estimated Loan Repayment" value={formatETB(totalRepayment)} />
            <Row label="Estimated Interest / Profit Cost" value={formatETB(totalInterest)} />
            <div className="border-t border-neutral-800 pt-2.5">
              <Row label="Total Estimated Vehicle Cost (incl. down payment)" value={formatETB(totalCost)} highlight />
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-800 pt-4">
            This is an estimate only, not a loan offer or approval. Rates, fees, collateral requirements,
            insurance, taxes, and final repayment terms are determined by the financing institution.
          </p>
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-neutral-400">{label}</span>
    <span className={`text-sm font-bold ${highlight ? 'text-red-600' : 'text-white'}`}>{value}</span>
  </div>
);
