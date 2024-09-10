<script lang="ts">
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import AboutText from './AboutText.svelte';

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
    <AboutText html={club.aboutText} />

    <h2>Board Members</h2>
    <ul class="board-members">
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
    <h1>404</h1>
    <p>Club does not exist</p>
{/if}

<style>
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        text-decoration-line: underline;
        text-decoration-color: var(--cal-poly-secondary);
        text-decoration-thickness: 0.2rem;
        text-underline-offset: 2rem;
    }

    p {
        font-size: 1.5rem;
        margin-bottom: 2rem;
    }

    ul.board-members {
        list-style: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
    }

    ul.board-members li {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1.5rem;
        width: 150px;
    }

    ul.board-members li img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-bottom: 1rem;
    }

    ul.board-members li p {
        font-size: 1.2rem;
        margin: 0.5rem 0;
        text-align: center;
    }
</style>
