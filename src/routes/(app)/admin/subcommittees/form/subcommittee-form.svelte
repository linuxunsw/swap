<script lang="ts">
	import { page } from '$app/state';
	import { ResponsiveAlertDialog } from '$lib/components/responsive-alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Textarea } from '$lib/components/ui/textarea';
	import { swapBadgeVariants } from '$lib/constants';
	import { CheckIcon, XIcon } from '@lucide/svelte';
	import { useId } from 'bits-ui';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { subcommitteeSchema, type SubcommitteeSchema } from './schema';

	let {
		data,
		action,
		mode = 'create',
		formId = `subcommittee-form-${useId()}`,
		delayedState = $bindable(false),
		onSuccess
	}: {
		data: SuperValidated<Infer<SubcommitteeSchema>>;
		action?: string;
		mode?: 'create' | 'update';
		formId?: string;
		delayedState?: boolean;
		onSuccess?: () => void;
	} = $props();
	const validationSchema = (() => subcommitteeSchema)();

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
		id: formId,
		validators: valibotClient(validationSchema),
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
					onSuccess?.();
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

	const { form: formData, errors, enhance, message, delayed } = form;

	const {
		delayed: delayedIdCheck,
		submit: submitIdCheck,
		enhance: submitEnhance
	} = superForm(
		{ id: '' },
		{
			invalidateAll: false,
			applyAction: false,
			multipleSubmits: 'abort',
			onSubmit({ cancel }) {
				if (!$formData.id) cancel();
			},
			onUpdated({ form }) {
				// Update the other form to show the error message
				$errors.id = form.errors.id;
			}
		}
	);

	let debounceTimer: number | undefined;

	const debounce = <T extends (...args: unknown[]) => void>(callback: T, wait = 500) => {
		return (...args: Parameters<T>) => {
			if (debounceTimer) window.clearTimeout(debounceTimer);
			debounceTimer = window.setTimeout(() => callback(...args), wait);
		};
	};

	const checkId = debounce(() => {
		if (mode === 'create') {
			submitIdCheck();
		}
	}, 300);

	$effect(() => {
		delayedState = $delayed;
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
{#if mode === 'create'}
	<form id="check" method="POST" action="?/check" use:submitEnhance></form>
{/if}
<form
	id={formId}
	method="POST"
	{action}
	class="mx-auto no-scrollbar w-full max-w-xl space-y-6 overflow-y-auto px-4"
	use:enhance
>
	<Form.Field {form} name="id">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Subcommittee ID</Form.Label>

				<InputGroup.Root {...props}>
					<InputGroup.Input
						{...props}
						form={mode === 'create' ? 'check' : undefined}
						placeholder="lovely-subcom"
						bind:value={$formData.id}
						disabled={mode === 'update'}
						oninput={checkId}
					/>
					<InputGroup.Addon align="inline-end">
						{#if mode === 'create' && $delayedIdCheck}
							<Spinner class="ml-2" />
						{:else if $errors.id}
							<span class="text-destructive">
								<XIcon />
							</span>
						{:else if mode === 'create' && $formData.id && 'id' in $errors}
							<CheckIcon />
						{/if}
					</InputGroup.Addon>
				</InputGroup.Root>
				<input hidden name="id" value={$formData.id} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Subcommittee Name</Form.Label>
				<Input {...props} placeholder="Lovely Subcom" bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>
					Subcommittee Description <span class="text-muted-foreground">(Optional)</span>
				</Form.Label>
				<Textarea
					{...props}
					placeholder="awesome but concise description about this subcommittee"
					bind:value={$formData.description}
					rows={2}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Fieldset class="space-y-3" {form} name="colour">
		<Form.Legend class="text-base font-medium">Subcommittee Colour</Form.Legend>
		<!-- <input hidden name="colour" value={$formData.colour ?? 0} /> -->
		<RadioGroup.Root
			class="mx-auto grid w-full max-w-sm grid-cols-4 gap-2"
			value={String($formData.colour ?? 0)}
			name="colour"
			onValueChange={(value) => {
				$formData.colour = Number(value);
			}}
		>
			{#each swapBadgeVariants as badgeVariant, i (i)}
				<Form.Control>
					{@const defaultClasses =
						'flex min-w-0 w-fit cursor-pointer mx-auto items-center gap-2 rounded-md border p-2 hover:bg-accent'}
					{@const selectedClasses = 'ring-primary ring-2 bg-accent'}
					<label class={`${defaultClasses} ${$formData.colour === i ? selectedClasses : ''}`}>
						<RadioGroup.Item hidden value={String(i)} />
						<span class={`${badgeVariant} h-5 min-w-5`}></span>
					</label>
				</Form.Control>
			{/each}
		</RadioGroup.Root>
		<Form.FieldErrors />
	</Form.Fieldset>
</form>
