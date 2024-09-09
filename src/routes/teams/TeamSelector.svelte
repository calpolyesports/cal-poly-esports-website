<!-- from https://svelte.dev/repl/cf05bd4a4ca14fb8ace8b6cdebbb58da?version=3.17.0 -->

<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	import * as types from "$lib/types";
	import MemberGrid from "./MemberGrid.svelte";

	export let games: types.RosterGame[] = [];
	let activeGameId = games.length > 0 ? games[0]._id : '';

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
</script>

<div class="content">
	<ul>
		{#each games as game}
			<li class={activeGameId === game._id ? 'active' : ''} id="{game._id.toString()}">
				<button on:click={handleClick(game._id)}>
					<img src={game.icon} alt={game.name} />
				</button>
			</li>
		{/each}
	</ul>
	
	<div class="underline"></div>
	
	{#each games as game}
		{#if activeGameId == game._id}
			<h1>{game.name}</h1>
			{#each game.teams as team}
				<h2>{team.name}</h2>
				<div class="box">
					<MemberGrid members={team.members} />
				</div>
			{/each}
		{/if}
	{/each}
</div>

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

	div.box {
		margin: 1rem 0;
		width: 100%;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		padding-left: 0;
		margin-bottom: 0;
		list-style: none;
	}

	button {
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

	h2 {
		font-size: 2rem;
		font-weight: bold;
		margin-top: 2rem;
	}
</style>
