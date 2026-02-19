<script lang="ts">
	import { type Article } from '$lib/types';

	let { articles }: { articles: Article[] } = $props();

	let currentIndex = $state(0);

	function prev() {
		currentIndex = (currentIndex - 1 + articles.length) % articles.length;
	}

	function next() {
		currentIndex = (currentIndex + 1) % articles.length;
	}

	function getArticle(offset: number): Article | undefined {
		if (articles.length === 0) return undefined;
		const idx = (currentIndex + offset + articles.length) % articles.length;
		return articles[idx];
	}

	let leftArticle = $derived(articles.length > 1 ? getArticle(-1) : undefined);
	let centerArticle = $derived(getArticle(0));
	let rightArticle = $derived(articles.length > 2 ? getArticle(1) : undefined);
</script>

{#if articles.length > 0}
	<div class="carousel">
		{#if articles.length > 1}
			<button class="arrow arrow-left" onclick={prev} aria-label="Previous article">
				&#8249;
			</button>
		{/if}

		<div class="carousel-track">
			{#if leftArticle}
				<a rel="external" href={leftArticle.link} class="card card-side">
					<img src={leftArticle.image} alt={leftArticle.title} />
					<div class="card-shadow"></div>
					<div class="card-text">
						<h3>{leftArticle.title}</h3>
					</div>
				</a>
			{/if}

			{#if centerArticle}
				<a rel="external" href={centerArticle.link} class="card card-center">
					<img src={centerArticle.image} alt={centerArticle.title} />
					<div class="card-shadow"></div>
					<div class="card-text">
						<h2>{centerArticle.title}</h2>
						<p>{centerArticle.summary}</p>
					</div>
				</a>
			{/if}

			{#if rightArticle}
				<a rel="external" href={rightArticle.link} class="card card-side">
					<img src={rightArticle.image} alt={rightArticle.title} />
					<div class="card-shadow"></div>
					<div class="card-text">
						<h3>{rightArticle.title}</h3>
					</div>
				</a>
			{/if}
		</div>

		{#if articles.length > 1}
			<button class="arrow arrow-right" onclick={next} aria-label="Next article">
				&#8250;
			</button>
		{/if}
	</div>
{/if}

<style>
	.carousel {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 0 3rem;
		box-sizing: border-box;
	}

	/* === Arrow buttons === */
	.arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 10;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(4px);
		border: none;
		border-radius: 50%;
		width: 2.8rem;
		height: 2.8rem;
		font-size: 1.8rem;
		line-height: 1;
		color: var(--cal-poly-primary);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-md);
		transition: background-color var(--transition-fast), transform var(--transition-fast);
	}

	.arrow:hover {
		background: white;
		transform: translateY(-50%) scale(1.1);
	}

	.arrow-left {
		left: 0;
	}

	.arrow-right {
		right: 0;
	}

	/* === Carousel track === */
	.carousel-track {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		width: 100%;
		height: 18rem;
	}

	@media (max-width: 768px) {
		.carousel-track {
			height: 14rem;
		}

		.carousel {
			padding: 0 2.5rem;
		}
	}

	/* === Cards base === */
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		text-decoration: none;
		color: white;
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: inset 0 0 0 3px var(--cal-poly-primary);
		transition: transform var(--transition-base), box-shadow var(--transition-base);
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: inset 0 0 0 3px var(--cal-poly-primary), var(--shadow-lg);
	}

	/* === Center card (prominent) === */
	.card-center {
		flex: 1;
		height: 100%;
		z-index: 2;
	}

	/* === Side cards (smaller, desaturated) === */
	.card-side {
		flex: 1;
		height: 100%;
		transform: scale(0.8);
		filter: saturate(0.35) brightness(0.8);
		transition: filter var(--transition-base), transform var(--transition-base), box-shadow var(--transition-base);
	}

	.card-side:hover {
		filter: saturate(0.7) brightness(0.9);
		transform: scale(0.82);
	}

	@media (max-width: 768px) {
		.card-side {
			display: none;
		}

		.card-center {
			flex: 1;
		}
	}

	/* === Card image === */
	.card img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
	}

	/* === Card shadow overlay === */
	.card-shadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 50%);
		z-index: 1;
	}

	/* === Card text === */
	.card-text {
		position: relative;
		z-index: 2;
		padding: 1.25rem;
	}

	.card-center .card-text h2 {
		font-family: var(--font-display);
		font-size: 2rem;
		margin: 0 0 0.3rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.card-center .card-text p {
		font-size: 1rem;
		margin: 0;
		opacity: 0.85;
		line-height: 1.4;
	}

	.card-side .card-text h3 {
		font-family: var(--font-display);
		font-size: 1.2rem;
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	@media (max-width: 768px) {
		.card-center .card-text h2 {
			font-size: 1.4rem;
		}

		.card-center .card-text p {
			font-size: 0.85rem;
		}
	}
</style>
