<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Turnstile from '$lib/components/turnstile.svelte';
	import { sendOTPSchema, type SendOTPSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { Spinner } from '$lib/components/ui/spinner';

	let { data }: { data: SuperValidated<Infer<SendOTPSchema>> } = $props();

	let turnstile: Turnstile;
	let captchaSolved = $state(false);

	// svelte-ignore state_referenced_locally
	const form = superForm(data, {
		validators: valibotClient(sendOTPSchema),
		onResult: () => turnstile?.reset(),
		onError: ({ result }) => {
			if (result.error) {
				$message = result.error.message || 'Unknown error';
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;
</script>

<form action="?/sendOTP" method="POST" use:enhance>
	{#if $message}
		<p class="mb-4 text-sm text-destructive">{$message}</p>
	{/if}

	<Form.Field {form} name="zid">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>zID</Form.Label>
				<Input {...props} maxlength={8} placeholder="z1234567" bind:value={$formData.zid} />
			{/snippet}
		</Form.Control>
		<Form.Description></Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Turnstile bind:this={turnstile} bind:solved={captchaSolved} />
	<Form.Button class="mt-4 w-full" disabled={!captchaSolved || $delayed}>
		{#if $delayed}
			<Spinner />
		{/if}
		{$delayed ? 'Sending...' : 'Send OTP'}
	</Form.Button>
</form>
