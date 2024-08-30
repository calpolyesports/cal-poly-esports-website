<!-- routes/login/+page.svelte -->
<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData } from './$types';

	export let data;
	export let form: ActionData;
</script>

{#if !data.username}
	<h1>Sign in</h1>

	<form method="post" action="/login?/login" use:enhance>
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
{:else}
	<h1>Logged in as: {data.username}</h1>
	<form method="post" action="/login?/logout" use:enhance>
		<button>Log out</button>
	</form>
{/if}
