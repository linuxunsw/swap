<script>
	import { enhance } from '$app/forms';
	import { Button } from '#lib/components/ui/button/index.ts';
</script>

<h1>admin</h1>

<form method="post" use:enhance>
	<Button type="submit">do a thing</Button>
</form>
