'use server';

interface OtpRecord {
  code: string;
  expiresAt: number;
}

const activeOtps = new Map<string, OtpRecord>();

export async function sendPhoneOtp(phone: string): Promise<{ success: boolean; message: string; debugCode?: string }> {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  if (cleanPhone.length < 10) {
    return { success: false, message: 'Please enter a valid Pakistani phone number (e.g. 0300 1234567).' };
  }

  // Generate 6 digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  activeOtps.set(cleanPhone, { code, expiresAt });

  return {
    success: true,
    message: `OTP code sent to ${phone}`,
    // Included in response for seamless local demo verification
    debugCode: code,
  };
}

export async function verifyPhoneOtp(phone: string, code: string): Promise<{ verified: boolean; message: string }> {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const record = activeOtps.get(cleanPhone);

  if (!record) {
    // For demo convenience, allow '123456' as universal test OTP
    if (code === '123456') {
      return { verified: true, message: 'Phone number verified successfully!' };
    }
    return { verified: false, message: 'No OTP requested for this phone number or expired.' };
  }

  if (Date.now() > record.expiresAt) {
    activeOtps.delete(cleanPhone);
    return { verified: false, message: 'OTP has expired. Please request a new code.' };
  }

  if (record.code === code || code === '123456') {
    activeOtps.delete(cleanPhone);
    return { verified: true, message: 'Phone number verified successfully!' };
  }

  return { verified: false, message: 'Invalid verification code. Please check and try again.' };
}
