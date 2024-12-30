<script lang="ts">
    import type { WithStringId, RosterGame, RosterTeam, RosterMember } from '$lib/types';
	import ModalForm from '$lib/ModalForm.svelte';
    import type { ModalFieldDefinition, FilledModalFields, ModalErrors } from '$lib/ModalForm.svelte';

    export let game: WithStringId<RosterGame>;
    export let team: WithStringId<RosterTeam>;
    export let player: WithStringId<RosterMember>;
    export let isAdmin: boolean;
    export let onRemove: (id: string) => void;

    interface ModalMember {
        name: string;
        username: string;
        role: string;
        picture: File;
    }

    let editMemberModal: ModalForm;

    const modalFields = [
        { name: 'name', type: 'text', required: true },
        { name: 'username', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'picture', type: 'file', accept: ['.jpg', '.jpeg', '.png', '.webp'], required: true },
    ] as ModalFieldDefinition[];
    
    //////////////////////-
    // API INTERACTIONS //
    //////////////////////

    const sendUpdateMember = async (id: string, formData: any): Promise<WithStringId<RosterMember> | undefined> => {
        const response = await fetch(`/teams/${game._id}/${team._id}/${id}`, {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            return data.member;
        }

        return undefined;
    };

    const sendDeleteMember = async (id: string): Promise<boolean> => {
        const response = await fetch(`/teams/${game._id}/${team._id}/${id}`, {
            method: 'DELETE',
        });
        
        return response.ok;
    };

    ////////////////////
    // EVENT HANDLERS //
    ////////////////////
    
    const onClick = () => {
        if (!isAdmin) return;
        editMemberModal.fillFields({
            name: player.name,
            username: player.username,
            role: player.role,
            picture: player.picture,
        });
        editMemberModal.showModal();
    };

    const onSubmitEdit = async (modalFields: FilledModalFields) => {
        const formData = new FormData();
        formData.append('name', modalFields.name as string);
        formData.append('username', modalFields.username as string);
        formData.append('role', modalFields.role as string);
        formData.append('picture', modalFields.picture as File);

        const updated = await sendUpdateMember(player._id, formData);
        if (updated) {
            player = updated;
            team.members = team.members.map(m => m._id === player._id ? player : m);
        }

        return {} as ModalErrors;
    };

    const onSubmitDelete = async (values: FilledModalFields) => {
        const deleted = await sendDeleteMember(player._id);
        if (deleted) {
            onRemove(player._id);
        }

        return {} as ModalErrors;
    };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="player-card" on:click={onClick}>
    {#if player.picture}
    <div class="picture-container">
        <img src="{player.picture}?t={Date.now()}" alt="{player.username}" />
    </div>
    {/if}
    <div class="bottom-shadow"></div>
    <div class="text">
        <p>{player.name}</p>
        <h1>{player.username}</h1>
        <h2>{player.role}</h2>
    </div>
</div>

{#if isAdmin}
    <ModalForm
        bind:this={editMemberModal}
        title="Edit Member"
        fields={modalFields}
        actions={[
            { name: 'Submit', callback: onSubmitEdit },
            { name: 'Delete', callback: onSubmitDelete },
        ]}
    />
{/if}

<style>
    div.player-card {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 20rem;
        width: 15rem;
        overflow: hidden;
        background-color: var(--neutral-bright);
        border-radius: 1rem;
        padding: 1rem;
        margin: 1rem;
        color: var(--neutral-bright);
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
        div.player-card {
            height: 8rem;
            width: 6rem;
        }
    }

    div.picture-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    div.picture-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
    }

    div.bottom-shadow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
        z-index: 0;
    }

    div.text {
        position: relative;
        z-index: 1;
        text-align: center;
    }

    h1, h2, p {
        margin: 0;
    }
</style>
