<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';

    export let data;
    let club = data.club;

    // Watch for URL changes and update the club data accordingly
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
                <p>{member.name} - {member.position}</p>
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
    }

    ul li {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    ul li img {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        margin-right: 1rem;
    }

    ul li p {
        font-size: 1.2rem;
    }
</style>
