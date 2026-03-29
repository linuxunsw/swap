<script lang="ts">
	import type { PageProps } from './$types';
	import ApplicationForm from './application-form.svelte';

	let { data }: PageProps = $props();
</script>

<ApplicationForm data={data.form} subcommitteeOptions={data.subcommitteeOptions} />
