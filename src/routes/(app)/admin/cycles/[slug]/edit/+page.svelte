<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import CycleForm from '../../form/cycle-form.svelte';
	import DeleteCycleButton from './delete-cycle-button.svelte';
	const { data } = $props();
</script>

<div class="flex items-end"></div>

<Card.Root class="mx-auto w-full max-w-xl">
	<Card.Header>
		<Card.Title class="text-2xl">Edit Cycle</Card.Title>
		<Card.Action><DeleteCycleButton /></Card.Action>
	</Card.Header>
	<Card.Content>
		<CycleForm
			action="?/editCycle"
			data={data.form}
			subcommitteeOptions={data.subcommitteeOptions}
		/>
	</Card.Content>
</Card.Root>
