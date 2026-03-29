<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- HTML Meta Tags -->
	<title>SWAP - Linux Society @ UNSW</title>
	<meta
		name="description"
		content="The subcommittee web application portal for the Linux Society @ UNSW."
	/>

	<!-- Open Graph Meta Tags -->
	<meta property="og:url" content="https://swap.linuxunsw.org" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="SWAP - Linux Society @ UNSW" />
	<meta
		property="og:description"
		content="The subcommittee web application portal for the Linux Society @ UNSW."
	/>
	<meta property="og:image" content="https://swap.linuxunsw.org/og-image.png" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="swap.linuxunsw.org" />
	<meta property="twitter:url" content="https://swap.linuxunsw.org" />
	<meta name="twitter:title" content="SWAP - Linux Society @ UNSW" />
	<meta
		name="twitter:description"
		content="The subcommittee web application portal for the Linux Society @ UNSW."
	/>
	<meta name="twitter:image" content="https://swap.linuxunsw.org/og-image.png" />
</svelte:head>

<ModeWatcher />
<Toaster richColors position="top-center" />
{@render children()}
