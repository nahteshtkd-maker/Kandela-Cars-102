import React, { useState } from 'react';
import { X, Send, CheckCircle2, Loader2, Phone, Mail, User } from 'lucide-react';
import { api } from '../../services/api';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleTitle?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  vehicleId,
  vehicleTitle
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    vehicleTitle
      ? `Hello Kandela Cars, I am interested in inquiring about ${vehicleTitle}. Please send me vehicle availability and pricing options.`
      : 'Hello Kandela Cars, I would like to request more information about your available vehicles.'
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setError('Please provide at least a Phone number or Email address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.submitInquiry({
        name,
        phone,
        email,
        message,
        vehicleId,
        vehicleTitle
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4" id="inquiry-modal-container">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-fadeIn">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          id="close-inquiry-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-600/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
              INQUIRY SUBMITTED!
            </h3>
            <p className="text-neutral-300 text-sm max-w-sm mx-auto">
              Thank you, <span className="text-white font-bold">{name}</span>. A Kandela Cars representative will contact you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-neutral-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                KANDELA CARS ETHIOPIA
              </span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight font-sans">
                {vehicleTitle ? 'REQUEST VEHICLE INFO' : 'CONTACT US'}
              </h3>
              {vehicleTitle && (
                <p className="text-xs text-neutral-400 mt-1">
                  Inquiring about: <span className="text-white font-semibold">{vehicleTitle}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Abebe Bikila"
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-md pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  id="inquiry-name-input"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+251 94 151 5665"
                    className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-md pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-red-600"
                    id="inquiry-phone-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-md pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-red-600"
                    id="inquiry-email-input"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                Message / Custom Request
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-md p-3 text-sm focus:outline-none focus:border-red-600 resize-none"
                id="inquiry-message-textarea"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="submit-inquiry-btn"
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-md transition-all duration-200 shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SENDING...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>SUBMIT INQUIRY</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
