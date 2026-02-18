<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<h1>name: {data.user.name}</h1>
<h1>email: {data.user.email}</h1>
<h1>verified email: {data.user.emailVerified}</h1>
<h1>user id: {data.user.id}</h1>
<form method="post" action="?/signOut" use:enhance>
	<button>Sign out</button>
</form>
