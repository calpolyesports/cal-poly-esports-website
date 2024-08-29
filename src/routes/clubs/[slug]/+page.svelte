<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';

    export let data;
    let club = data.club;

    $: {
        const { slug } = get(page).params;
        if (slug) {
            club = data.club;
        }
    }
</script>

{#if club}
    <h1>{club.clubName} Club</h1>
    <p>{club.aboutText}</p>

    <h2>Board Members</h2>
    <ul>
        {#each club.boardMembers as member}
            <li>
                {#if member.profileImage}
                    <img src={member.profileImage} alt={member.name} />
                {/if}
                <p>{member.name}</p>
                <p>{member.position}</p>
            </li>
        {/each}
    </ul>
{:else}
    <p>Club does not exist</p>
{/if}

<style>
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    p {
        font-size: 1.5rem;
        margin-bottom: 2rem;
    }

    ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
    }

    ul li {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1.5rem;
        width: 150px;
    }

    ul li img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-bottom: 1rem;
    }

    ul li p {
        font-size: 1.2rem;
        margin: 0.5rem 0;
        text-align: center;
    }
</style>
