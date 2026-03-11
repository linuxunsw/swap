<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import PenLineIcon from '@lucide/svelte/icons/pen-line';

	type Props = {
		canEdit: boolean;
	};

	let { canEdit }: Props = $props();
</script>

<div class="flex flex-wrap gap-3">
	<Button variant="outline" size="sm" href="/application">
		<FileTextIcon class="size-3.5" />
		View full application
	</Button>
	{#if canEdit}
		<Button variant="outline" size="sm" href="/apply">
			<PenLineIcon class="size-3.5" />
			Edit application
		</Button>
	{/if}
</div>
