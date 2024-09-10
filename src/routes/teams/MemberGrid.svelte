<script lang="ts">
    import PlayerCard from './PlayerCard.svelte';
    import * as types from '$lib/types';
	import ModalForm from '$lib/ModalForm.svelte';
    import type { ModalFieldDefinition, FilledModalFields } from '$lib/ModalForm.svelte';

    interface ModalMember {
        name: string;
        username: string;
        role: string;
        picture: string;
    }

    interface ModalTeam {
        name: string;
    }
    
    export let game: types.RosterGame;
    export let team: types.RosterTeam;
    export let onRemove: (id: string) => void;
    
    let addMemberModal: ModalForm;
    let addMemberModalVisible = false;

    const memberModalFields = [
        { name: 'name', type: 'text' },
        { name: 'username', type: 'text' },
        { name: 'role', type: 'text' },
        { name: 'picture', type: 'text' },
    ] as ModalFieldDefinition[];

    let editTeamModal: ModalForm;
    let editTeamModalVisible = false;

    const teamModalFields = [
        { name: 'name', type: 'text' },
    ] as ModalFieldDefinition[];

    //////////////////////
    // API INTERACTIONS //
    //////////////////////

    const sendAddMember = async (newMember: ModalMember): Promise<types.RosterMember | undefined> => {
        const response = await fetch(`/teams/${game._id}/${team._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMember),
        });

        if (response.ok) {
            const data = await response.json();
            return data.member;
        }

        return undefined;
    };

    const sendUpdateTeam = async (id: string, team: ModalTeam): Promise<types.RosterTeam | undefined> => {
        const response = await fetch(`/teams/${game._id}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(team),
        });

        if (response.ok) {
            const data = await response.json();
            return data.team;
        }

        return undefined;
    };

    const sendDeleteTeam = async (id: string): Promise<boolean> => {
        const response = await fetch(`/teams/${game._id}/${id}`, {
            method: 'DELETE',
        });

        return response.ok;
    };

    ////////////////////
    // EVENT HANDLERS //
    ////////////////////

    const onClickAddMember = () => {
        addMemberModal.clearFields();
        addMemberModalVisible = true;
    };

    const onSubmitAddMember = async (values: FilledModalFields) => {
        const newMember = {
            name: values.name as string,
            username: values.username as string,
            role: values.role as string,
            picture: values.picture as string,
        };
        const member = await sendAddMember(newMember);
        if (member) {
            team.members = [...team.members, member];
        }
        addMemberModalVisible = false;
    };

    const onClickEditTeam = () => {
        editTeamModal.fillFields({
            name: team.name,
        });
        editTeamModalVisible = true;
    };

    const onSubmitEditTeam = async (values: FilledModalFields) => {
        const updatedTeam = {
            name: values.name as string,
        };
        const responseTeam = await sendUpdateTeam(team._id, updatedTeam);
        if (responseTeam) {
            team = responseTeam;
            console.log(team);
        }
        editTeamModalVisible = false;
    };

    const onSubmitDeleteTeam = async (values: FilledModalFields) => {
        const deleted = await sendDeleteTeam(team._id);
        if (deleted) {
            onRemove(team._id);
        }
        editTeamModalVisible = false;
    };

    const onMemberRemove = (id: string) => {
        team.members = team.members.filter(m => m._id !== id);
    };
</script>

<div class="box">
    <h2>{team.name}</h2>
    <div class="buttons">
        <button on:click={onClickAddMember}>Add Member</button>
        <button on:click={onClickEditTeam}>Edit Team</button>
    </div>
    <div class="member-grid">
        {#each team.members as member}
            <PlayerCard game={game} team={team} player={member} onRemove={onMemberRemove} />
        {/each}
    </div>
</div>

<ModalForm
    bind:this={addMemberModal}
    bind:show={addMemberModalVisible}
    title="Add Member"
    fields={memberModalFields}
    actions={[
        { name: 'Submit', callback: onSubmitAddMember },
    ]} />

<ModalForm
    bind:this={editTeamModal}
    bind:show={editTeamModalVisible}
    title="Edit Team"
    fields={teamModalFields}
    actions={[
        { name: 'Submit', callback: onSubmitEditTeam },
        { name: 'Delete', callback: onSubmitDeleteTeam },
    ]} />

<style>
	div.box {
        display: flex;
        flex-direction: column;
        align-items: center;
		margin: 1rem 0;
		width: 100%;
	}

    h2 {
        font-size: 2rem;
        font-weight: bold;
        margin-top: 2rem;
    }

    div.member-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    div.buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
</style>
