import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import type { RequestEvent } from '@sveltejs/kit';

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
	| { allowed: false; status: 429; message: string };

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
 *                  Must be a **trusted** value (e.g. authenticated user ID)..
 *
 * Environment behaviour:
 *   production - binding unavailable -> fail **closed** (deny).
 *   dev - binding unavailable -> fail **open** (allow) + console warning.
 */
export async function enforceRateLimit(
	event: RequestEvent,
	binding: RateLimitBinding,
	key?: string,
): Promise<RateLimitResult> {
	const limiter = getBinding(binding);

	if (!limiter) {
		if (dev) {
			console.warn(`[rate-limit] Binding "${binding}" unavailable - skipping in dev`);
			return { allowed: true };
		}
		console.error(`[rate-limit] Binding "${binding}" unavailable in production`);
		return { allowed: false, status: 429, message: 'Service temporarily unavailable' };
	}

	const ip = getClientIp(event);
	const limitKey = key ? `${binding}:${ip}:${key}` : `${binding}:${ip}`;

	const { success } = await limiter.limit({ key: limitKey });
	if (!success) {
		console.warn(`[rate-limit] Denied (binding: ${binding}, ip: ${ip})`);
		return { allowed: false, status: 429, message: 'Too many requests. Please try again later.' };
	}

	return { allowed: true };
}
