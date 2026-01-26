<!-- routes/login/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<h1>Sign in</h1>

<form method="post" use:enhance>
	{#if form?.message}
		<p>{form?.message}</p>
	{/if}
	<label for="username">Username</label>
	<input name="username" id="username" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<button>Continue</button>
</form>

<style>
	form p {
		text-align: center;
		color: red;
	}
</style>
