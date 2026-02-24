<script lang="ts">
	import type { PageProps } from './$types';
	import SendOtpForm from './send-otp-form.svelte';
	import SignInOtpForm from './sign-in-otp-form.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

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
</Card.Root>



