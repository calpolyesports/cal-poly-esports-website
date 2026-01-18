<!-- from https://svelte.dev/repl/cf05bd4a4ca14fb8ace8b6cdebbb58da?version=3.17.0 -->

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import type { WithStringId, RosterGame } from '$lib/types';
	import MemberGrid from './MemberGrid.svelte';
	import ModalForm from '$lib/ModalForm.svelte';
	import type { ModalFieldDefinition } from '$lib/ModalForm.svelte';

	let {
		games,
		adminFor
	}: {
		games: WithStringId<RosterGame>[];
		adminFor: string[];
	} = $props();

	let activeGameId = $derived(games.length > 0 ? games[0]._id : '');

	let addTeamModal: ModalForm;

	const teamModalFields = [
		{ name: 'name', type: 'text', required: true }
	] as ModalFieldDefinition[];

	////////////////////
	// SWITCHER STUFF //
	////////////////////

	function moveUnderline(instant: boolean) {
		let element = document.getElementById(activeGameId.toString());
		if (element) {
			let underline = document.querySelector('.underline') as HTMLElement;
			underline.style.width = `${element.clientWidth}px`;
			let bottomPos = element.offsetTop + element.clientHeight;
			underline.style.transform = `translate(${element.offsetLeft}px, ${bottomPos}px)`;
			if (instant) {
				underline.style.transition = 'none';
			} else {
				underline.style.transition = 'width 0.5s, transform 0.5s';
			}
		}
	}

	const handleClick = (tabValue: string) => () => {
		activeGameId = tabValue;
		moveUnderline(false);
	};

	onMount(async () => {
		let content = document.querySelector('.content') as HTMLElement;
		await new Promise<void>((resolve) => {
			setTimeout(() => {
				moveUnderline(true);
				resolve();
			}, 100);
		});
		content.style.visibility = 'visible';

		window.addEventListener('resize', () => moveUnderline(true));
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', () => moveUnderline(true));
		}
	});

	////////////////////
	// EVENT HANDLERS //
	////////////////////

	const onClickAddTeam = () => {
		addTeamModal.clearFields();
		addTeamModal.showModal();
	};
</script>

<div class="content">
	<ul>
		{#each games as game (game._id)}
			<li class={activeGameId === game._id ? 'active' : ''} id={game._id.toString()}>
				<button class="icon" onclick={handleClick(game._id)}>
					<img src={game.icon} alt={game.name} />
				</button>
			</li>
		{/each}
	</ul>

	<div class="underline"></div>

	{#each games as game (game._id)}
		{#if activeGameId == game._id}
			<h1>{game.name}</h1>
			{#if adminFor.includes(game.adminRole)}
				<button class="button-small" onclick={onClickAddTeam}>Add Team</button>
			{/if}
			{#each game.teams as team (team.id)}
				<MemberGrid {game} {team} isAdmin={adminFor.includes(game.adminRole)} />
			{/each}
		{/if}
	{/each}
</div>

<ModalForm
	bind:this={addTeamModal}
	title="Add Team"
	fields={teamModalFields}
	actions={[{ name: 'Submit', action: `/teams/${activeGameId}?/create` }]}
/>

<style>
	.content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		text-transform: uppercase;
		visibility: hidden;
	}

	ul {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		padding-left: 0;
		margin-bottom: 0;
		list-style: none;
		row-gap: 2.5rem;
	}

	button.icon {
		padding: 0.5rem 2rem;
		border: none;
		cursor: pointer;
		background-color: transparent;
	}

	button img {
		height: 3rem;
		transition: 0.3s;
	}

	button img:hover {
		transform: scale(1.1);
	}

	.underline {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 0.2rem;
		background-color: var(--true-neutral);
		transition:
			width 0.5s,
			transform 0.5s;
		margin: 1rem 0;
	}

	h1 {
		font-size: 3rem;
		font-weight: bold;
		margin-top: 3rem;
		margin-bottom: 0;
		text-align: center;
	}
</style>
