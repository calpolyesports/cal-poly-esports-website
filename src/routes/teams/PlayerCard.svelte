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

	//////////////////////-
	// API INTERACTIONS //
	//////////////////////

	const sendUpdateMember = async (
		id: string,
		formData: any
	): Promise<WithStringId<RosterMember> | undefined> => {
		const response = await fetch(`/teams/${game._id}/${team._id}/${id}`, {
			method: 'PUT',
			body: formData
		});

		if (response.ok) {
			const data = await response.json();
			return data.member;
		}

		return undefined;
	};

	const sendDeleteMember = async (id: string): Promise<boolean> => {
		const response = await fetch(`/teams/${game._id}/${team._id}/${id}`, {
			method: 'DELETE'
		});

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
			<img src="{player.picture}?t={Date.now()}" alt={player.username} />
		</div>
	{/if}
	<div class="bottom-shadow"></div>
	<div class="text">
		<p class="player-name">{player.name}</p>
		{#if player.username.length > 10}
			<p class="player-username-smaller">{player.username}</p>
		{:else}
			<p class="player-username">{player.username}</p>
		{/if}
		<p class="player-role">{player.role}</p>
	</div>
</div>

{#if isAdmin}
	<ModalForm
		bind:this={editMemberModal}
		title="Edit Member"
		fields={modalFields}
		actions={[
			{ name: 'Submit', callback: onSubmitEdit },
			{ name: 'Delete', callback: onSubmitDelete }
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
		transition: 0.2s;
	}

	div.player-card:hover img {
		transform: scale(1.05);
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
		transition: 0.2s;
	}

	div.player-card:hover div.text {
		transform: scale(1.05);
	}

	p.player-name {
		font-size: 1rem;
	}

	p.player-username {
		font-weight: bold;
		font-size: 2rem;
	}

	p.player-username-smaller {
		font-weight: bold;
		font-size: 1.5rem;
	}

	p.player-role {
		font-weight: bold;
		font-size: 1.5rem;
	}

	@media (max-width: 768px) {
		p.player-name {
			font-size: 0.75rem;
		}

		p.player-username {
			font-size: 1rem;
		}

		p.player-username-smaller {
			font-size: 0.75rem;
		}

		p.player-role {
			font-size: 0.75rem;
		}
	}

	p {
		margin: 0;
	}
</style>
