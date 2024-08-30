<script lang="ts">
    import { enhance } from "$app/forms";

    export let data;
</script>

<div>
    <h1>Admin</h1>
    <h2>Logged in as: {data.username}</h2>

	<form method="post" use:enhance>
		<button>Log out</button>
	</form>
    
    <h3>Clubs</h3>
    {#each data.adminFor as club}
        <a href="/clubs/{club.urlName}">{club.clubName}</a>
    {/each}
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: 1rem auto;
    }

    h1 {
        font-size: 3rem;
        font-weight: bold;
        margin-top: 1rem;
        text-align: center;
        text-decoration-line: underline;
        text-decoration-color: var(--cal-poly-secondary);
        text-decoration-thickness: 0.2rem;
        text-underline-offset: 2rem;
    }

    h2 {
        font-size: 2rem;
        font-weight: bold;
        margin-top: 1rem;
    }

    h3 {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
        color: var(--cal-poly-secondary);
    }

    a {
        font-size: 1.25rem;
        margin: 0;
        color: black;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    button {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        padding: 0.5rem 1rem;
        background-color: var(--cal-poly-secondary);
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
    }
</style>