import { env } from '$env/dynamic/private';
import { log } from '$lib/log';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileResult {
	success: boolean;
	'error-codes'?: string[];
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
	try {
		const res = await fetch(VERIFY_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				secret: env.TURNSTILE_SECRET_KEY,
				response: token
			})
		});

		const result: TurnstileResult = await res.json();

		if (!result.success) {
			log('warn', 'turnstile', 'verification_failed', {
				errors: result['error-codes']?.join(', ') ?? 'unknown'
			});
		}

		return result.success;
	} catch (err) {
		log('error', 'turnstile', 'verification_error', { error: String(err) });
		return false;
	}
}
