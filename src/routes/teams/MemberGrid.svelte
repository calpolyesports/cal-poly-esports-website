<script lang="ts">
    import PlayerCard from './PlayerCard.svelte';
    import type { WithStringId, RosterGame, RosterTeam, RosterMember } from '$lib/types';
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
    
    export let game: WithStringId<RosterGame>;
    export let team: WithStringId<RosterTeam>;
    export let isAdmin: boolean;
    export let onRemove: (id: string) => void;
    
    let addMemberModal: ModalForm;
    let selectedFile: File | null = null;

    const memberModalFields = [
        { name: 'name', type: 'text' },
        { name: 'username', type: 'text' },
        { name: 'role', type: 'text' },
        { name: 'picture', type: 'file', accept:".jpg, .jpeg, .png, .webp", onFileChange: true },
    ] as ModalFieldDefinition[];

    let editTeamModal: ModalForm;

    const teamModalFields = [
        { name: 'name', type: 'text' },
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

    const updateTeamOrder = async () => {
        const response = await fetch(`/teams/${game._id}/${team._id}/reorder`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                members: team.members.map(m => m._id),
            }),
        });

        if (!response.ok) {
            console.error('Failed to update the team order');
        }
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
        formData.append('name', modalFields.name);
        formData.append('username', modalFields.username);
        formData.append('role', modalFields.role);
        if (selectedFile) {
            formData.append('picture', selectedFile);
        }

        sendAddMember(formData);

        addMemberModal.hideModal();
        selectedFile = null;
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
        editTeamModal.hideModal();
    };

    const onSubmitDeleteTeam = async (values: FilledModalFields) => {
        const deleted = await sendDeleteTeam(team._id);
        if (deleted) {
            onRemove(team._id);
        }
        editTeamModal.hideModal();
    };

    const onMemberRemove = (id: string) => {
        team.members = team.members.filter(m => m._id !== id);
    };

    const onFileChange = (event: CustomEvent) => {
        const { file } = event.detail;

        if (file) {
            selectedFile = file;
        } else {
            console.error("File selection is invalid in MEMBERGRID");
        }
    };

    const moveMember = (oldIndex: number, newIndex: number) => {
        const members = [...team.members];
        const [movedMember] = members.splice(oldIndex, 1);
        members.splice(newIndex, 0, movedMember);
        team.members = members;

        updateTeamOrder();
    };

    const onMoveLeft = (id: string) => {
        const index = team.members.findIndex(m => m._id === id);
        if (index > 0) {
            moveMember(index, index - 1);
        }
    };

    const onMoveRight = (id: string) => {
        const index = team.members.findIndex(m => m._id === id);
        if (index < team.members.length - 1) {
            moveMember(index, index + 1);
        }
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
                onRemove={onMemberRemove}
                onMoveLeft={onMoveLeft}
                onMoveRight={onMoveRight} />
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
        ]}
        on:fileChange={onFileChange} 
    />

    <ModalForm
        bind:this={editTeamModal}
        title="Edit Team"
        fields={teamModalFields}
        actions={[
            { name: 'Submit', callback: onSubmitEditTeam },
            { name: 'Delete', callback: onSubmitDeleteTeam },
        ]}  />
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
