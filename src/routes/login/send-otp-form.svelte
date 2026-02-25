<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { sendOTPSchema, type SendOTPSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data }: { data: SuperValidated<Infer<SendOTPSchema>> } = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(data, {
		validators: zod4Client(sendOTPSchema),
		onError: ({ result }) => {
			if (result.error) {
				$message = result.error.message || 'Unknown error';
			}
		}
	});

	const { form: formData, enhance, message } = form;
</script>

<form action="?/sendOTP" method="POST" use:enhance>
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

	{#if $message}
		<p class="mt-2 text-sm text-destructive">{$message}</p>
	{/if}

	<Form.Button class="mt-4 w-full">Send OTP</Form.Button>
</form>
