<script lang="ts">
    import * as types from '$lib/types';
    import PlayerCard from './PlayerCard.svelte';

    interface ModalMember {
        name: string;
        username: string;
        role: string;
        picture: string;
    }

    export let members: types.RosterMember[];

    let selectedPlayer: types.RosterMember;

    //////////////////////
    // API INTERACTIONS //
    //////////////////////

    const sendAddEvent = async (newMember: ModalMember) => {
        const response = await fetch("/teams", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMember),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status >= 200 && data.status < 300) {
                return new types.RosterMember(
                    data.member.id,
                    data.member.name,
                    data.member.username,
                    data.member.role,
                    data.member.picture,
                );
            }
        }
        return undefined;
    };

    const sendUpdateEvent = async (id: string, member: ModalMember) => {
        const response = await fetch(`/teams/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(member),
        });

        if (response.ok) {
            const data = await response.json();
            return data.status >= 200 && data.status < 300;
        }
    };

    const sendDeleteEvent = async (id: string) => {
        const response = await fetch(`/teams/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            const data = await response.json();
            return data.status >= 200 && data.status < 300;
        }
        
        return false;
    };

    const onPlayerCardClick = (player: types.RosterMember) => {
        console.log(player);
    };
</script>

<div class="member-grid">
    {#each members as member}
        <PlayerCard player={member} onClick={() => onPlayerCardClick(member)} />
    {/each}
</div>

<style>
    div.member-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
