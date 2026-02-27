import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { emailOTP } from 'better-auth/plugins';
import { getDb } from '$lib/server/db';
import { APIError, type User } from 'better-auth';
import { ZID_REGEX, zidIsAdmin } from './utils';
import { getSecondaryStorage } from './secondary-storage';
import { log, devOnly } from '$lib/log';

export type Role = 'user' | 'admin';

export type SwapUser = User & {
	zid: string;
	role: Role;
};

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(getDb(), { provider: 'sqlite' }),
	emailAndPassword: { enabled: false },
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				if (type === 'sign-in') {
					log('info', 'auth', 'send_otp', { email, otp: devOnly(otp) });
				}
			},
			storeOTP: 'hashed'
		}),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	],
	secondaryStorage: getSecondaryStorage(),
	session: {
		expiresIn: parseInt(env.BETTER_AUTH_SESSION_EXPIRES_IN) || 60 * 60 * 24 * 3, // 3 day default
		updateAge: parseInt(env.BETTER_AUTH_SESSION_UPDATE_AGE) || 60 * 60 * 24, // 1 day default
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60 // 5 mins
		}
	},
	user: {
		additionalFields: {
			role: {
				type: ['user', 'admin'],
				required: true,
				defaultValue: 'user',
				input: false
			},
			zid: {
				type: 'string',
				required: true,
				input: false
			}
		}
	},
	databaseHooks: {
		user: {
			create: {
				before: async (user, _) => {
					const zid = user.email.split('@')[0];
					if (!ZID_REGEX.test(zid)) {
						log('warn', 'auth', 'user_create_rejected', { email: user.email, reason: 'invalid zid' });
						throw new APIError('BAD_REQUEST', { message: 'invalid zid' });
					}
					const role: Role = zidIsAdmin(zid) ? 'admin' : 'user';
					log('info', 'auth', 'user_create', { zid, role });
					return {
						data: {
							...user,
							zid,
							role
						}
					};
				}
			}
		}
	},
	telemetry: {
		enabled: false
	}
});
