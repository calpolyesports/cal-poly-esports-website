<script lang="ts">
	import TopNav from './TopNav.svelte';
	import { page } from '$app/state';
	import type { PageData } from './$types.js';
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	let head = {
		title: 'Cal Poly Esports',
		description: 'Welcome to Cal Poly Esports, the largest gaming community at Cal Poly SLO!',
		image: '/favicon.png'
	};

	let { data, children }: { data: PageData; children: Snippet } = $props();

	$effect(() => {
		// TODO: Check to make sure this works (it does not lol)
		head.title = page.data.subtitle
			? `${page.data.subtitle} - Cal Poly Esports`
			: 'Cal Poly Esports';
	});

	let displayClubs = $derived(data.clubs.filter((club) => club.display));
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
	<meta name="description" content={head.description} />

	<title>{head.title}</title>

	<meta property="og:type" content="website" />
	<meta property="og:title" content={head.title} />
	<meta property="og:description" content={head.description} />
	<meta property="og:image" content={head.image} />

	<link rel="stylesheet" href="/css/style.css" />
	<link rel="stylesheet" href="https://use.typekit.net/yij1veh.css" />
</svelte:head>

<div class="everything">
	<header>
		<TopNav
			isAdmin={data.username !== undefined}
			icon="/images/Main Logo/White Logo Filled.png"
			clubs={displayClubs}
		/>
	</header>

	<div class="main-body">
		<div class="container">
			{@render children()}
		</div>

		<footer class="footer">
			<div class="footer-main">
				<div class="column">
					<img src="/images/Main Logo/White Logo.png" alt="Cal Poly Esports Logo" />
				</div>
				<div class="column">
					<h3>Contact Us</h3>
					<a href="https://discord.gg/sd6bUz7">Discord</a>
					<a href="https://now.calpoly.edu/organization/esports">Cal Poly NOW</a>
					<a href="mailto:calpolyesports@gmail.com">Email</a>
					<a href="https://x.com/calpolyesports">Twitter</a>
					<a href="https://www.instagram.com/calpolyesports/">Instagram</a>
				</div>
				<div class="column">
					<h3>Quick Links</h3>
					<a href={resolve('/calendar')}>Calendar</a>
					<a href={resolve('/teams')}>Teams</a>
					<a href={resolve('/about')}>About</a>
					<a href={resolve('/login')}>Admin Login</a>
				</div>
				<div class="column clubs-column">
					<h3>Clubs</h3>
					<div class="clubs-grid">
						{#each displayClubs as club (club._id)}
							<a href={resolve('/clubs/[slug]', { slug: club.urlName })}>{club.clubName}</a>
						{/each}
					</div>
				</div>
			</div>
			<div class="footer-bottom">
				<p>&copy; {new Date().getFullYear()} Cal Poly Esports &mdash; San Luis Obispo, CA</p>
			</div>
		</footer>
	</div>
</div>

<style>
	div.everything {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	@media (max-width: 768px) {
		div.everything {
			position: relative;
		}
	}

	header {
		position: relative;
		z-index: 100;
		overflow: visible;
	}

	div.main-body {
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		overflow-y: scroll;
	}

	@media (max-width: 768px) {
		div.main-body {
			height: auto;
		}
	}

	div.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 80%;
		margin: 1rem auto;
	}

	@media (max-width: 768px) {
		div.container {
			width: 90%;
		}
	}

	.footer {
		margin-top: var(--space-2xl);
		width: 100%;
		background-color: var(--cal-poly-primary);
		color: var(--text-inverse);
		border-top: 3px solid var(--cal-poly-secondary);
	}

	.footer-main {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: var(--space-xl) var(--space-lg);
		max-width: var(--content-max-width);
		margin: 0 auto;
	}

	div.column {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		margin: var(--space-lg) var(--space-xl);
	}

	div.column img {
		height: 6rem;
	}

	div.column h3 {
		font-family: var(--font-display);
		font-size: 1.3rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		margin: 0 0 var(--space-sm);
		color: var(--cal-poly-secondary);
	}

	div.column a {
		color: var(--text-inverse);
		text-decoration: none;
		font-size: var(--font-size-sm);
		margin: 0.3rem 0;
		transition: color var(--transition-fast);
	}

	div.column a:hover {
		color: var(--cal-poly-secondary);
	}

	div.column.clubs-column {
		align-items: flex-start;
		text-align: left;
	}

	.clubs-grid {
		columns: 2;
		column-gap: var(--space-xl);
	}

	.clubs-grid a {
		display: block;
		break-inside: avoid;
	}

	.footer-bottom {
		max-width: var(--content-max-width);
		margin: 0 auto;
		text-align: center;
		padding: var(--space-md) 0;
		border-top: 1px solid rgba(255, 255, 255, 0.15);
	}

	.footer-bottom p {
		font-size: var(--font-size-sm);
		opacity: 0.6;
		margin: 0;
	}
</style>
