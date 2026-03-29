import { env } from '$env/dynamic/private';
import { CONSOLE_MAILER, MAILER_FROM_EMAIL, OTP_EXPIRY_MINS } from '$env/static/private';
import { devOnly, log } from '$lib/log';
import { Resend } from 'resend';

// 5 mins default
export const otpExpiryMins = parseInt(OTP_EXPIRY_MINS) || 5;
export const otpExpirySecs = otpExpiryMins * 60;

export async function sendOTP(toEmail: string, otp: string): Promise<void> {
	const expiryMins = parseInt(OTP_EXPIRY_MINS) || 5;

	const subject = 'Your Linux Society Subcommittee Application OTP';
	const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Linux Society UNSW Subcommittee Application</h2>
            <p>Your OTP code is:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
                <strong>${otp}</strong>
            </div>
            <p>This code will expire in ${expiryMins} minutes and can only be used once.</p>
            <p>If you did not request this code, you can safely ignore this email.</p>
            <p>Regards,<br>Linux Society UNSW</p>
        </div>
    `;
	const text = `Your OTP code is: ${otp}\n\nThis code will expire in ${expiryMins} minutes and can only be used once.\n\nIf you did not request this code, you can safely ignore this email.\n\nRegards,\nLinux Society UNSW`;

	const useConsole = CONSOLE_MAILER === 'true';

	if (useConsole) {
		log('info', 'mailer', 'send_otp', { toEmail, otp: devOnly(otp) });
		return;
	}

	const resend = new Resend(env.RESEND_API_KEY);

	if (!resend) {
		log('error', 'mailer', 'send_otp', {
			toEmail,
			error: 'Mailer is not configured'
		});
		return;
	}

	await resend.emails
		.send({
			from: MAILER_FROM_EMAIL,
			to: toEmail,
			subject,
			text,
			html
		})
		.then(() => {
			log('info', 'mailer', 'send_otp_success', { toEmail, otp: devOnly(otp) });
		})
		.catch((error) => {
			log('error', 'mailer', 'send_otp_error', { toEmail, error });
		});
}
