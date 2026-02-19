<script lang="ts">
	export let html: string;

	// TODO: Verify that this field is sanitized.
	/* eslint svelte/no-at-html-tags: "off" */
</script>

<div class="about">{@html html}</div>

<style>
	div.about {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 2rem;
	}

	.about :global(p) {
		font-size: 1.2rem;
		margin: 0.2rem 0;
		text-align: center;
	}

	.about :global(h1) {
		font-family: var(--font-display);
		font-size: var(--font-size-2xl);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: var(--space-lg) 0 var(--space-md);
		text-align: center;
		position: relative;
		padding-bottom: 0.75rem;
	}

	.about :global(h1)::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		height: 3px;
		background: var(--cal-poly-secondary);
	}

	.about :global(h2) {
		font-family: var(--font-display);
		font-size: var(--font-size-xl);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: var(--space-lg) 0 var(--space-md);
		text-align: center;
		position: relative;
		padding-bottom: 0.75rem;
	}

	.about :global(h2)::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40px;
		height: 3px;
		background: var(--cal-poly-secondary);
	}

	.about :global(h3) {
		font-family: var(--font-display);
		font-size: var(--font-size-lg);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: var(--space-lg) 0 var(--space-md);
		text-align: center;
		position: relative;
		padding-bottom: 0.75rem;
	}

	.about :global(h3)::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 30px;
		height: 3px;
		background: var(--cal-poly-secondary);
	}

	.about :global(ul),
	:global(ol) {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0;
		margin: 0;
	}

	.about :global(ul),
	:global(ol) > :global(li) {
		font-size: 1.2rem;
	}

	.about :global(a) {
		color: var(--cal-poly-secondary);
	}
</style>
