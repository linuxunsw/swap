import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { emailOTP } from 'better-auth/plugins';
import { getDb } from '$lib/server/db';
import { APIError, type User } from 'better-auth';
import { ZID_REGEX, zidIsAdmin } from './utils';

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
					console.log(`sending otp to ${email}: ${otp}`);
				}
			},
			storeOTP: 'hashed'
		}),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	],
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
						throw new APIError('BAD_REQUEST', { message: 'invalid zid' });
					}
					const role: Role = zidIsAdmin(zid) ? 'admin' : 'user';
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
