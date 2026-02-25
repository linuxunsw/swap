import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth';
import { superValidate, message } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { sendOTPSchema, signInSchema } from './schema';
import { ZID_REGEX } from '$lib/server/utils';
import { enforceRateLimit } from '$lib/server/rate-limit';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}

	const zid = event.url.searchParams.get('zid') ?? '';
	const hasValidZid = ZID_REGEX.test(zid);

	const sendOTPForm = await superValidate(valibot(sendOTPSchema));
	const signInForm = await superValidate(valibot(signInSchema));

	if (hasValidZid) {
		sendOTPForm.data.zid = zid;
		signInForm.data.zid = zid;
	}

	return { sendOTPForm, signInForm, step: hasValidZid ? 2 : 1 };
};

export const actions: Actions = {
	sendOTP: async (event) => {
		const limit = await enforceRateLimit(event, 'MAIL_RATE_LIMIT');
		if (!limit.allowed) {
			error(limit.status, { message: limit.message });
		}

		const form = await superValidate(event, valibot(sendOTPSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const zid = form.data.zid;

		try {
			await auth.api.sendVerificationOTP({
				body: {
					email: `${zid}@unsw.edu.au`,
					type: 'sign-in'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return message(form, error.message || 'Failed to send OTP', { status: 400 });
			}
			return message(form, 'Unexpected error', { status: 500 });
		}

		redirect(303, `/login?zid=${zid}`);
	},
	signInOTP: async (event) => {
		const limit = await enforceRateLimit(event, 'AUTH_RATE_LIMIT');
		if (!limit.allowed) {
			error(limit.status, { message: limit.message });
		}

		const form = await superValidate(event, valibot(signInSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { zid, otp } = form.data;

		try {
			await auth.api.signInEmailOTP({
				body: {
					email: `${zid}@unsw.edu.au`,
					otp
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return message(form, error.message || 'Failed to sign in', { status: 400 });
			}
			return message(form, 'Unexpected error', { status: 500 });
		}

		redirect(302, '/');
	}
};
