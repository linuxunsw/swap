<script lang="ts">
	import { page } from '$app/state';
	import { CycleSubcommitteeCombobox } from '$lib/components/cycle-subcommittee-combobox';
	import { ResponsiveAlertDialog } from '$lib/components/responsive-alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Spinner } from '$lib/components/ui/spinner';
	import type { SubcommitteeOption } from '$lib/server/controllers/subcommittee';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import ResponsiveDateInput from './responsive-date-input.svelte';
	import { createCycleSchema, type CycleSchema } from './schema';

	let {
		data,
		subcommitteeOptions,
		action
	}: {
		data: SuperValidated<Infer<CycleSchema>>;
		subcommitteeOptions: SubcommitteeOption[];
		action?: string;
	} = $props();

	let createdSubcommitteeOptions = $state<SubcommitteeOption[]>([]);
	const availableSubcommitteeOptions = $derived([
		...subcommitteeOptions,
		...createdSubcommitteeOptions
	]);
	const subcommitteeIds = $derived(availableSubcommitteeOptions.map((option) => option.id));
	const validationAdapter = $derived(valibot(createCycleSchema(subcommitteeIds)));

	function handleSubcommitteeCreate(newSubcommittee: SubcommitteeOption) {
		if (availableSubcommitteeOptions.some((option) => option.id === newSubcommittee.id)) {
			return;
		}

		createdSubcommitteeOptions = [...createdSubcommitteeOptions, newSubcommittee];
	}

	let alertOpen = $state(false);
	let pendingResolve: ((shouldLeave: boolean) => void) | null = null;

	// When dialog closes without explicit action, resolve as cancel
	$effect(() => {
		if (!alertOpen && pendingResolve) {
			pendingResolve(false);
			pendingResolve = null;
		}
	});

	// svelte-ignore state_referenced_locally
	const form = superForm(data, {
		validators: validationAdapter,
		resetForm: false,
		onError: ({ result }) => {
			if (result.error) {
				$message = result.error.message || 'Unknown error';
				toast.error($message);
			}
		},
		onUpdated: ({ form }) => {
			if (form.message) {
				if (page.status >= 400) {
					toast.error(form.message);
				} else {
					toast.success(form.message);
				}
			}
		},
		taintedMessage: () => {
			return new Promise((resolve) => {
				pendingResolve?.(false);
				pendingResolve = resolve;
				alertOpen = true;
			});
		}
	});

	const { form: formData, enhance, message, delayed, options } = form;

	$effect(() => {
		options.validators = validationAdapter;
	});
</script>

<ResponsiveAlertDialog
	bind:open={alertOpen}
	title="You have unsaved changes"
	description="Leaving now will discard all unsaved changes. Are you sure you want to exit?"
	onAction={() => {
		const resolve = pendingResolve;
		pendingResolve = null;
		alertOpen = false;
		resolve?.(true);
	}}
/>

<form method="POST" {action} class="mx-auto w-full max-w-xl space-y-6" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Cycle Name</Form.Label>
				<Input {...props} placeholder="202X T1" bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="opensAt">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Opens At</Form.Label>
				<ResponsiveDateInput
					{...props}
					bind:value={$formData.opensAt}
					description="Select an opening date"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="closesAt">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Closes At</Form.Label>

				<ResponsiveDateInput
					{...props}
					bind:value={$formData.closesAt}
					description="Select a closing date"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Fieldset class="flex flex-col gap-3" {form} name="subcommitteeIds">
		<Form.Legend class="text-base font-medium">Subcommittees</Form.Legend>
		<Form.Description>Select the subcommittees this cycle is going to offer.</Form.Description>
		<Form.Control>
			{#snippet children({ props })}
				<CycleSubcommitteeCombobox
					{...props}
					subcommittees={availableSubcommitteeOptions}
					onCreate={handleSubcommitteeCreate}
					bind:selectedIds={$formData.subcommitteeIds}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Fieldset>

	<div class="flex">
		<Form.Button class="flex-1" disabled={$delayed}>
			{#if $delayed}
				<Spinner />
			{/if}
			Submit
		</Form.Button>
	</div>
</form>
