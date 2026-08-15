// SMS delivery for phone OTP. Twilio is wired in as the default provider —
// falls back to logging the code to the console if Twilio isn't configured,
// so the auth flow stays fully testable without a paid account.
//
// To swap providers later (e.g. Africa's Talking, which also covers
// Ethiopia), only this file needs to change — server.ts just calls sendOtpSms().

interface SmsResult {
  delivered: boolean;
  provider: 'twilio' | 'console';
  detail?: string;
}

function twilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  );
}

export async function sendOtpSms(phone: string, code: string): Promise<SmsResult> {
  if (!twilioConfigured()) {
    console.log(`[dev] OTP for ${phone}: ${code} (expires in 5 min) — Twilio not configured, logging instead of sending`);
    return { delivered: false, provider: 'console' };
  }

  try {
    // Lazy import so the twilio package is only touched when actually configured.
    const twilio = (await import('twilio')).default;
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
      to: phone,
      from: process.env.TWILIO_FROM_NUMBER,
      body: `Your Kandela Cars verification code is ${code}. It expires in 5 minutes.`
    });

    return { delivered: true, provider: 'twilio' };
  } catch (err: any) {
    // Never throw from here — a failed SMS shouldn't crash the request or leak
    // Twilio's internal error details to the client. Log safely and let the
    // caller decide how to respond (the OTP is still valid even if delivery
    // failed to report success — the record already exists in the DB).
    console.error('[sms] Twilio send failed:', { message: err?.message, code: err?.code });
    return { delivered: false, provider: 'twilio', detail: 'send_failed' };
  }
}
