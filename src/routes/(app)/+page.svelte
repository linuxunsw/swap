<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import EmptyApplication from '$lib/components/empty-application.svelte';

	let { data }: { data: PageServerData } = $props();

	const canEdit = $derived(
		data.application?.status === 'draft' ||
			data.application?.status === 'submitted' ||
			!data.application
	);
</script>

{#if !data.application}
	<section class="mx-auto max-w-3xl py-10">
		<EmptyApplication />
	</section>
{:else}
	<h1>hi</h1>
{/if}


