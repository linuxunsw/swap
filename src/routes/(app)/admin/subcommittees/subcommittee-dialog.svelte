<script lang="ts">
	import * as ResponsiveDialog from '$lib/components/responsive-dialog/index.js';
	import {
		Button,
		type ButtonSize,
		type ButtonVariant,
		buttonVariants
	} from '$lib/components/ui/button/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import type { SubcommitteeOption } from '$lib/server/controllers/subcommittee';
	import { useId } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { SubcommitteeSchema } from './form/schema';
	import SubcommitteeForm from './form/subcommittee-form.svelte';
	import SubcommitteeDeleteAction from './subcommittee-delete-action.svelte';

	type SubcommitteeFormData = SuperValidated<Infer<SubcommitteeSchema>>;
	type DialogAction = 'create' | 'update';

	let {
		form,
		action,
		subcommitteeOption,
		children,
		triggerVariant = 'secondary',
		triggerSize = 'default',
		triggerClass,
		open = $bindable(false)
	}: {
		form: SubcommitteeFormData;
		action: DialogAction;
		subcommitteeOption?: SubcommitteeOption;
		children?: Snippet;
		triggerVariant?: ButtonVariant;
		triggerSize?: ButtonSize;
		triggerClass?: string;
		open?: boolean;
	} = $props();

	const isEdit = $derived(action === 'update');
	const formAction = $derived(`?/${action}`);
	const submitLabel = $derived(isEdit ? 'Save Changes' : 'Create Subcommittee');
	const formId = `subcommittee-dialog-form-${useId()}`;
	const deleteSubmitterId = `${formId}-delete-submitter`;
	let delayed = $state(false);

	const dialogTitle = $derived(
		isEdit && subcommitteeOption ? `Edit ${subcommitteeOption.name}` : 'Create Subcommittee'
	);

	const dialogDescription = $derived(
		isEdit
			? 'Update the subcommittee details below.'
			: 'Add a new subcommittee by filling out the form below.'
	);

	const initialData = $derived.by(() => {
		if (!isEdit || !subcommitteeOption) {
			return form;
		}

		return {
			...form,
			data: {
				id: subcommitteeOption.id,
				name: subcommitteeOption.name,
				description: subcommitteeOption.description,
				colour: subcommitteeOption.colour
			}
		} satisfies SubcommitteeFormData;
	});
</script>

<ResponsiveDialog.Root bind:open>
	<ResponsiveDialog.Trigger>
		{#snippet child({ props }: { props: Record<string, unknown> })}
			<Button {...props} variant={triggerVariant} size={triggerSize} class={triggerClass}>
				{@render children?.()}
			</Button>
		{/snippet}
	</ResponsiveDialog.Trigger>

	<ResponsiveDialog.Content class="sm:max-w-140">
		<ResponsiveDialog.Header class="text-start">
			<ResponsiveDialog.Title>{dialogTitle}</ResponsiveDialog.Title>
			<ResponsiveDialog.Description>{dialogDescription}</ResponsiveDialog.Description>
		</ResponsiveDialog.Header>

		<SubcommitteeForm
			data={initialData}
			action={formAction}
			mode={action}
			{formId}
			bind:delayedState={delayed}
			onSuccess={() => {
				open = false;
			}}
		/>

		<ResponsiveDialog.Footer>
			{#if isEdit}
				<SubcommitteeDeleteAction {formId} disabled={delayed} {deleteSubmitterId} />
			{/if}

			<ResponsiveDialog.Close disabled={delayed} class={buttonVariants({ variant: 'outline' })}>
				Cancel
			</ResponsiveDialog.Close>
			<Button type="submit" form={formId} disabled={delayed}>
				{#if delayed}
					<Spinner />
				{/if}
				{submitLabel}
			</Button>
		</ResponsiveDialog.Footer>
	</ResponsiveDialog.Content>
</ResponsiveDialog.Root>
