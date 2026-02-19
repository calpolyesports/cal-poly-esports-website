<script lang="ts">
	import NewsFeed from './NewsFeed.svelte';
	import TwitchEmbed from './TwitchEmbed.svelte';

	import { PUBLIC_PAGE_URL } from '$env/static/public';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const featuredGames = [
		{ name: 'Valorant', image: '/images/games/Valorant.png' },
		{ name: 'League of Legends', image: '/images/games/LOL.png' },
		{ name: 'Overwatch 2', image: '/images/games/Overwatch 2.png' },
		{ name: 'Counter-Strike 2', image: '/images/games/CS2.jpg' },
		{ name: 'Smash Bros', image: '/images/games/Smash.png' },
		{ name: 'Team Fortress 2', image: '/images/games/TF2.png' }
	];
</script>

<!-- Section 1: Hero -->
<section class="hero full-width">
	<div class="hero-overlay"></div>
	<div class="hero-content">
		<img class="hero-logo" src="/images/Main Logo/White Logo.png" alt="Cal Poly Esports" />
		<h1 class="hero-title">Cal Poly Esports</h1>
		<p class="hero-tagline">Cal Poly SLO's largest gaming community</p>
		<div class="hero-games">
			{#each featuredGames as game (game.name)}
				<img class="hero-game-icon" src={game.image} alt={game.name} />
			{/each}
		</div>
		<div class="hero-cta">
			<a href="https://discord.gg/sd6bUz7" class="btn-primary">Join Our Discord</a>
			<a href="/about" class="btn-secondary">Learn More</a>
		</div>
	</div>
</section>

<!-- Section 2: Stream + Lab Info -->
<section class="content-section full-width section-white">
	<div class="section-inner">
		<div class="content-grid">
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
</section>

<!-- Section 3: News Feed -->
<section class="news-section full-width section-light">
	<div class="section-inner">
		<h2 class="section-heading">Latest News</h2>
		<NewsFeed articles={data.articles} />
	</div>
</section>

<!-- Section 4: Games & Socials (combined) -->
<section class="games-section full-width section-green">
	<div class="section-inner">
		<h2 class="section-heading section-heading-light">Our Competitive Games</h2>
		<div class="games-grid">
			{#each featuredGames as game (game.name)}
				<a href="/teams" class="game-card">
					<img src={game.image} alt={game.name} />
					<span class="game-name">{game.name}</span>
				</a>
			{/each}
		</div>

		<div class="section-divider"></div>

		<h3 class="socials-subheading">Connect With Us</h3>
		<div class="social-links">
			<a href="https://discord.gg/sd6bUz7" class="social-link" aria-label="Discord">
				<img src="/images/social/Discord.png" alt="" />
				<span>Discord</span>
			</a>
			<a href="https://twitch.tv/CalPolyEsports" class="social-link" aria-label="Twitch">
				<img src="/images/social/Twitch.png" alt="" />
				<span>Twitch</span>
			</a>
			<a href="https://www.youtube.com/@calpolyesports" class="social-link" aria-label="YouTube">
				<svg class="youtube-icon" viewBox="0 0 461.001 461.001" xmlns="http://www.w3.org/2000/svg">
					<path d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728 c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137 C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607 c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z" fill="#FF0000"/>
				</svg>
				<span>YouTube</span>
			</a>
			<a href="https://x.com/calpolyesports" class="social-link" aria-label="Twitter/X">
				<img src="/images/social/Twitter.png" alt="" />
				<span>Twitter</span>
			</a>
			<a href="https://www.instagram.com/calpolyesports/" class="social-link" aria-label="Instagram">
				<img src="/images/social/Instagram.png" alt="" />
				<span>Instagram</span>
			</a>
		</div>
	</div>
</section>

<!-- Section 6: Sister Schools -->
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
	/* Container is 80% wide (90% on mobile) with align-items: center,
	   so a wider child overflows equally on both sides, spanning 100% of main-body */
	.full-width {
		width: 125%; /* 100% / 80% — breaks out of 80% container to full parent width */
	}

	@media (max-width: 768px) {
		.full-width {
			width: 111.111%; /* 100% / 90% — breaks out of 90% container */
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
		min-height: 70vh;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		background-color: var(--cal-poly-primary);
		margin-top: -1rem; /* Cancel container's top margin so hero sits flush with nav */
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

	.hero-logo {
		height: 8rem;
		margin-bottom: var(--space-md);
		filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.4));
	}

	@media (max-width: 768px) {
		.hero-logo {
			height: 5rem;
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
	   SECTION 2: STREAM + LAB INFO
	   ============================================ */
	.content-section {
		padding: var(--space-2xl) 0;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: var(--space-lg);
		align-items: stretch;
	}

	@media (max-width: 768px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
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
		padding: var(--space-md) var(--space-md);
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
		min-height: 300px;
	}

	.info-card {
		background: var(--surface-white);
		border-radius: var(--radius-lg);
		border-top: 4px solid var(--cal-poly-primary);
		padding: var(--space-xl);
		box-shadow: var(--shadow-sm);
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.info-card h3 {
		font-family: var(--font-display);
		font-size: var(--font-size-xl);
		text-transform: uppercase;
		letter-spacing: 0.03em;
		margin: 0 0 var(--space-md);
		color: var(--text-primary);
	}

	.info-card p {
		font-size: var(--font-size-base);
		line-height: 1.7;
		color: var(--text-secondary);
		margin: 0 0 var(--space-md);
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

	/* ============================================
	   SECTION 3: NEWS
	   ============================================ */
	.news-section {
		padding: var(--space-2xl) 0;
	}

	/* ============================================
	   SOCIALS (within games section)
	   ============================================ */
	.section-divider {
		width: 60px;
		height: 1px;
		background: rgba(255, 255, 255, 0.25);
		margin: var(--space-xl) auto;
	}

	.socials-subheading {
		font-family: var(--font-display);
		font-size: var(--font-size-lg);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		text-align: center;
		color: var(--text-inverse);
		opacity: 0.9;
		margin: 0 0 var(--space-lg);
	}

	.social-links {
		display: flex;
		justify-content: center;
		gap: var(--space-xl);
		flex-wrap: wrap;
	}

	.social-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;
		color: var(--text-inverse);
		transition: transform var(--transition-base);
	}

	.social-link:hover {
		transform: translateY(-4px);
	}

	.social-link img,
	.social-link .youtube-icon {
		height: 3rem;
		width: 3rem;
		object-fit: contain;
		margin-bottom: var(--space-sm);
		transition: filter var(--transition-base);
	}

	.social-link:hover img,
	.social-link:hover .youtube-icon {
		filter: brightness(1.2);
	}

	.social-link span {
		font-family: var(--font-body);
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		opacity: 0.8;
	}

	/* ============================================
	   SECTION 5: FEATURED GAMES
	   ============================================ */
	.games-section {
		padding: var(--space-2xl) 0;
	}

	.games-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: var(--space-lg);
		max-width: var(--content-max-width);
		margin: 0 auto;
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
		transition: transform var(--transition-base);
	}

	.game-card:hover {
		transform: translateY(-4px);
	}

	.game-card img {
		height: 5rem;
		width: 5rem;
		object-fit: contain;
		margin-bottom: var(--space-sm);
		transition: transform var(--transition-base);
	}

	.game-card:hover img {
		transform: scale(1.1);
	}

	.game-name {
		font-family: var(--font-body);
		font-size: var(--font-size-sm);
		color: var(--text-inverse);
		opacity: 0.9;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* ============================================
	   SECTION 6: SISTER SCHOOLS
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
