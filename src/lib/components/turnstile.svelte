<script lang="ts">
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { mode } from 'mode-watcher';

	// bindable prop so parent can read whether the challenge is solved
	let { solved = $bindable(false) }: { solved?: boolean } = $props();

	let wrapper: HTMLDivElement;
	let container: HTMLDivElement;
	let widgetId: string | undefined;
	let rendered = $state(false); // for skeleton
	let error = $state(false); // true when script fails to load
	let compact = $state(false); // true when container is too narrow for flexible (< 300px)
	let currentSize: 'compact' | 'flexible' | null = null;
	let scriptLoaded = false;

	// lazily loads the cloudflare turnstile script, avoids loading it more than once
	function loadScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (window.turnstile) {
				resolve();
				return;
			}
			// case where the script tag exists but hasn't finished loading yet
			const existing = document.getElementById('cf-turnstile-script');
			if (existing) {
				existing.addEventListener('load', () => resolve());
				existing.addEventListener('error', () => reject(new Error('Turnstile script failed to load')));
				return;
			}
			// inject the script tag for the first time
			const script = document.createElement('script');
			script.id = 'cf-turnstile-script';
			script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
			script.async = true;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Turnstile script failed to load'));
			document.head.appendChild(script);
		});
	}

	// (re)renders the widget with the given size
	function renderWidget(size: 'compact' | 'flexible') {
		if (widgetId !== undefined && window.turnstile) {
			window.turnstile.remove(widgetId);
		}
		solved = false;
		widgetId = window.turnstile!.render(container, {
			sitekey: PUBLIC_TURNSTILE_SITE_KEY,
			size,
			theme: mode.current,
			callback: () => (solved = true),
			'expired-callback': () => (solved = false),
			'error-callback': () => (solved = false)
		});
		rendered = true;
	}

	$effect(() => {
		// re-render when theme changes
		mode.current;
		if (!scriptLoaded || currentSize === null || !container) {
			return;
		}
		renderWidget(currentSize);
	});

	onMount(() => {
		// observe container width and re-render the widget when crossing the 300px threshold
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const width = entry.contentRect.width;
				const newSize: 'compact' | 'flexible' = width < 300 ? 'compact' : 'flexible';
				compact = newSize === 'compact';
				if (scriptLoaded && newSize !== currentSize) {
					currentSize = newSize;
					renderWidget(newSize);
				}
			}
		});

		observer.observe(wrapper);

		// load the script then do the initial render
		loadScript()
			.then(() => {
				scriptLoaded = true;
				const width = wrapper.getBoundingClientRect().width;
				currentSize = width < 300 ? 'compact' : 'flexible';
				compact = currentSize === 'compact';
				renderWidget(currentSize);
			})
			.catch(() => {
				error = true;
			});

		// cleanup when the component is destroyed
		return () => {
			observer.disconnect();
			if (widgetId !== undefined && window.turnstile) {
				window.turnstile.remove(widgetId);
			}
		};
	});

	export function reset() {
		solved = false;
		if (widgetId !== undefined && window.turnstile) {
			window.turnstile.reset(widgetId);
		}
	}
</script>

<div
	bind:this={wrapper}
	class="relative mt-4 w-full transition-[height] duration-150 mx-auto"
	class:h-35={compact}
	class:h-16.25={!compact}
>
	{#if error}
		<div class="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
			<p>Verification unavailable. Please disable ad blockers or enable third-party scripts.</p>
		</div>
	{:else if !rendered}
		<div class="absolute inset-0">
			<Skeleton class="h-full w-full" />
		</div>
	{/if}
	<div bind:this={container}></div>
</div>
