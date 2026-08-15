import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Loader2,
  User
} from 'lucide-react';
import { api } from '../services/api';
import {
  PHONE_PRIMARY_DISPLAY,
  PHONE_SECONDARY_DISPLAY,
  PHONE_PRIMARY_TEL,
  buildWhatsAppLink
} from '../constants/contact';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!phone.trim() && !email.trim()) {
      setError('Please provide at least a Phone number or Email');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.submitInquiry({
        name,
        phone,
        email,
        message
      });

      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white text-neutral-900 py-10 sm:py-14"
      id="contact-page"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* =========================================================
            HERO / HEADER
        ========================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-5">

          <span className="inline-flex items-center bg-red-50 border border-red-100 text-red-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
            CONNECT WITH KANDELA CARS
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-sans text-neutral-950">
            VISIT OR GET IN TOUCH
          </h1>

          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Our Bole Medhanialem, Addis Ababa office is conveniently located.
            Stop by or reach out via phone, email, or WhatsApp.
          </p>

        </div>

        {/* =========================================================
            MAIN CONTENT
        ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

          {/* =======================================================
              CONTACT DETAILS
          ======================================================= */}
          <div className="space-y-5">

            {/* Office Address */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300">

              <div className="flex items-center space-x-3">

                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>

                <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-neutral-950 font-sans">
                  OFFICE LOCATION
                </h3>

              </div>

              <p className="text-neutral-600 text-sm leading-relaxed mt-4 pl-14">
                Bole, Addis Ababa, Ethiopia
              </p>

            </div>

            {/* Phone & WhatsApp */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300">

              <div className="flex items-center space-x-3">

                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-red-600" />
                </div>

                <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-neutral-950 font-sans">
                  PHONE & WHATSAPP
                </h3>

              </div>

              <div className="space-y-4 mt-5 pl-14 text-sm">

                <div>
                  <span className="text-neutral-500 text-[11px] font-bold uppercase tracking-wider block mb-1">
                    Phone Hotline
                  </span>

                  <a
                    href={`tel:${PHONE_PRIMARY_TEL}`}
                    className="text-neutral-900 font-bold hover:text-red-600 transition-colors"
                  >
                    {PHONE_PRIMARY_DISPLAY} / {PHONE_SECONDARY_DISPLAY}
                  </a>
                </div>

                <div>
                  <span className="text-neutral-500 text-[11px] font-bold uppercase tracking-wider block mb-1">
                    WhatsApp Direct
                  </span>

                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors inline-flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

              </div>

            </div>

            {/* Email & Business Hours */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300">

              <div className="flex items-center space-x-3">

                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-red-600" />
                </div>

                <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-neutral-950 font-sans">
                  EMAIL & HOURS
                </h3>

              </div>

              <div className="space-y-4 mt-5 pl-14 text-sm">

                <div>
                  <span className="text-neutral-500 text-[11px] font-bold uppercase tracking-wider block mb-1">
                    Email Address
                  </span>

                  <span className="text-neutral-800 font-semibold">
                    info@kandelacars.et
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 text-[11px] font-bold uppercase tracking-wider block mb-1">
                    Business Hours
                  </span>

                  <div className="flex items-start space-x-2 text-neutral-700">
                    <Clock className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />

                    <span>
                      Monday – Saturday:
                      <br />
                      8:30 AM – 7:00 PM
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Small trust panel */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">

              <div className="flex items-start space-x-3">

                <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-red-600" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                    KANDELA CARS SUPPORT
                  </h4>

                  <p className="text-xs text-neutral-500 leading-relaxed mt-1">
                    Our team is available to help with vehicle sourcing,
                    inquiries, financing questions, and import assistance.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* =======================================================
              CONTACT FORM
          ======================================================= */}
          <div className="lg:col-span-2">

            <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 lg:p-9 shadow-lg">

              {/* Form Header */}
              <div className="mb-7">

                <span className="text-red-600 text-xs font-bold uppercase tracking-widest block mb-2">
                  SEND A MESSAGE
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight font-sans">
                  CONTACT KANDELA CARS
                </h3>

                <p className="text-neutral-500 text-sm sm:text-base mt-2 leading-relaxed">
                  Fill out the form below and our vehicle specialists will
                  reach out promptly.
                </p>

              </div>

              {/* ===================================================
                  SUCCESS STATE
              =================================================== */}
              {success ? (

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 sm:p-10 text-center">

                  <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-neutral-950 uppercase">
                    MESSAGE SENT SUCCESSFULLY!
                  </h4>

                  <p className="text-neutral-600 text-sm leading-relaxed max-w-md mx-auto mt-3">
                    Thank you for reaching out to Kandela Cars. A Kandela Cars
                    representative will contact you shortly.
                  </p>

                  <button
                    onClick={() => setSuccess(false)}
                    className="text-xs text-red-600 font-bold uppercase tracking-wider hover:text-red-700 hover:underline pt-5 transition-colors"
                  >
                    Send Another Message
                  </button>

                </div>

              ) : (

                /* =================================================
                   FORM
                ================================================= */
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Error */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                      {error}
                    </div>
                  )}

                  {/* Name */}
                  <div>

                    <label
                      htmlFor="contact-form-name"
                      className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2"
                    >
                      Your Name *
                    </label>

                    <div className="relative">

                      <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Abebe Bikila"
                        className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                        id="contact-form-name"
                      />

                    </div>

                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Phone */}
                    <div>

                      <label
                        htmlFor="contact-form-phone"
                        className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2"
                      >
                        Phone Number
                      </label>

                      <div className="relative">

                        <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="+251 94 151 5665"
                          className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                          id="contact-form-phone"
                        />

                      </div>

                    </div>

                    {/* Email */}
                    <div>

                      <label
                        htmlFor="contact-form-email"
                        className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2"
                      >
                        Email Address
                      </label>

                      <div className="relative">

                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                          id="contact-form-email"
                        />

                      </div>

                    </div>

                  </div>

                  {/* Message */}
                  <div>

                    <label
                      htmlFor="contact-form-message"
                      className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2"
                    >
                      Your Message or Vehicle Query
                    </label>

                    <textarea
                      rows={6}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Specify vehicle models, custom import questions, or office visit appointment requests..."
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 rounded-xl p-4 text-sm focus:outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all resize-none"
                      id="contact-form-message"
                    />

                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-4 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/30 flex items-center justify-center space-x-2"
                    id="contact-form-submit-btn"
                  >

                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>CONTACT KANDELA CARS</span>
                      </>
                    )}

                  </button>

                  {/* Form note */}
                  <p className="text-center text-[11px] text-neutral-400 leading-relaxed">
                    By submitting this form, you are requesting contact from
                    Kandela Cars regarding your inquiry.
                  </p>

                </form>

              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};