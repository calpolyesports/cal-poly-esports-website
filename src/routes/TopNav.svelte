<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Club, WithStringId } from '$lib/types';

	let {
		isAdmin,
		icon,
		clubs
	}: {
		isAdmin: boolean;
		icon: string;
		clubs: WithStringId<Club>[];
	} = $props();

	let currentPath: string = $derived(page.url.pathname || '/');
</script>

<nav>
	<div class="nav-inner">
		<!-- Left: Socials -->
		<div class="nav-socials">
			<span class="follow-label">Follow us on:</span>
			<a href="https://discord.gg/sd6bUz7" aria-label="Discord">
				<img src="/images/social/Discord.png" alt="" />
			</a>
			<a href="https://twitch.tv/CalPolyEsports" aria-label="Twitch">
				<img src="/images/social/Twitch.png" alt="" />
			</a>
			<a href="https://www.youtube.com/@calpolyesports" aria-label="YouTube">
				<svg class="social-icon" viewBox="0 0 461.001 461.001" xmlns="http://www.w3.org/2000/svg">
					<path d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728 c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137 C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607 c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z" fill="#FF0000"/>
				</svg>
			</a>
			<a href="https://x.com/calpolyesports" aria-label="X">
				<img src="/images/social/Twitter.png" alt="" />
			</a>
			<a href="https://www.instagram.com/calpolyesports/" aria-label="Instagram">
				<img src="/images/social/Instagram.png" alt="" />
			</a>
		</div>

		<!-- Center: Logo -->
		<a href={resolve('/')} class="nav-logo">
			<img src={icon} alt="Cal Poly Esports" />
		</a>

		<!-- Right: Page Links -->
		<ul class="nav-links">
			<li><a href={resolve('/')} class:selected={currentPath === '/'}>Home</a></li>
			<li>
				<div class="dropdown">
					<!-- svelte-ignore a11y_invalid_attribute -->
					<a href="javascript:void(0)" class:selected={currentPath.startsWith('/clubs')}>Clubs</a>
					<div class="dropdown-content">
						{#each clubs as club (club._id)}
							<a href={resolve('/clubs/[slug]', { slug: club.urlName })}>{club.clubName}</a>
						{/each}
					</div>
				</div>
			</li>
			<li>
				<a href={resolve('/calendar')} class:selected={currentPath.startsWith('/calendar')}>Calendar</a>
			</li>
			<li><a href={resolve('/teams')} class:selected={currentPath.startsWith('/teams')}>Teams</a></li>
			<li><a href={resolve('/about')} class:selected={currentPath.startsWith('/about')}>About</a></li>
			{#if isAdmin}
				<li>
					<a href={resolve('/admin')} class:selected={currentPath.startsWith('/admin')}>Admin</a>
				</li>
			{/if}
		</ul>
	</div>
</nav>

<style>
	nav {
		width: 100%;
		background-color: var(--cal-poly-primary);
		position: sticky;
		top: 0;
		z-index: 1000;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		overflow: visible;
	}

	.nav-inner {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		grid-template-rows: minmax(0, 1fr);
		align-items: center;
		max-width: var(--content-max-width);
		margin: 0 auto;
		padding: 0 var(--space-lg);
		height: var(--nav-height);
	}

	@media (max-width: 768px) {
		.nav-inner {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			height: auto;
			padding: var(--space-sm) var(--space-md);
			gap: var(--space-sm);
		}
	}

	/* === Left: Socials === */
	.nav-socials {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		justify-self: end;
		padding-right: var(--space-lg);
	}

	.follow-label {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--cal-poly-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		white-space: nowrap;
		margin-right: 0.25rem;
		font-weight: 600;
	}

	.nav-socials a {
		display: flex;
		align-items: center;
		opacity: 0.7;
		transition: opacity var(--transition-fast), transform var(--transition-fast);
	}

	.nav-socials a:hover {
		opacity: 1;
		transform: translateY(-1px);
	}

	.nav-socials img,
	.nav-socials .social-icon {
		height: 1.6rem;
		width: 1.6rem;
		object-fit: contain;
	}

	@media (max-width: 768px) {
		.nav-socials {
			order: 2;
			justify-self: auto;
			justify-content: center;
			width: 100%;
			gap: 0.75rem;
			padding-right: 0;
		}

		.follow-label {
			display: none;
		}

		.nav-socials img,
		.nav-socials .social-icon {
			height: 1.4rem;
			width: 1.4rem;
		}
	}

	/* === Center: Logo === */
	.nav-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.nav-logo img {
		height: 6.5rem;
		filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
		transition: transform var(--transition-fast);
	}

	.nav-logo:hover img {
		transform: scale(1.05);
	}

	@media (max-width: 768px) {
		.nav-logo {
			order: 1;
		}

		.nav-logo img {
			height: 4rem;
		}
	}

	/* === Right: Nav Links === */
	.nav-links {
		display: flex;
		flex-direction: row;
		list-style: none;
		margin: 0;
		padding: 0;
		align-items: stretch;
		align-self: stretch;
		justify-self: start;
		padding-left: var(--space-lg);
	}

	@media (max-width: 768px) {
		.nav-links {
			order: 3;
			flex-wrap: wrap;
			justify-content: center;
			justify-self: auto;
			align-self: auto;
			width: 100%;
			gap: 0.5rem;
			padding-left: 0;
		}
	}

	.nav-links li {
		margin-left: 1.5rem;
		display: flex;
		align-items: stretch;
	}

	.nav-links li:first-child {
		margin-left: 0;
	}

	@media (max-width: 768px) {
		.nav-links li {
			margin-left: 0;
		}
	}

	.nav-links > li > a,
	.dropdown > a {
		font-family: var(--font-display);
		color: var(--text-inverse);
		font-size: 1.1rem;
		letter-spacing: 0.08em;
		text-decoration: none;
		text-transform: uppercase;
		display: flex;
		align-items: center;
		height: 100%;
		transition: opacity var(--transition-fast);
	}

	@media (max-width: 768px) {
		.nav-links > li > a,
		.dropdown > a {
			font-size: 1rem;
			height: auto;
			padding: 0.4rem 0.6rem;
		}
	}

	.nav-links > li > a:hover,
	.dropdown > a:hover {
		opacity: 0.8;
	}

	.nav-links > li > a.selected,
	.dropdown > a.selected {
		position: relative;
		opacity: 1;
	}

	.nav-links > li > a.selected:hover,
	.dropdown > a.selected:hover {
		opacity: 1;
	}

	.nav-links > li > a.selected::after,
	.dropdown > a.selected::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3px;
		border-radius: 2px;
		background-color: var(--cal-poly-secondary);
		width: 100%;
	}

	@media (max-width: 768px) {
		.nav-links > li > a.selected::after,
		.dropdown > a.selected::after {
			bottom: 0;
		}
	}

	/* === Dropdown === */
	.dropdown {
		position: relative;
		display: inline-block;
	}

	.dropdown-content {
		opacity: 0;
		visibility: hidden;
		position: absolute;
		background-color: rgba(255, 255, 255, 0.97);
		backdrop-filter: blur(10px);
		width: 13rem;
		box-shadow: var(--shadow-lg);
		z-index: 1000;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		top: 100%;
		border-top: 3px solid var(--cal-poly-secondary);
		border-radius: 0 0 var(--radius-md) var(--radius-md);
		transform: translateY(-10px);
		transition:
			opacity 300ms ease,
			transform 300ms ease,
			visibility 300ms;
		overflow: hidden;
	}

	@media (max-width: 768px) {
		.dropdown-content {
			left: 50%;
			transform: translateX(-50%);
		}
	}

	.nav-links .dropdown-content a {
		color: var(--text-primary);
		font-family: var(--font-body);
		padding: 0.6rem 1rem;
		text-decoration: none;
		display: block;
		height: auto;
		width: 100%;
		box-sizing: border-box;
		text-align: center;
		font-size: 0.95rem;
		letter-spacing: normal;
		text-transform: none;
		transition: background-color var(--transition-fast), color var(--transition-fast);
	}

	.nav-links .dropdown-content a:hover {
		background-color: var(--cal-poly-secondary);
		color: white;
	}

	.dropdown:hover .dropdown-content {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}
</style>
