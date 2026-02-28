import { env } from '$env/dynamic/private';
import { RATE_LIMIT_BYPASS } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';
import { devOnly, log } from '$lib/log';

/**
 * Cloudflare rate-limit binding names (declared in wrangler.jsonc)
 */
export type RateLimitBinding =
	| 'MAIL_RATE_LIMIT'
	| 'AUTH_RATE_LIMIT'
	| 'API_RATE_LIMIT'
	| 'ADMIN_RATE_LIMIT';

export type RateLimitResult =
	| { allowed: true }
	| { allowed: false; status: 429 | 503; message: string };

function getClientIp(event: RequestEvent): string {
	return event.request.headers.get('cf-connecting-ip') || event.getClientAddress();
}

function getBinding(name: RateLimitBinding): RateLimit | null {
	const binding = (env as Record<string, unknown>)[name];
	if (!binding || typeof (binding as RateLimit).limit !== 'function') {
		return null;
	}
	return binding as RateLimit;
}

/**
 * Enforce a Cloudflare rate limit.
 *
 * Should be used at the top of every form action / API handler, before any
 * validation or business logic.
 *
 * @param event   - SvelteKit RequestEvent
 * @param binding - Which wrangler rate-limit binding to check
 * @param key     - Optional extra key segment appended after the IP key.
 *                  Must be a **trusted** value (e.g. authenticated user ID).
 */
export async function enforceRateLimit(
	event: RequestEvent,
	binding: RateLimitBinding,
	key?: string,
): Promise<RateLimitResult> {
	const limiter = getBinding(binding);

	if (!limiter) {
		const bypass = RATE_LIMIT_BYPASS === 'true';
		if (bypass) {
			log('warn', 'rate_limit', 'binding_unavailable', { binding, bypass });
			return { allowed: true };
		}
		log('error', 'rate_limit', 'binding_unavailable', { binding, bypass });
		return { allowed: false, status: 503, message: 'Service temporarily unavailable' };
	}

	const ip = getClientIp(event);
	const limitKey = key ? `${binding}:${ip}:${key}` : `${binding}:${ip}`;

	const { success } = await limiter.limit({ key: limitKey });
	if (!success) {
		log('warn', 'rate_limit', 'denied', { binding, ip: devOnly(ip), key: devOnly(key) });
		return { allowed: false, status: 429, message: 'Too many requests. Please try again later.' };
	}

	return { allowed: true };
}
