<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { PageProps } from './$types';
	import SendOtpForm from './send-otp-form.svelte';
	import SignInOtpForm from './sign-in-otp-form.svelte';

	let { data }: PageProps = $props();
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>
			{#if data.step === 1}
				Enter your zID to receive a one-time password.
			{:else}
				Enter the OTP sent to your UNSW email.
			{/if}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if data.step === 1}
			<SendOtpForm data={data.sendOTPForm} />
		{:else}
			<SignInOtpForm data={data.signInForm} />
		{/if}
	</Card.Content>
	{#if data.step === 2}
		<Card.Footer class="flex flex-col items-start gap-1 text-xs text-muted-foreground">
			<span class="font-semibold">Didn't get the OTP email?</span>
			<span>
				Please check your junk or spam folder first. Otherwise,
				<a
					href={resolve('/login')}
					class="font-medium underline underline-offset-2 hover:text-foreground"
				>
					click here
				</a>
				to start over.
			</span>
		</Card.Footer>
	{/if}
</Card.Root>
