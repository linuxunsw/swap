<script lang="ts">
	import { page } from '$app/state';
	import { ResponsiveAlertDialog } from '$lib/components/responsive-alert-dialog/index.js';
	import * as Checkbox from '$lib/components/ui/checkbox/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { checkboxVariants, choiceCardVariants } from '$lib/constants';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import { createApplicationSchema, type ApplicationSchema } from './schema';

	let {
		data,
		subcommitteeOptions
	}: {
		data: SuperValidated<Infer<ApplicationSchema>>;
		subcommitteeOptions: PageData['subcommitteeOptions'];
	} = $props();

	const subcommitteeIds = $derived(subcommitteeOptions.map((option) => option.id));
	const validationSchema = (() => createApplicationSchema(subcommitteeIds))();

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
		validators: valibotClient(validationSchema),
		resetForm: false,
		clearOnSubmit: 'none',
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

	const { form: formData, enhance, message, delayed } = form;
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

<form method="POST" class="mx-auto w-full max-w-3xl space-y-6" use:enhance>
	<fieldset class="flex flex-col gap-6">
		<legend class="mb-3 font-medium">Personal Information</legend>
		<Form.Field {form} name="fullName">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Full Name</Form.Label>
					<Input {...props} placeholder="Jane Doe" bind:value={$formData.fullName} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="discord">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Discord Username</Form.Label>
					<Input {...props} placeholder="janedoe" bind:value={$formData.discord} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="preferredEmail">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label
						>Preferred Email <span class="text-muted-foreground">(optional)</span></Form.Label
					>
					<Input
						{...props}
						type="email"
						placeholder="jane@example.com"
						bind:value={$formData.preferredEmail}
					/>
				{/snippet}
			</Form.Control>
			<Form.Description>Leave blank to use your UNSW email.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	</fieldset>

	<Form.Fieldset class="flex flex-col gap-3" {form} name="subcommittees">
		<Form.Legend class="text-base font-medium">Subcommittee Preferences</Form.Legend>
		<Form.Description>Select the subcommittees you're interested in.</Form.Description>
		<Form.Control>
			{#snippet children({ props })}
				<Checkbox.Group
					{...props}
					class="grid grid-cols-1 gap-4 sm:grid-cols-2"
					bind:value={$formData.subcommittees}
				>
					{#each subcommitteeOptions as subcommitteeOption (subcommitteeOption.id)}
						{@const choiceCardVariant =
							choiceCardVariants[subcommitteeOption.colour % choiceCardVariants.length]}
						<Label for={subcommitteeOption.id} class={`${choiceCardVariant} p-4`}>
							<div class="flex w-full flex-row items-start gap-3">
								<Checkbox.Root
									{...props}
									value={subcommitteeOption.id}
									id={subcommitteeOption.id}
									class={checkboxVariants[subcommitteeOption.colour % checkboxVariants.length]}
								/>
								<div class="grid gap-1.5 font-normal">
									<p class="h-fit leading-none font-semibold">{subcommitteeOption.name}</p>
									<p class="text-sm">
										{subcommitteeOption.description}
									</p>
								</div>
							</div>
						</Label>
					{/each}
				</Checkbox.Group>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Fieldset>

	<fieldset class="flex flex-col gap-3">
		<legend class="mb-3 font-medium">Detailed Responses</legend>
		<Form.Field {form} name="reason">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Why do you want to join?</Form.Label>
					<Textarea
						{...props}
						rows={4}
						placeholder="Tell us what excites you about Linux Society..."
						bind:value={$formData.reason}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="experience">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label
						>Relevant Experience <span class="text-muted-foreground">(optional)</span></Form.Label
					>
					<Textarea
						{...props}
						rows={4}
						placeholder="Any relevant skills, projects, or experience..."
						bind:value={$formData.experience}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</fieldset>

	<div class="flex gap-3">
		<Form.Button class="flex-1" variant="outline" formaction="?/save" disabled={$delayed}>
			{#if $delayed}
				<Spinner />
			{/if}
			Save Draft
		</Form.Button>
		<Form.Button class="flex-1" formaction="?/submit" disabled={$delayed}>
			{#if $delayed}
				<Spinner />
			{/if}
			Submit
		</Form.Button>
	</div>
</form>
