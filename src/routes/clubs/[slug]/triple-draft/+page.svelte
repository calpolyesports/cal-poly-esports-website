<script lang="ts">
	import { onMount } from 'svelte';
	import { buildDraft, SLOTS, type DraftRound } from './draft';
	import type { Hero } from './heroes';

	// The draft is randomised, so it has to be built on the client only. Building
	// it during SSR too would render a different draft on each side, and Svelte
	// hydration would keep the server's portrait `src` next to the client's names.
	let ready = $state(false);
	let rounds = $state<DraftRound[]>([]);
	let roundIndex = $state(0);
	// Keyed by slot rather than by round, because the draft order is randomised
	// while the tray always shows the composition in its usual order.
	let picks = $state<Record<string, Hero | null>>({});

	// The panel is capped to the room below the nav so the draft never scrolls,
	// but it is free to be shorter than that. Its own offset is measured rather
	// than assumed, since the nav wraps to different heights.
	let panel = $state<HTMLElement | null>(null);
	let available = $state(0);

	let complete = $derived(ready && roundIndex >= SLOTS.length);
	let currentRound = $derived(ready && !complete ? rounds[roundIndex] : null);
	// Once the draft is done the last round stays on screen with the pick
	// highlighted, rather than being swapped for a result view. That keeps the
	// panel exactly the same size throughout, with no empty space to fill.
	let shownRound = $derived(currentRound ?? rounds[rounds.length - 1]);

	onMount(() => {
		newDraft();
		ready = true;

		const measure = () => {
			if (!panel) return;
			const offset = panel.getBoundingClientRect().top + window.scrollY;
			available = Math.max(320, window.innerHeight - offset - 16);
		};

		measure();
		const observer = new ResizeObserver(measure);
		const nav = document.querySelector('nav');
		if (nav) observer.observe(nav);
		window.addEventListener('resize', measure);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', measure);
		};
	});

	function choose(hero: Hero) {
		if (!currentRound) return;
		picks[currentRound.slot.id] = hero;
		roundIndex += 1;
	}

	function newDraft() {
		rounds = buildDraft();
		roundIndex = 0;
		picks = Object.fromEntries(SLOTS.map((slot) => [slot.id, null]));
	}
</script>

<section
	class="draft"
	bind:this={panel}
	style={available ? `--draft-height: ${available}px` : undefined}
>
	<header class="bar">
		<div class="title">
			<h1>Triple Draft</h1>
			<p class="eyebrow">{complete ? 'Draft complete' : 'Now drafting'}</p>
		</div>
	</header>

	<div class="stage" aria-live="polite">
		<h2>{shownRound?.slot.label ?? SLOTS[0].label}</h2>

		{#if shownRound}
			{@const taken = complete ? picks[shownRound.slot.id] : null}
			{#key roundIndex}
				<ul class="options">
					{#each shownRound.options as hero (hero.key)}
						<li>
							<button
								type="button"
								class="option"
								class:chosen={taken === hero}
								class:passed={taken !== null && taken !== hero}
								disabled={complete}
								onclick={() => choose(hero)}
							>
								<img src={hero.portrait} alt="" width="256" height="256" />
								<span class="option-name">{hero.name}</span>
							</button>
						</li>
					{/each}
				</ul>
			{/key}
		{:else}
			<ul class="options">
				{#each Array(3) as _, index (index)}
					<li><span class="option option-skeleton" aria-hidden="true"></span></li>
				{/each}
			</ul>
		{/if}
	</div>

	<footer class="tray">
		<ol class="slots">
			{#each SLOTS as slot (slot.id)}
				{@const hero = picks[slot.id] ?? null}
				<li
					class="slot"
					class:filled={hero !== null}
					class:current={currentRound?.slot.id === slot.id}
				>
					{#if hero}
						<img src={hero.portrait} alt="" width="256" height="256" />
					{:else}
						<span class="slot-placeholder" aria-hidden="true"></span>
					{/if}
					<span class="slot-hero" class:empty={!hero}>{hero ? hero.name : '—'}</span>
					<span class="slot-label">{slot.label}</span>
				</li>
			{/each}
		</ol>

		<button type="button" class="reset" onclick={newDraft} disabled={!ready}>
			{complete ? 'New Draft' : 'Restart'}
		</button>
	</footer>
</section>

<style>
	/* Light card on the page, with Cal Poly green and gold used as accents
	   rather than as the field. The panel is capped to the viewport so the draft
	   stays in one screen, but it shrinks to its content rather than stretching,
	   which is what otherwise leaves a band of dead space above and below. */
	section.draft {
		--gap: clamp(0.4rem, 1.2vh, 0.8rem);
		--gold: var(--cal-poly-secondary);
		--line: rgba(21, 71, 52, 0.14);

		width: 100%;
		max-width: 62rem;
		margin: 0 auto;
		max-height: var(--draft-height, calc(100dvh - 12rem));
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		padding: clamp(0.7rem, 1.8vh, 1.15rem) clamp(0.75rem, 2vw, 1.4rem);
		background: var(--surface-white);
		border: 1px solid var(--line);
		border-top: 3px solid var(--cal-poly-primary);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
	}

	/* === Title === */
	header.bar {
		flex: none;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-sm);
		border-bottom: 1px solid var(--line);
		padding-bottom: 0.4rem;
	}

	div.title {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		min-width: 0;
	}

	h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.25rem, 3.2vh, 1.9rem);
		line-height: 1;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--cal-poly-primary);
	}

	p.eyebrow {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(0.55rem, 1.4vh, 0.72rem);
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--cal-poly-secondary-dark);
		white-space: nowrap;
	}

	/* === Current round === */
	div.stage {
		flex: 0 1 auto;
		min-height: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gap);
		text-align: center;
	}

	h2 {
		flex: none;
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 3.6vh, 2.2rem);
		line-height: 1;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-primary);
	}

	ul.options {
		flex: 0 1 auto;
		min-height: 0;
		width: 100%;
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		justify-content: center;
		gap: clamp(0.5rem, 1.6vw, 1.1rem);
		animation: rise var(--transition-base) ease both;
	}

	ul.options li {
		flex: 1 1 0;
		min-width: 0;
		max-width: 15rem;
		display: flex;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(0.4rem);
		}
	}

	button.option,
	span.option-skeleton {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem;
		background: var(--surface-white);
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
	}

	button.option {
		cursor: pointer;
		font-family: var(--font-body);
		transition:
			transform var(--transition-fast),
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	button.option:disabled {
		cursor: default;
	}

	button.option.chosen {
		border-color: var(--gold);
		box-shadow: 0 0 0 2px var(--gold);
	}

	button.option.passed {
		opacity: 0.4;
		filter: grayscale(0.7);
	}

	button.option:not(:disabled):hover,
	button.option:not(:disabled):focus-visible {
		transform: translateY(-3px);
		border-color: var(--gold);
		box-shadow: 0 8px 20px rgba(21, 71, 52, 0.18);
		outline: none;
	}

	/* Square source in a square box, so the headshots are never stretched or
	   cropped. The cap keeps them inside the panel on short screens. */
	button.option img {
		width: 100%;
		height: auto;
		max-width: min(100%, calc(var(--draft-height, 100dvh) - 19rem));
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: var(--radius-sm);
		background: var(--surface-elevated);
	}

	span.option-skeleton {
		aspect-ratio: 4 / 5;
		border-style: dashed;
		background: rgba(21, 71, 52, 0.03);
	}

	span.option-name {
		flex: none;
		font-family: var(--font-display);
		font-size: clamp(0.8rem, 2vh, 1.1rem);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--cal-poly-primary);
		line-height: 1.1;
	}

	/* === Composition tray === */
	footer.tray {
		flex: none;
		display: flex;
		align-items: center;
		gap: clamp(0.5rem, 2vw, 1.1rem);
		padding: var(--gap) clamp(0.5rem, 1.5vw, 0.9rem);
		background: rgba(21, 71, 52, 0.04);
		border: 1px solid var(--line);
		border-radius: var(--radius-sm);
	}

	ol.slots {
		flex: 1 1 auto;
		min-width: 0;
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.4rem;
	}

	li.slot {
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
	}

	li.slot img,
	span.slot-placeholder {
		width: clamp(2.5rem, 8vh, 4.25rem);
		height: clamp(2.5rem, 8vh, 4.25rem);
		border-radius: var(--radius-sm);
		object-fit: cover;
	}

	li.slot.filled img {
		box-shadow: 0 0 0 2px var(--gold);
		animation: rise var(--transition-fast) ease both;
	}

	span.slot-placeholder {
		display: block;
		/* Border-box so an empty slot is exactly the size of a filled one and the
		   tray does not change height as picks come in. */
		box-sizing: border-box;
		border: 1px dashed rgba(21, 71, 52, 0.25);
		background: var(--surface-white);
	}

	li.slot.current span.slot-placeholder {
		border: 1px solid var(--gold);
		background: rgba(189, 139, 19, 0.12);
	}

	li.slot.current span.slot-label {
		color: var(--cal-poly-secondary-dark);
	}

	span.slot-hero,
	span.slot-label {
		max-width: 100%;
		text-align: center;
		line-height: 1.1;
	}

	span.slot-hero {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	span.slot-hero {
		font-size: clamp(0.62rem, 1.6vh, 0.85rem);
		font-weight: 700;
		color: var(--text-primary);
	}

	span.slot-hero.empty {
		color: var(--text-muted);
	}

	span.slot-label {
		font-family: var(--font-display);
		font-size: clamp(0.6rem, 1.5vh, 0.78rem);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	button.reset {
		flex: none;
		font-family: var(--font-display);
		font-size: clamp(0.72rem, 1.6vh, 0.92rem);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--cal-poly-secondary-dark);
		background: transparent;
		border: 1px solid var(--gold);
		border-radius: var(--radius-sm);
		padding: 0.38rem 0.85rem;
		cursor: pointer;
		transition:
			background var(--transition-fast),
			color var(--transition-fast);
	}

	button.reset:hover:not(:disabled) {
		background: var(--gold);
		color: var(--surface-white);
	}

	button.reset:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	@media (prefers-reduced-motion: reduce) {
		ul.options,
		li.slot.filled img {
			animation: none;
		}

		button.option:hover,
		button.option:focus-visible {
			transform: none;
		}
	}

	/* Portrait phones: labels are the first thing to go, and the button drops
	   below the slots so the portraits stay legible. */
	@media (max-width: 30rem) {
		footer.tray {
			flex-direction: column;
			align-items: stretch;
			gap: var(--space-sm);
		}

		/* Wraps to two lines ('Main' / 'Support') so the role stays readable in
		   a narrow column instead of being hidden. */
		span.slot-label {
			letter-spacing: 0.04em;
		}

		/* Hidden rather than removed, so a slot keeps the same height before and
		   after it is filled and the tray does not grow during the draft. */
		span.slot-hero.empty {
			visibility: hidden;
		}

		button.reset {
			width: 100%;
		}
	}
</style>
