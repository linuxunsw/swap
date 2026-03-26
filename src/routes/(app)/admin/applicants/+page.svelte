<script lang="ts">
	import { columns } from './columns';
	import DataTable from './data-table.svelte';

	let { data } = $props();
</script>

<DataTable {columns} data={data.applicants} />
