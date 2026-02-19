<script lang="ts">
	import type { WithStringId, RosterGame, RosterTeam, RosterMember } from '$lib/types';
	import ModalForm from '$lib/ModalForm.svelte';
	import { env } from '$env/dynamic/public';

	import type { ModalFieldDefinition } from '$lib/ModalForm.svelte';

	let {
		game,
		team,
		player,
		playerIndex,
		isAdmin
	}: {
		game: WithStringId<RosterGame>;
		team: RosterTeam;
		player: RosterMember;
		playerIndex: number;
		isAdmin: boolean;
	} = $props();

	let editMemberModal: ModalForm | undefined = $state(undefined);

	const modalFields = [
		{ id: 'name', name: 'Name', type: 'text', required: true },
		{ id: 'username', name: 'Username', type: 'text', required: true },
		{ id: 'role', name: 'Role', type: 'text', required: true },
		{
			id: 'picture',
			name: 'Picture',
			type: 'file',
			accept: ['.jpg', '.jpeg', '.png', '.webp']
		}
	] as ModalFieldDefinition[];

	////////////////////
	// EVENT HANDLERS //
	////////////////////

	const onClick = () => {
		if (!isAdmin) return;
		editMemberModal?.fillFields({
			name: player.name,
			username: player.username,
			role: player.role,
			picture: player.picture || null
		});
		editMemberModal?.showModal();
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div role="button" tabindex={playerIndex} class="player-card" onclick={onClick}>
	<div class="picture-container">
		{#if player.picture}
			<img src="{player.picture}?t={Date.now()}" alt={player.username} />
		{:else}
			<img src={env.PUBLIC_DEFAULT_PROFILE_IMAGE} alt={player.username} />
		{/if}
	</div>
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
		extraInfo={{ id: player.id }}
		actions={[
			{ name: 'Submit', action: `/teams/${game._id}/${team.id}?/edit` },
			{ name: 'Delete', action: `/teams/${game._id}/${team.id}?/delete` }
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
		border-radius: var(--radius-lg);
		padding: 1rem;
		margin: 1rem;
		color: var(--neutral-bright);
		box-shadow: var(--shadow-md);
		border-bottom: 3px solid var(--cal-poly-secondary);
		transition: transform var(--transition-base), box-shadow var(--transition-base);
	}

	div.player-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
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
