<script lang="ts">
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import AboutText from './AboutText.svelte';
	import type { WithStringId, Club } from '$lib/types';

    export let data;
    let club: WithStringId<Club> | undefined;
    let canEdit: boolean = false;

    $: {
        const { slug } = get(page).params;
        if (slug) {
            club = data.club;
            canEdit = Boolean(data.adminFor.find((admin) => admin.urlName === club?.urlName));
        }
    }

    let editingAbout = false;

    const saveAbout = async () => {
        if (club) {
            const response = await fetch(`/clubs/${club.urlName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ aboutText: club.aboutText }),
            });

            if (response.ok) {
                editingAbout = false;
                const body = await response.json();
                club.aboutHtml = body.club.aboutHtml;
            }
        }
    };
</script>

{#if club}
    <h1>{club.clubName} Club</h1>
    {#if canEdit && editingAbout}
        <textarea bind:value={club.aboutText}></textarea>
        <button on:click={saveAbout}>Save</button>
    {:else}
        {#if canEdit}
            <br>
            <button on:click={() => editingAbout = true}>Edit</button>
        {/if}
        <AboutText html={club.aboutHtml} />
    {/if}

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
