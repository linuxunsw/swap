import { OTP_REGEX, ZID_REGEX } from '$lib/constants';
import * as v from 'valibot';

export const sendOTPSchema = v.object({
	zid: v.pipe(v.string(), v.regex(ZID_REGEX, 'Please enter a valid zID'))
});

export type SendOTPSchema = typeof sendOTPSchema;

export const signInSchema = v.object({
	zid: v.pipe(v.string(), v.regex(ZID_REGEX, 'Please enter a valid zID')),
	otp: v.pipe(v.string(), v.regex(OTP_REGEX, 'Please enter a valid 6-digit OTP'))
});

export type SignInSchema = typeof signInSchema;
