<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	let { form }: { form: ActionData } = $props();
</script>

<h1>login</h1>
<div>
	<form method="post" action="?/sendOTP" use:enhance>
		<label>
			zid
			<input type="text" name="zid" />
		</label>
		<button>send otp</button>
	</form>
</div>

<div>
	<form method="post" action="?/signInOTP" use:enhance>
		<label>
			zid
			<input type="text" name="zid" />
		</label>

		<label>
			otp
			<input type="text" name="otp" />
		</label>
		<button>sign in</button>
	</form>
</div>
