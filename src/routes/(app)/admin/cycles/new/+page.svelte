<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import CycleForm from '../form/cycle-form.svelte';

	const { data } = $props();
</script>

<Card.Root class="mx-auto w-full max-w-xl">
	<Card.Header>
		<Card.Title class="text-2xl">Create cycle</Card.Title>
	</Card.Header>
	<Card.Content>
		<CycleForm data={data.form} subcommitteeOptions={data.subcommitteeOptions} />
	</Card.Content>
</Card.Root>
