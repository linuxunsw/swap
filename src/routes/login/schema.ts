import * as v from "valibot";

export const sendOTPSchema = v.object({
	zid: v.pipe(v.string(), v.regex(/^z\d{7}$/, 'Please enter a valid zID'))
});

export type SendOTPSchema = typeof sendOTPSchema;

export const signInSchema = v.object({
	zid: v.pipe(v.string(), v.regex(/^z\d{7}$/, 'Please enter a valid zID')),
	otp: v.pipe(v.string(), v.regex(/^\d{6}$/, 'Please enter a valid 6-digit OTP'))
});

export type SignInSchema = typeof signInSchema;