import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_SOCIETY_WEBSITE: { public: true, static: true },
	PUBLIC_SOCIETY_EMAIL: { public: true, static: true },
	LOG_DEBUG: { static: true },
	LOG_DEV_ONLY: { static: true },
	ORIGIN: { schema: (input) => input ?? '' },
	BETTER_AUTH_SECRET: { schema: (input) => input ?? '' },
	BETTER_AUTH_SESSION_EXPIRES_IN: { static: true },
	BETTER_AUTH_SESSION_UPDATE_AGE: { static: true },
	RESEND_API_KEY: { schema: (input) => input ?? '' },
	CONSOLE_MAILER: { static: true },
	MAILER_FROM_EMAIL: { static: true },
	OTP_EXPIRY_MINS: { static: true },
	RATE_LIMIT_BYPASS: { static: true },
	TURNSTILE_SECRET_KEY: { schema: (input) => input ?? '' },
	ADMIN_ZIDS: { static: true },
	HYPERDRIVE: { schema: (input) => input ?? '' },
	CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE: { schema: (input) => input ?? '' },
	DATABASE_URL: { schema: (input) => input ?? '' },
	PUBLIC_SWAP_GITHUB: { public: true, static: true },
	PUBLIC_TURNSTILE_SITE_KEY: { public: true, static: true }
});
