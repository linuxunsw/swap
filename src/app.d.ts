import type { Role } from '$lib/constants';
import type { SwapSession, SwapUser } from '$lib/server/auth';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	// for Cloudflare Turnstile
	interface Window {
		turnstile?: {
			render: (
				container: string | HTMLElement,
				options: { sitekey: string; [key: string]: unknown }
			) => string;
			reset: (widgetIdOrContainer?: string | HTMLElement) => void;
			remove: (widgetIdOrContainer: string | HTMLElement) => void;
		};
	}

	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}

		interface Locals {
			user?: SwapUser;
			session?: SwapSession;
		}

		// interface Error {}
		// interface Locals {}
		interface PageData {
			flash?: string;
			role?: Role;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
