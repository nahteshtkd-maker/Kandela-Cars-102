// Central contact/social constants. Update here — every component imports from
// this file rather than hardcoding numbers/links.

export const PHONE_NUMBERS_DISPLAY = '+251 94 151 5665 / +251 99 122 2525';

export const PHONE_PRIMARY_DISPLAY = '+251 94 151 5665';
export const PHONE_PRIMARY_TEL = '+251941515665';

export const PHONE_SECONDARY_DISPLAY = '+251 99 122 2525';
export const PHONE_SECONDARY_TEL = '+251991222525';

// WhatsApp uses the primary number, digits only (no leading +).
export const WHATSAPP_NUMBER = '251941515665';

export function buildWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const SOCIAL_LINKS = {
  tiktok: 'https://tiktok.com/@kandelacars',
  telegram: 'https://t.me/kandelacars',
  instagram: 'https://instagram.com/kandela.cars',
  facebook: 'https://facebook.com/kandelacars'
};
