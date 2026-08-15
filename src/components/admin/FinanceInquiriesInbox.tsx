import React, { useState } from 'react';
import { Phone, Mail, Calendar, HandCoins, Car } from 'lucide-react';
import { FinanceInquiry } from '../../types';

interface FinanceInquiriesInboxProps {
  inquiries: FinanceInquiry[];
  onStatusChange: (id: string, status: FinanceInquiry['status']) => void;
}

export const FinanceInquiriesInbox: React.FC<FinanceInquiriesInboxProps> = ({ inquiries, onStatusChange }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filtered = inquiries.filter(f => filterStatus === 'All' || f.status === filterStatus);

  return (
    <div className="space-y-6" id="admin-finance-inquiries-inbox">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-6 gap-4">
        <div>
          <span className="text-red-500 text-xs font-bold uppercase tracking-widest block">
            FINANCING HELP REQUESTS
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight font-sans">
            FINANCE INQUIRIES ({inquiries.length})
          </h1>
        </div>

        <div className="flex items-center space-x-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
          {['All', 'New', 'Contacted', 'Closed'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === st ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-400 space-y-2">
            <HandCoins className="w-8 h-8 mx-auto text-neutral-600" />
            <p className="text-sm font-bold uppercase text-white">NO FINANCING REQUESTS</p>
            <p className="text-xs">Customer requests for financing help will appear here.</p>
          </div>
        ) : (
          filtered.map(f => (
            <div
              key={f.id}
              className={`bg-neutral-900 border rounded-2xl p-6 transition-all space-y-4 ${
                f.status === 'New' ? 'border-red-600/70 shadow-lg shadow-red-950/20' : 'border-neutral-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800/80 pb-3 gap-2">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-bold text-base">{f.name}</span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      f.status === 'New'
                        ? 'bg-red-600 text-white'
                        : f.status === 'Contacted'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {f.status}
                  </span>
                </div>
                <span className="flex items-center space-x-1 text-xs text-neutral-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(f.createdAt).toLocaleString()}</span>
                </span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-red-500" />
                  <span className="text-neutral-400 font-bold uppercase">Vehicle:</span>
                  <span className="text-white font-bold">{f.vehicleName}</span>
                </div>
                <span className="text-red-500 font-bold">ETB {f.vehiclePrice.toLocaleString('en-US')}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {f.downPayment != null && (
                  <div>
                    <span className="text-neutral-500 uppercase font-bold block text-[10px]">Preferred Down Payment</span>
                    <span className="text-white font-semibold">ETB {f.downPayment.toLocaleString('en-US')}</span>
                  </div>
                )}
                {f.loanTermMonths != null && (
                  <div>
                    <span className="text-neutral-500 uppercase font-bold block text-[10px]">Preferred Term</span>
                    <span className="text-white font-semibold">{f.loanTermMonths} months</span>
                  </div>
                )}
                {f.financingType && (
                  <div>
                    <span className="text-neutral-500 uppercase font-bold block text-[10px]">Financing Type</span>
                    <span className="text-white font-semibold">{f.financingType}</span>
                  </div>
                )}
              </div>

              {f.message && (
                <p className="text-neutral-200 text-sm leading-relaxed bg-neutral-950/40 p-4 rounded-xl border border-neutral-800/50">
                  "{f.message}"
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <a
                    href={`tel:${f.phone}`}
                    className="text-neutral-300 font-bold hover:text-white flex items-center space-x-1.5 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-500" />
                    <span>{f.phone}</span>
                  </a>
                  {f.email && (
                    <a
                      href={`mailto:${f.email}`}
                      className="text-neutral-300 font-bold hover:text-white flex items-center space-x-1.5 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-500" />
                      <span>{f.email}</span>
                    </a>
                  )}
                </div>

                <select
                  value={f.status}
                  onChange={e => onStatusChange(f.id, e.target.value as FinanceInquiry['status'])}
                  className="bg-neutral-950 border border-neutral-800 text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-600"
                  id={`finance-inquiry-status-select-${f.id}`}
                >
                  <option value="New">Mark New</option>
                  <option value="Contacted">Mark Contacted</option>
                  <option value="Closed">Mark Closed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
