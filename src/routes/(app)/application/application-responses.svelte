<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	type Props = {
		reason: string;
		experience: string;
	};

	let { reason, experience }: Props = $props();
</script>

<section class="space-y-4">
	<h2 class="text-lg font-semibold">Responses</h2>
	<Card.Root class="gap-2">
		<Card.Header>
			<Card.Title>Why do you want to join?</Card.Title>
		</Card.Header>
		<Card.Content class="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
			{reason || 'N/A'}
		</Card.Content>
	</Card.Root>

	<Card.Root class="gap-2">
		<Card.Header>
			<Card.Title>Relevant experience</Card.Title>
		</Card.Header>
		<Card.Content class="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
			{experience || 'N/A'}
		</Card.Content>
	</Card.Root>
</section>
