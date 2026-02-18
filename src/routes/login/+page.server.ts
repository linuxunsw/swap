import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	sendOTP: async (event) => {
		const formData = await event.request.formData();
		const zid = formData.get('zid')?.toString() ?? '';

		try {
			await auth.api.sendVerificationOTP({
				body: {
					email: `${zid}@unsw.edu.au`,
					type: 'sign-in'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'sendOTP failed' });
			}
			return fail(500, { message: 'Unexpected error' });
		}
	},
	signInOTP: async (event) => {
		const formData = await event.request.formData();
		const zid = formData.get('zid')?.toString() ?? '';
		const otp = formData.get('otp')?.toString() ?? '';

		try {
			await auth.api.signInEmailOTP({
				body: {
					email: `${zid}@unsw.edu.au`,
					otp: otp
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'signInOTP failed' });
			}
			return fail(500, { message: 'Unexpected error' });
		}

		return redirect(302, '/');
	}
};
