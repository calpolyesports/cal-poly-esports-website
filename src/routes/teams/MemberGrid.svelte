<script lang="ts">
    import PlayerCard from './PlayerCard.svelte';

    import * as types from '$lib/types';

    interface ModalMember {
        name: string;
        username: string;
        role: string;
        picture: string;
    }
    
    export let game: types.RosterGame;
    export let team: types.RosterTeam;

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
                return {
                    _id: data.member.id,
                    name: data.member.name,
                    username: data.member.username,
                    role: data.member.role,
                    picture: data.member.picture,
                } as types.RosterMember;
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
    {#each team.members as member}
        <PlayerCard game={game} team={team} player={member} />
    {/each}
</div>

<style>
    div.member-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
