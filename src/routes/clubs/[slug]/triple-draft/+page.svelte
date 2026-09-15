<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { awardLeftover, buildDraft, SLOTS, type DraftRound } from './draft';
	import type { Hero } from './heroes';

	interface RoundResult {
		picker: number;
		picked: Hero;
		given: Hero;
		discarded: Hero;
	}

	const TEAM_COUNT = 2;

	// The draft is randomised, so it has to be built on the client only. Building
	// it during SSR too would render a different draft on each side, and Svelte
	// hydration would keep the server's portrait `src` next to the client's names.
	let ready = $state(false);
	let rounds = $state<DraftRound[]>([]);
	let roundIndex = $state(0);
	let firstPicker = $state(0);
	let teamNames = $state(['Team 1', 'Team 2']);
	let picks = $state<(Hero | null)[][]>([
		Array(SLOTS.length).fill(null),
		Array(SLOTS.length).fill(null)
	]);
	let lastResult = $state<RoundResult | null>(null);

	let complete = $derived(ready && roundIndex >= SLOTS.length);
	let currentRound = $derived(ready && !complete ? rounds[roundIndex] : null);
	let pickingTeam = $derived((firstPicker + roundIndex) % TEAM_COUNT);

	onMount(() => {
		newDraft();
		ready = true;
	});

	const teamName = (team: number) => teamNames[team] || `Team ${team + 1}`;

	function choose(hero: Hero) {
		if (!currentRound) return;

		const picker = pickingTeam;
		const { given, discarded } = awardLeftover(currentRound.options, hero);

		picks[picker][roundIndex] = hero;
		picks[(picker + 1) % TEAM_COUNT][roundIndex] = given;
		lastResult = { picker, picked: hero, given, discarded };
		roundIndex += 1;
	}

	function newDraft() {
		rounds = buildDraft();
		roundIndex = 0;
		firstPicker = Math.floor(Math.random() * TEAM_COUNT);
		picks = [Array(SLOTS.length).fill(null), Array(SLOTS.length).fill(null)];
		lastResult = null;
	}
</script>

<div class="header">
	<div class="opacity">
		<h1>Triple Draft</h1>
		<p class="tagline">Overwatch 2 &mdash; pick one of three, your opponent gets another</p>
	</div>
</div>

<div class="draft">
	<div class="stage" aria-live="polite">
		{#if !ready}
			<div class="stage-heading">
				<span class="round-counter">Round 1 of {SLOTS.length}</span>
				<h2>Tank</h2>
				<p class="on-the-clock">Shuffling the hero pools&hellip;</p>
			</div>

			<ul class="options">
				{#each Array(3) as _, index (index)}
					<li><span class="option option-skeleton" aria-hidden="true"></span></li>
				{/each}
			</ul>
		{:else if currentRound}
			<div class="stage-heading">
				<span class="round-counter">Round {roundIndex + 1} of {SLOTS.length}</span>
				<h2>{currentRound.slot.label}</h2>
				<p class="on-the-clock">
					<strong>{teamName(pickingTeam)}</strong> is on the clock
				</p>
			</div>

			{#key roundIndex}
				<ul class="options">
					{#each currentRound.options as hero (hero.key)}
						<li>
							<button type="button" class="option" onclick={() => choose(hero)}>
								<img src={hero.portrait} alt="" width="256" height="256" />
								<span class="option-name">{hero.name}</span>
								<span class="tag tag-{hero.archetype}">{hero.archetype}</span>
							</button>
						</li>
					{/each}
				</ul>
			{/key}
		{:else}
			<div class="stage-heading">
				<span class="round-counter">Draft complete</span>
				<h2>Lock It In</h2>
				<p class="on-the-clock">Both teams have a full composition.</p>
			</div>
		{/if}

		{#if lastResult}
			<p class="last-result">
				<b>{teamName(lastResult.picker)}</b> took <b>{lastResult.picked.name}</b>, so
				<b>{teamName((lastResult.picker + 1) % TEAM_COUNT)}</b> received
				<b>{lastResult.given.name}</b>. {lastResult.discarded.name} was discarded.
			</p>
		{/if}

		<button type="button" class="button-medium reset" onclick={newDraft} disabled={!ready}>
			{complete ? 'New Draft' : 'Restart Draft'}
		</button>
	</div>

	<div class="boards">
		{#each picks as teamPicks, team (team)}
			<section class="board" class:active={ready && !complete && pickingTeam === team}>
				<div class="board-header">
					<input
						class="team-name"
						bind:value={teamNames[team]}
						aria-label="Team {team + 1} name"
						maxlength="24"
					/>
					{#if ready && !complete && pickingTeam === team}
						<span class="turn-pill">Picking</span>
					{/if}
				</div>

				<ol class="slots">
					{#each SLOTS as slot, index (slot.id)}
						{@const hero = teamPicks[index]}
						<li class="slot" class:filled={hero !== null}>
							{#if hero}
								<img src={hero.portrait} alt="" width="256" height="256" />
								<span class="slot-hero">{hero.name}</span>
							{:else}
								<span class="slot-placeholder" aria-hidden="true"></span>
								<span class="slot-hero empty">&mdash;</span>
							{/if}
							<span class="slot-label">{slot.label}</span>
						</li>
					{/each}
				</ol>
			</section>
		{/each}
	</div>

	<p class="back">
		<a href={resolve('/clubs/[slug]', { slug: page.params.slug ?? '' })}>&larr; Back to the club</a>
	</p>
</div>

<style>
	div.header {
		width: 100%;
		height: 20rem;
		margin: 3rem 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			135deg,
			var(--cal-poly-primary-dark),
			var(--cal-poly-primary-light)
		);
	}

	div.opacity {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.25);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		text-align: center;
		color: white;
		font-family: var(--font-display);
		font-size: 8rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		margin: 0;
		line-height: 1;
		text-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.8);
	}

	p.tagline {
		margin: var(--space-md) 0 0;
		color: rgba(255, 255, 255, 0.85);
		font-size: var(--font-size-md);
		text-align: center;
		padding: 0 var(--space-md);
	}

	div.draft {
		max-width: var(--content-max-width);
		margin: 0 auto var(--space-2xl);
		padding: 0 var(--space-md);
	}

	/* === Current round === */
	div.stage {
		background: var(--surface-white);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		padding: var(--space-lg) var(--space-md);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	div.stage-heading {
		text-align: center;
	}

	span.round-counter {
		font-family: var(--font-display);
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--cal-poly-secondary-dark);
		font-size: var(--font-size-sm);
	}

	h2 {
		font-family: var(--font-display);
		font-size: var(--font-size-3xl);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: var(--space-xs) 0 var(--space-sm);
		line-height: 1;
	}

	p.on-the-clock {
		margin: 0 0 var(--space-lg);
		color: var(--text-secondary);
		font-size: var(--font-size-md);
	}

	p.on-the-clock strong {
		color: var(--cal-poly-primary);
	}

	ul.options {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-md);
		animation: deal var(--transition-slow) ease both;
	}

	@keyframes deal {
		from {
			opacity: 0;
			transform: translateY(0.75rem);
		}
	}

	button.option {
		width: 12rem;
		background: var(--surface-white);
		border: 2px solid rgba(0, 0, 0, 0.08);
		border-radius: var(--radius-md);
		padding: var(--space-sm);
		cursor: pointer;
		font-family: var(--font-body);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		transition:
			transform var(--transition-fast),
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	span.option-skeleton {
		display: block;
		width: 12rem;
		aspect-ratio: 3 / 4;
		background: rgba(0, 0, 0, 0.03);
		border: 2px dashed rgba(0, 0, 0, 0.1);
		border-radius: var(--radius-md);
	}

	button.option:hover,
	button.option:focus-visible {
		transform: translateY(-4px);
		border-color: var(--cal-poly-secondary);
		box-shadow: var(--shadow-lg);
	}

	button.option img {
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: var(--radius-sm);
		background: var(--surface-elevated);
	}

	span.option-name {
		font-weight: 700;
		font-size: var(--font-size-md);
		color: var(--text-primary);
		text-align: center;
		line-height: 1.2;
	}

	/* Archetype colors mirror the tier list the pools were transcribed from. */
	span.tag {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 700;
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
		color: var(--text-primary);
	}

	span.tag-dive,
	span.tag-main {
		background: #9ecbff;
	}

	span.tag-hybrid {
		background: #93e9a0;
	}

	span.tag-brawl,
	span.tag-flex {
		background: #ffa0a0;
	}

	p.last-result {
		margin: var(--space-lg) 0 0;
		text-align: center;
		color: var(--text-secondary);
		font-size: var(--font-size-base);
		max-width: 40rem;
	}

	button.reset {
		margin-top: var(--space-lg);
	}

	/* === Team boards === */
	div.boards {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-lg);
		margin-top: var(--space-lg);
	}

	section.board {
		background: var(--surface-white);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		border: 2px solid transparent;
		padding: var(--space-md);
		transition: border-color var(--transition-base);
	}

	section.board.active {
		border-color: var(--cal-poly-secondary);
	}

	div.board-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	input.team-name {
		flex: 1;
		min-width: 0;
		font-family: var(--font-display);
		font-size: var(--font-size-lg);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--cal-poly-primary);
		background: transparent;
		border: none;
		border-bottom: 2px dashed rgba(0, 0, 0, 0.15);
		padding: 0.15rem 0;
	}

	input.team-name:focus {
		outline: none;
		border-bottom-color: var(--cal-poly-secondary);
	}

	span.turn-pill {
		flex-shrink: 0;
		background: var(--cal-poly-secondary);
		color: var(--neutral-bright);
		font-family: var(--font-display);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 0.7rem;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
	}

	ol.slots {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: var(--space-sm);
	}

	li.slot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		min-width: 0;
	}

	li.slot img,
	span.slot-placeholder {
		width: 100%;
		/* `height: auto` is required so the img's height attribute does not win over aspect-ratio. */
		height: auto;
		aspect-ratio: 1;
		border-radius: var(--radius-sm);
		object-fit: cover;
	}

	span.slot-placeholder {
		display: block;
		border: 2px dashed rgba(0, 0, 0, 0.15);
		background: rgba(0, 0, 0, 0.02);
	}

	li.slot.filled img {
		animation: deal var(--transition-base) ease both;
	}

	span.slot-hero {
		font-size: var(--font-size-sm);
		font-weight: 700;
		text-align: center;
		line-height: 1.15;
		color: var(--text-primary);
		overflow-wrap: break-word;
	}

	span.slot-hero.empty {
		color: var(--text-muted);
	}

	span.slot-label {
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		text-align: center;
		line-height: 1.15;
	}

	p.back {
		text-align: center;
		margin-top: var(--space-lg);
	}

	p.back a {
		color: var(--cal-poly-primary);
	}

	@media (prefers-reduced-motion: reduce) {
		ul.options,
		li.slot.filled img {
			animation: none;
		}
	}

	@media (max-width: 900px) {
		div.boards {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (max-width: 768px) {
		div.header {
			height: 12rem;
			margin: var(--space-lg) 0;
		}

		h1 {
			font-size: 4rem;
		}

		p.tagline {
			font-size: var(--font-size-base);
		}

		h2 {
			font-size: 2.25rem;
		}

		/* Keep all three options on one row so the triple still reads as a triple. */
		ul.options {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			width: 100%;
			gap: var(--space-sm);
		}

		button.option,
		span.option-skeleton {
			width: 100%;
		}

		span.option-name {
			font-size: var(--font-size-base);
		}

		span.tag {
			font-size: 0.6rem;
			letter-spacing: 0.05em;
		}

		/* Five portraits across a phone leaves very narrow cells, so shrink the
		   captions rather than letting long names break mid-word. */
		span.slot-hero {
			font-size: 0.7rem;
		}

		span.slot-label {
			font-size: 0.55rem;
		}
	}
</style>
