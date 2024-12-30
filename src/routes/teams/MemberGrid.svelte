<script lang="ts">
    import PlayerCard from './PlayerCard.svelte';
    import type { WithStringId, RosterGame, RosterTeam, RosterMember } from '$lib/types';
    import ModalForm from '$lib/ModalForm.svelte';
    import type { ModalFieldDefinition, FilledModalFields, ModalErrors } from '$lib/ModalForm.svelte';
    
    interface ModalMember {
        name: string;
        username: string;
        role: string;
        picture: string;
    }

    interface ModalTeam {
        name: string;
    }
    
    export let game: WithStringId<RosterGame>;
    export let team: WithStringId<RosterTeam>;
    export let isAdmin: boolean;
    export let onRemove: (id: string) => void;
    
    let addMemberModal: ModalForm;

    const memberModalFields = [
        { name: 'name', type: 'text', required: true },
        { name: 'username', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'picture', type: 'file', accept: ['.jpg', '.jpeg', '.png', '.webp'], required: true },
    ] as ModalFieldDefinition[];

    let editTeamModal: ModalForm;

    const teamModalFields = [
        { name: 'name', type: 'text', required: true },
    ] as ModalFieldDefinition[];

    //////////////////////
    // API INTERACTIONS //
    //////////////////////

    const sendAddMember = async (formData: any): Promise<WithStringId<RosterMember> | undefined> => {
        const response = await fetch(`/teams/${game._id}/${team._id}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            team.members = [...team.members, data.member];
        }

        return undefined;
    };

    const sendUpdateTeam = async (id: string, team: ModalTeam): Promise<WithStringId<RosterTeam> | undefined> => {
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
        addMemberModal.showModal();
    };

    const onSubmitAddMember = async (modalFields: FilledModalFields) => {
        const formData = new FormData();
        formData.append('name', modalFields.name as string);
        formData.append('username', modalFields.username as string);
        formData.append('role', modalFields.role as string);
        formData.append('picture', modalFields.picture as File);

        sendAddMember(formData);
        
        return {} as ModalErrors;
    };

    const onClickEditTeam = () => {
        editTeamModal.fillFields({
            name: team.name,
        });
        editTeamModal.showModal();
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
        
        return {} as ModalErrors;
    };

    const onSubmitDeleteTeam = async (values: FilledModalFields) => {
        const deleted = await sendDeleteTeam(team._id);
        if (deleted) {
            onRemove(team._id);
        }
        
        return {} as ModalErrors;
    };

    const onMemberRemove = (id: string) => {
        team.members = team.members.filter(m => m._id !== id);
    };
</script>

<div class="box">
    <h2>{team.name}</h2>
    {#if isAdmin}
        <div class="buttons">
            <button class="button-small" on:click={onClickAddMember}>Add Member</button>
            <button class="button-small" on:click={onClickEditTeam}>Edit Team</button>
        </div>
    {/if}
    <div class="member-grid">
        {#each team.members as member}
            <PlayerCard
                game={game}
                team={team}
                player={member}
                {isAdmin}
                onRemove={onMemberRemove} />
        {/each}
    </div>
</div>

{#if isAdmin}
    <ModalForm
        bind:this={addMemberModal}
        title="Add Member"
        fields={memberModalFields}
        actions={[
            { name: 'Submit', callback: onSubmitAddMember },
        ]} />

    <ModalForm
        bind:this={editTeamModal}
        title="Edit Team"
        fields={teamModalFields}
        actions={[
            { name: 'Submit', callback: onSubmitEditTeam },
            { name: 'Delete', callback: onSubmitDeleteTeam },
        ]} />
{/if}

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
        text-align: center;
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
