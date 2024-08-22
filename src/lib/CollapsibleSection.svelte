<!-- from https://svelte.dev/repl/a5f4d395b15a44d48a6b2239ef705fc4?version=3.35.0 -->

<script>
	// based on suggestions from:
	// Inclusive Components by Heydon Pickering https://inclusive-components.design/collapsible-sections/
	export let headerText;

	let expanded = false;
</script>

<div class="collapsible">
	<h3>
		<button aria-expanded={expanded} on:click={() => (expanded = !expanded)}
			>{headerText}
			<svg viewBox="0 0 20 20" fill="none">
				<path class="vert" d="M10 1V19" stroke="black" stroke-width="2" />
				<path d="M1 10L19 10" stroke="black" stroke-width="2" />
			</svg>
		</button>
	</h3>

	<div class="contents" hidden={!expanded}>
		<slot />
	</div>
</div>

<style>
	.collapsible {
        width: 100%;
        margin: 0.5rem 0;
	}

	h3 {
		margin: 0;
		border-bottom: 1px solid #282828;
	}

	button {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin: 0;
		padding: 1em 0.5em;
		color: var(--gray-darkest, #282828);
        font-size: 1.2rem;
        font-weight: bold;
		border: none;
	}

	button[aria-expanded='true'] {
		border-bottom: 1px solid var(--gray-light, #eee);
	}

	button[aria-expanded='true'] .vert {
		display: none;
	}

	button:focus svg {
		outline: 2px solid;
	}

	svg {
		height: 0.7em;
		width: 0.7em;
	}
</style>
