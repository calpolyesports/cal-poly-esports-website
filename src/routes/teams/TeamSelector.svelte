<!-- from https://svelte.dev/repl/cf05bd4a4ca14fb8ace8b6cdebbb58da?version=3.17.0 -->

<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	import * as types from "$lib/types";
	import MemberGrid from "./MemberGrid.svelte";
	import ModalForm from '$lib/ModalForm.svelte';
    import type { ModalFieldDefinition, FilledModalFields } from '$lib/ModalForm.svelte';

	interface ModalTeam {
		name: string;
	}

	export let games: types.RosterGame[] = [];
	let activeGameId = games.length > 0 ? games[0]._id : '';

	let addTeamModal: ModalForm;
	let addTeamModalVisible = false;

	const teamModalFields = [
		{ name: 'name', type: 'text' },
	] as ModalFieldDefinition[];

	////////////////////
	// SWITCHER STUFF //
	////////////////////

	function moveUnderline(instant: boolean) {
		let element = document.getElementById(activeGameId.toString());
		if (element) {
			let underline = document.querySelector(".underline") as HTMLElement;
			underline.style.width = `${element.clientWidth}px`;
			let bottomPos = element.offsetTop + element.clientHeight;
			underline.style.transform = `translate(${element.offsetLeft}px, ${bottomPos}px)`;
			if (instant) {
				underline.style.transition = "none";
			} else {
				underline.style.transition = "width 0.5s, transform 0.5s";
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

	//////////////////////
	// API INTERACTIONS //
	//////////////////////

	const sendAddTeam = async (newTeam: ModalTeam): Promise<types.RosterTeam | undefined> => {
		const response = await fetch(`/teams/${activeGameId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newTeam),
		});

		if (response.ok) {
			const data = await response.json();
			return data.team;
		}

		return undefined;
	};

	////////////////////
	// EVENT HANDLERS //
	////////////////////

	const onClickAddTeam = () => {
		addTeamModal.clearFields();
		addTeamModalVisible = true;
	};

	const onSubmitAddTeam = async (values: FilledModalFields) => {
		const newTeam = {
			name: values.name as string,
		};
		const team = await sendAddTeam(newTeam);
		if (team) {
			games = games.map(game => {
				if (game._id === activeGameId) {
					game.teams.push(team);
				}
				return game;
			});
		}
		addTeamModalVisible = false;
	};

	const onTeamRemove = (teamId: string) => {
		games = games.map(game => {
			if (game._id === activeGameId) {
				game.teams = game.teams.filter(team => team._id !== teamId);
			}
			return game;
		});
	};
</script>

<div class="content">
	<ul>
		{#each games as game}
			<li class={activeGameId === game._id ? 'active' : ''} id="{game._id.toString()}">
				<button class="icon" on:click={handleClick(game._id)}>
					<img src={game.icon} alt={game.name} />
				</button>
			</li>
		{/each}
	</ul>
	
	<div class="underline"></div>
	
	{#each games as game}
		{#if activeGameId == game._id}
			<h1>{game.name}</h1>
			<button on:click={onClickAddTeam}>Add Team</button>
			{#each game.teams as team}
				<MemberGrid game={game} team={team} onRemove={onTeamRemove} />
			{/each}
		{/if}
	{/each}
</div>

<ModalForm
	bind:this={addTeamModal}
	bind:show={addTeamModalVisible}
	title="Add Team"
	fields={teamModalFields}
	actions={[
		{ name: 'Submit', callback: onSubmitAddTeam },
	]} />

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
		flex-wrap: wrap;
		padding-left: 0;
		margin-bottom: 0;
		list-style: none;
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
		transition: width 0.5s, transform 0.5s;
		margin: 1rem 0;
	}

	h1 {
		font-size: 3rem;
		font-weight: bold;
		margin-top: 3rem;
		margin-bottom: 0;
	}
</style>
