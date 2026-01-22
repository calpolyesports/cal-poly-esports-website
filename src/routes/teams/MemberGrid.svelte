<script lang="ts">
	import PlayerCard from './PlayerCard.svelte';
	import type { WithStringId, RosterGame, RosterTeam } from '$lib/types';
	import ModalForm from '$lib/ModalForm.svelte';
	import type { ModalFieldDefinition } from '$lib/ModalForm.svelte';

	let {
		game,
		team,
		isAdmin
	}: {
		game: WithStringId<RosterGame>;
		team: RosterTeam;
		isAdmin: boolean;
	} = $props();

	let addMemberModal: ModalForm | undefined = $state(undefined);

	const memberModalFields = [
		{ name: 'name', type: 'text', required: true },
		{ name: 'username', type: 'text', required: true },
		{ name: 'role', type: 'text', required: true },
		{ name: 'picture', type: 'file', accept: ['.jpg', '.jpeg', '.png', '.webp'], required: false }
	] as ModalFieldDefinition[];

	let editTeamModal: ModalForm | undefined = $state(undefined);

	const teamModalFields = [
		{ name: 'name', type: 'text', required: true }
	] as ModalFieldDefinition[];

	////////////////////
	// EVENT HANDLERS //
	////////////////////

	const onClickAddMember = () => {
		addMemberModal?.clearFields();
		addMemberModal?.showModal();
	};

	const onClickEditTeam = () => {
		editTeamModal?.fillFields({
			name: team.name
		});
		editTeamModal?.showModal();
	};
</script>

<div class="box">
	<h2>{team.name}</h2>
	{#if isAdmin}
		<div class="buttons">
			<button class="button-small" onclick={onClickAddMember}>Add Member</button>
			<button class="button-small" onclick={onClickEditTeam}>Edit Team</button>
		</div>
	{/if}
	<div class="member-grid">
		{#each team.members as member, i (member.id)}
			<PlayerCard {game} {team} player={member} playerIndex={i} {isAdmin} />
		{/each}
	</div>
</div>

{#if isAdmin}
	<ModalForm
		bind:this={addMemberModal}
		title="Add Member"
		fields={memberModalFields}
		actions={[{ name: 'Submit', action: `/teams/${game._id}/${team.id}?/create` }]}
	/>

	<ModalForm
		bind:this={editTeamModal}
		title="Edit Team"
		fields={teamModalFields}
		extraInfo={{ id: team.id }}
		actions={[
			{ name: 'Submit', action: `/teams/${game._id}?/edit` },
			{ name: 'Delete', action: `/teams/${game._id}?/delete` }
		]}
	/>
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
