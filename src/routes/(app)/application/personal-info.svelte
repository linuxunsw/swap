<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	type Props = {
		fullName: string;
		discord: string;
		userEmail: string;
		preferredEmail: string | null;
	};

	let { fullName, discord, userEmail, preferredEmail }: Props = $props();
</script>

<Card.Root class="gap-2">
	<Card.Header>
		<Card.Title>Personal info</Card.Title>
	</Card.Header>
	<Card.Content class="grid gap-3 text-sm sm:grid-cols-2">
		<div>
			<p class="text-muted-foreground">Name</p>
			<p class="font-medium text-wrap">{fullName}</p>
		</div>
		<div>
			<p class="text-muted-foreground">Discord</p>
			<p class="truncate font-medium">{discord}</p>
		</div>
		<div>
			<p class="text-muted-foreground">Account email</p>
			<p class="font-medium">{userEmail}</p>
		</div>
		{#if preferredEmail}
			<div>
				<p class="text-muted-foreground">Preferred email</p>
				<p class="truncate font-medium">{preferredEmail}</p>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
