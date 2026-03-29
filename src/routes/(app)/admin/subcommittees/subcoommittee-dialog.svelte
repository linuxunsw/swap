<script lang="ts">
	import {
		Button,
		type ButtonSize,
		type ButtonVariant,
		buttonVariants
	} from '$lib/components/ui/button/index.js';
	import {
		ResponsiveDialog,
		ResponsiveDialogClose,
		ResponsiveDialogContent,
		ResponsiveDialogDescription,
		ResponsiveDialogFooter,
		ResponsiveDialogHeader,
		ResponsiveDialogTitle,
		ResponsiveDialogTrigger
	} from '$lib/components/responsive-dialog/index.js';
	import type { SubcommitteeOption } from '$lib/server/controllers/subcommittee';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { Snippet } from 'svelte';
	import SubcommitteeForm from './form/subcommittee-form.svelte';
	import type { SubcommitteeSchema } from './form/schema';

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

	const dialogTitle = $derived(
		isEdit && subcommitteeOption ? `Edit ${subcommitteeOption.name}` : 'Create Subcommittee'
	);

	const dialogDescription = $derived(
		isEdit
			? 'Update this subcommittee and save your changes.'
			: 'Create a new subcommittee and assign a color.'
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

<ResponsiveDialog bind:open>
	<ResponsiveDialogTrigger>
		{#snippet child({ props }: { props: Record<string, unknown> })}
			<Button {...props} variant={triggerVariant} size={triggerSize} class={triggerClass}>
				{@render children?.()}
			</Button>
		{/snippet}
	</ResponsiveDialogTrigger>

	<ResponsiveDialogContent class="sm:max-w-140">
		<ResponsiveDialogHeader class="text-start">
			<ResponsiveDialogTitle>{dialogTitle}</ResponsiveDialogTitle>
			<ResponsiveDialogDescription>{dialogDescription}</ResponsiveDialogDescription>
		</ResponsiveDialogHeader>

		<SubcommitteeForm data={initialData} action={formAction} mode={action} />

		<ResponsiveDialogFooter class="pt-0">
			<ResponsiveDialogClose class={buttonVariants({ variant: 'outline' })}
				>Cancel</ResponsiveDialogClose
			>
		</ResponsiveDialogFooter>
	</ResponsiveDialogContent>
</ResponsiveDialog>
