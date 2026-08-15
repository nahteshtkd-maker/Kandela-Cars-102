import React, { useState } from 'react';
import { Mail, Phone, Calendar, Trash2, CheckCircle2, MessageSquare, Car, ExternalLink } from 'lucide-react';
import { InquiryMessage } from '../../types';

interface MessagesInboxProps {
  messages: InquiryMessage[];
  onStatusChange: (id: string, status: 'New' | 'Contacted' | 'Closed') => void;
  onDelete: (id: string) => void;
  onViewVehicle?: (vehicleId: string) => void;
}

export const MessagesInbox: React.FC<MessagesInboxProps> = ({
  messages,
  onStatusChange,
  onDelete,
  onViewVehicle
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filtered = messages.filter(m => {
    if (filterStatus === 'All') return true;
    return m.status === filterStatus;
  });

  return (
    <div className="space-y-6" id="admin-messages-inbox">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-6 gap-4">
        <div>
          <span className="text-red-500 text-xs font-bold uppercase tracking-widest block">
            CUSTOMER INQUIRIES & LEADS
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight font-sans">
            MESSAGES INBOX ({messages.length})
          </h1>
        </div>

        {/* Status Filter tabs */}
        <div className="flex items-center space-x-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
          {['All', 'New', 'Contacted', 'Closed'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === st
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-neutral-600" />
            <p className="text-sm font-bold uppercase text-white">NO INQUIRIES FOUND</p>
            <p className="text-xs">Customer messages and vehicle inquiry requests will appear here.</p>
          </div>
        ) : (
          filtered.map(msg => (
            <div
              key={msg.id}
              className={`bg-neutral-900 border rounded-2xl p-6 transition-all space-y-4 ${
                msg.status === 'New' ? 'border-red-600/70 shadow-lg shadow-red-950/20' : 'border-neutral-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800/80 pb-3 gap-2">
                
                <div className="flex items-center space-x-3">
                  <span className="text-white font-bold text-base">{msg.name}</span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      msg.status === 'New'
                        ? 'bg-red-600 text-white'
                        : msg.status === 'Contacted'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-neutral-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </span>
                </div>

              </div>

              {/* Inquired Vehicle Banner */}
              {msg.vehicleTitle && (
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-red-500" />
                    <span className="text-neutral-400 font-bold uppercase">Inquiring About:</span>
                    <span className="text-white font-bold">{msg.vehicleTitle}</span>
                  </div>
                  {msg.vehicleId && onViewVehicle && (
                    <button
                      onClick={() => onViewVehicle(msg.vehicleId!)}
                      className="text-red-500 hover:underline font-bold flex items-center space-x-1"
                    >
                      <span>View Vehicle</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Message Content */}
              <p className="text-neutral-200 text-sm leading-relaxed bg-neutral-950/40 p-4 rounded-xl border border-neutral-800/50">
                "{msg.message}"
              </p>

              {/* Customer Contact Details & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  {msg.phone && (
                    <a
                      href={`tel:${msg.phone}`}
                      className="text-neutral-300 font-bold hover:text-white flex items-center space-x-1.5 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800"
                    >
                      <Phone className="w-3.5 h-3.5 text-red-500" />
                      <span>{msg.phone}</span>
                    </a>
                  )}

                  {msg.email && (
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-neutral-300 font-bold hover:text-white flex items-center space-x-1.5 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-500" />
                      <span>{msg.email}</span>
                    </a>
                  )}
                </div>

                {/* Status Toggle & Delete */}
                <div className="flex items-center space-x-3">
                  <select
                    value={msg.status}
                    onChange={e => onStatusChange(msg.id, e.target.value as any)}
                    className="bg-neutral-950 border border-neutral-800 text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-600"
                    id={`message-status-select-${msg.id}`}
                  >
                    <option value="New">Mark New</option>
                    <option value="Contacted">Mark Contacted</option>
                    <option value="Closed">Mark Closed</option>
                  </select>

                  <button
                    onClick={() => onDelete(msg.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-950 rounded-lg transition-colors"
                    title="Delete Message"
                    id={`delete-message-btn-${msg.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
