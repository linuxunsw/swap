<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Turnstile from '$lib/components/turnstile.svelte';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import { signInSchema, type SignInSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { Spinner } from '$lib/components/ui/spinner';

	let { data }: { data: SuperValidated<Infer<SignInSchema>> } = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(data, {
		validators: valibotClient(signInSchema),
		onError: ({ result }) => {
			if (result.error) {
				$message = result.error.message || 'Unknown error';
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;
</script>

<form action="?/signInOTP" method="POST" use:enhance>
	<!-- Hidden input so zid is submitted even though the visible input is disabled -->
	<input type="hidden" name="zid" bind:value={$formData.zid} />

	{#if $message}
		<p class="mt-0 mb-4 text-sm text-destructive">{$message}</p>
	{/if}

	<Form.Field {form} name="zid">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>zID</Form.Label>
				<Input {...props} disabled value={$formData.zid} />
			{/snippet}
		</Form.Control>
		<Form.Description></Form.Description>
	</Form.Field>
	<Form.Field {form} name="otp">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>One-Time Password</Form.Label>
				<InputOTP.Root
					{...props}
					pattern={REGEXP_ONLY_DIGITS}
					maxlength={6}
					bind:value={$formData.otp}
				>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells as cell}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
			{/snippet}
		</Form.Control>
		<Form.Description></Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="mt-4 w-full" disabled={$delayed}>
		{#if $delayed}
			<Spinner />
		{/if}
		{$delayed ? 'Signing in...' : 'Sign In'}
	</Form.Button>
</form>

<div class="mt-4 text-center text-sm text-muted-foreground">
	<a href="/login" class="underline underline-offset-4 hover:text-primary">Start over</a>
</div>
