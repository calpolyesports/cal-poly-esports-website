<script lang="ts">
	import NewsFeed from './NewsFeed.svelte';
	import TwitchEmbed from './TwitchEmbed.svelte';

	import { PUBLIC_PAGE_URL } from '$env/static/public';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const featuredGames = [
		{ name: 'Valorant', image: '/images/games/Valorant.png', slug: 'valorant' },
		{ name: 'League of Legends', image: '/images/games/LOL.png', slug: 'league-of-legends' },
		{ name: 'Overwatch', image: '/images/games/Overwatch.png', slug: 'overwatch' },
		{ name: 'Counter-Strike 2', image: '/images/games/CS2.jpg', slug: 'counter-strike' },
		{ name: 'Smash Bros', image: '/images/games/Smash.png', slug: 'smash' },
		{ name: 'Team Fortress 2', image: '/images/games/TF2.png', slug: 'team-fortress-2' },
		{ name: 'Rocket League', image: '/images/games/Rocket League.png', slug: 'rocket-league' },
		{ name: 'Marvel Rivals', image: '/images/games/Marvel Rivals.jpeg', slug: 'marvel-rivals' }
	];
</script>

<!-- Section 1: Hero -->
<section class="hero full-width">
	<div class="hero-overlay"></div>
	<div class="hero-content">
		<h1 class="hero-title">Cal Poly Esports</h1>
		<p class="hero-tagline">Cal Poly SLO's largest gaming community</p>
		<div class="hero-games">
			{#each featuredGames as game (game.name)}
				<a href="/clubs/{game.slug}" class="hero-game-link">
					<img class="hero-game-icon" src={game.image} alt={game.name} />
				</a>
			{/each}
		</div>
		<div class="hero-cta">
			<a href="https://discord.gg/sd6bUz7" class="btn-primary">Join Our Discord</a>
			<a href="/about" class="btn-secondary">Learn More</a>
		</div>
	</div>
</section>

<!-- Section 2: Latest News -->
<section class="news-section full-width section-white">
	<div class="section-inner">
		<h2 class="section-heading">Latest News</h2>
		<NewsFeed articles={data.articles} />
	</div>
</section>

<!-- Section 3: Our Games + Stream -->
<section class="games-section full-width section-green">
	<div class="section-inner">
		<h2 class="section-heading section-heading-light">Our Clubs</h2>
		<div class="games-layout">
			<div class="games-grid">
				{#each featuredGames as game (game.name)}
					<a href="/clubs/{game.slug}" class="game-card">
						<img src={game.image} alt={game.name} />
						<span class="game-name">{game.name}</span>
					</a>
				{/each}
			</div>

			<div class="sidebar">
				<div class="stream-card">
					<div class="card-header">
						<span class="live-dot"></span>
						<h3>Live Stream</h3>
					</div>
					<div class="stream-embed">
						<TwitchEmbed channel="CalPolyEsports" parentUrl={PUBLIC_PAGE_URL} />
					</div>
				</div>

				<div class="info-card">
					<h3>Lab Information</h3>
					<p>
						Our Esports and Gaming Lab is currently <strong>being relocated</strong> and is
						unavailable for public access at this time.
					</p>
					<p>
						For any questions, please reach out to a board member in our Discord.
					</p>
					<a href="https://discord.gg/sd6bUz7" class="btn-primary">Join Discord for Updates</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Section 4: Sister Schools -->
<section class="sister-section full-width section-light">
	<div class="section-inner">
		<h2 class="section-heading">Sister Schools Esports Programs</h2>
		<div class="sister-grid">
			<a href="https://mybar.cpp.edu/organization/esports" class="sister-card">
				<span class="school-name">Cal Poly Pomona</span>
				<span class="school-arrow">&#8594;</span>
			</a>
			<a href="https://www.humboldt.edu/campus-recreation/recreational-sports/clubs/e-sports" class="sister-card">
				<span class="school-name">Cal Poly Humboldt</span>
				<span class="school-arrow">&#8594;</span>
			</a>
		</div>
	</div>
</section>

<style>
	/* === Full-width breakout from layout container === */
	.full-width {
		width: 125%;
	}

	@media (max-width: 768px) {
		.full-width {
			width: 111.111%;
		}
	}

	.section-inner {
		max-width: var(--content-max-width);
		margin: 0 auto;
		padding: 0 var(--space-lg);
	}

	/* === Section backgrounds === */
	.section-white {
		background-color: var(--surface-white);
	}

	.section-light {
		background-color: var(--surface-light);
	}

	.section-green {
		background-color: var(--cal-poly-primary);
		color: var(--text-inverse);
	}

	/* === Section Headings === */
	.section-heading {
		font-family: var(--font-display);
		font-size: var(--font-size-2xl);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-align: center;
		position: relative;
		padding-bottom: 0.75rem;
		margin: 0 0 var(--space-xl);
		color: var(--text-primary);
	}

	.section-heading::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		height: 3px;
		background: var(--cal-poly-secondary);
	}

	.section-heading-light {
		color: var(--text-inverse);
	}

	/* ============================================
	   SECTION 1: HERO
	   ============================================ */
	.hero {
		min-height: 50vh;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		background-color: var(--cal-poly-primary);
		margin-top: -1rem;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at center, rgba(26, 92, 68, 0.4) 0%, rgba(13, 47, 35, 0.95) 70%);
	}

	.hero-content {
		position: relative;
		z-index: 1;
		text-align: center;
		padding: var(--space-2xl) var(--space-lg);
		animation: fadeInUp 0.6s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.hero-title {
		font-family: var(--font-display);
		font-size: var(--font-size-hero);
		color: var(--text-inverse);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 var(--space-xs);
		text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: var(--font-size-3xl);
		}
	}

	.hero-tagline {
		font-family: var(--font-body);
		font-size: var(--font-size-lg);
		color: var(--text-inverse);
		opacity: 0.85;
		font-weight: 300;
		margin: 0 0 var(--space-xl);
	}

	@media (max-width: 768px) {
		.hero-tagline {
			font-size: var(--font-size-md);
		}
	}

	.hero-games {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-lg);
		margin-bottom: var(--space-xl);
		flex-wrap: wrap;
	}

	.hero-game-icon {
		height: 3rem;
		width: 3rem;
		object-fit: contain;
		opacity: 0.7;
		transition: opacity var(--transition-base), transform var(--transition-base);
	}

	.hero-game-icon:hover {
		opacity: 1;
		transform: scale(1.15);
	}

	@media (max-width: 768px) {
		.hero-game-icon {
			height: 2rem;
			width: 2rem;
		}

		.hero-games {
			gap: var(--space-md);
		}
	}

	.hero-cta {
		display: flex;
		gap: var(--space-md);
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-primary {
		font-family: var(--font-display);
		font-size: var(--font-size-md);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-decoration: none;
		background-color: var(--cal-poly-secondary);
		color: var(--text-inverse);
		padding: 0.75rem 2rem;
		border-radius: var(--radius-md);
		transition: background-color var(--transition-fast), transform var(--transition-fast);
	}

	.btn-primary:hover {
		background-color: var(--cal-poly-secondary-dark);
		transform: translateY(-2px);
	}

	.btn-secondary {
		font-family: var(--font-display);
		font-size: var(--font-size-md);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-decoration: none;
		background-color: transparent;
		color: var(--text-inverse);
		padding: 0.75rem 2rem;
		border: 2px solid rgba(255, 255, 255, 0.6);
		border-radius: var(--radius-md);
		transition: border-color var(--transition-fast), transform var(--transition-fast), background-color var(--transition-fast);
	}

	.btn-secondary:hover {
		border-color: var(--text-inverse);
		background-color: rgba(255, 255, 255, 0.1);
		transform: translateY(-2px);
	}

	/* ============================================
	   SECTION 2: NEWS
	   ============================================ */
	.news-section {
		padding: var(--space-2xl) 0;
	}

	/* ============================================
	   SECTION 3: GAMES + STREAM
	   ============================================ */
	.games-section {
		padding: var(--space-2xl) 0;
	}

	.games-layout {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: var(--space-xl);
		align-items: start;
	}

	@media (max-width: 768px) {
		.games-layout {
			grid-template-columns: 1fr;
		}
	}

	.games-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
	}

	@media (max-width: 768px) {
		.games-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--space-md);
		}
	}

	.game-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		text-decoration: none;
		padding: var(--space-lg);
		border-radius: var(--radius-md);
		background: rgba(255, 255, 255, 0.06);
		transition: transform var(--transition-base), background-color var(--transition-base);
	}

	.game-card:hover {
		transform: translateY(-4px);
		background: rgba(255, 255, 255, 0.12);
	}

	.game-card img {
		height: 4.5rem;
		width: 4.5rem;
		object-fit: contain;
		margin-bottom: var(--space-sm);
		transition: transform var(--transition-base);
	}

	.game-card:hover img {
		transform: scale(1.1);
	}

	@media (max-width: 768px) {
		.game-card {
			padding: var(--space-md);
		}

		.game-card img {
			height: 3rem;
			width: 3rem;
		}
	}

	.game-name {
		font-family: var(--font-body);
		font-size: var(--font-size-sm);
		color: var(--text-inverse);
		opacity: 0.9;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Sidebar: Stream + Lab Info */
	.sidebar {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.stream-card {
		background: var(--surface-base);
		border-radius: var(--radius-lg);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md);
	}

	.card-header h3 {
		font-family: var(--font-display);
		font-size: var(--font-size-base);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-inverse);
		margin: 0;
	}

	.live-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #ef4444;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	.stream-embed {
		flex: 1;
		min-height: 220px;
	}

	.info-card {
		background: rgba(255, 255, 255, 0.08);
		border-radius: var(--radius-lg);
		border-top: 4px solid var(--cal-poly-secondary);
		padding: var(--space-lg);
	}

	.info-card h3 {
		font-family: var(--font-display);
		font-size: var(--font-size-lg);
		text-transform: uppercase;
		letter-spacing: 0.03em;
		margin: 0 0 var(--space-sm);
		color: var(--text-inverse);
	}

	.info-card p {
		font-size: var(--font-size-sm);
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.75);
		margin: 0 0 var(--space-sm);
	}

	.info-card strong {
		color: var(--cal-poly-secondary);
	}

	.info-card .btn-primary {
		display: inline-block;
		width: fit-content;
		margin-top: var(--space-sm);
		font-size: var(--font-size-sm);
	}

	/* === Hero game link === */
	.hero-game-link {
		display: flex;
		align-items: center;
		text-decoration: none;
	}

	/* ============================================
	   SECTION 4: SISTER SCHOOLS
	   ============================================ */
	.sister-section {
		padding: var(--space-2xl) 0;
	}

	.sister-grid {
		display: flex;
		justify-content: center;
		gap: var(--space-lg);
		flex-wrap: wrap;
	}

	.sister-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--surface-white);
		padding: var(--space-lg) var(--space-xl);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-sm);
		text-decoration: none;
		color: var(--text-primary);
		border-left: 4px solid var(--cal-poly-primary);
		min-width: 250px;
		gap: var(--space-lg);
		transition: box-shadow var(--transition-base), border-color var(--transition-base), transform var(--transition-base);
	}

	.sister-card:hover {
		box-shadow: var(--shadow-md);
		border-left-color: var(--cal-poly-secondary);
		transform: translateY(-2px);
	}

	.school-name {
		font-family: var(--font-display);
		font-size: var(--font-size-lg);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.school-arrow {
		font-size: var(--font-size-xl);
		color: var(--text-muted);
		transition: color var(--transition-fast);
	}

	.sister-card:hover .school-arrow {
		color: var(--cal-poly-secondary);
	}
</style>
