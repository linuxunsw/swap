import { z } from 'zod';

export const sendOTPSchema = z.object({
	zid: z.string().regex(/^z\d{7}$/, 'Please enter a valid zID')
});

export type SendOTPSchema = typeof sendOTPSchema;

export const signInSchema = z.object({
	zid: z.string().regex(/^z\d{7}$/, 'Please enter a valid zID'),
	otp: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit OTP')
});

export type SignInSchema = typeof signInSchema;