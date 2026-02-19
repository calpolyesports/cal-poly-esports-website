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
	<div class="icon-container">
		<a href={resolve('/')}><img src={icon} alt="icon" /></a>
	</div>
	<ul>
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
			<a href={resolve('/calendar')} class:selected={currentPath.startsWith('/calendar')}
				>Calendar</a
			>
		</li>
		<li><a href={resolve('/teams')} class:selected={currentPath.startsWith('/teams')}>Teams</a></li>
		<li><a href={resolve('/about')} class:selected={currentPath.startsWith('/about')}>About</a></li>
		{#if isAdmin}
			<li>
				<a href={resolve('/admin')} class:selected={currentPath.startsWith('/admin')}>Admin</a>
			</li>
		{/if}
	</ul>
</nav>

<style>
	nav {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--cal-poly-primary);
		height: var(--nav-height);
		position: sticky;
		top: 0;
		z-index: 1000;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	@media (max-width: 768px) {
		nav {
			height: auto;
			flex-direction: column;
		}
	}

	div.icon-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		margin-right: auto;
		margin-left: 1.5rem;
	}

	@media (max-width: 768px) {
		div.icon-container {
			margin: 1rem auto;
		}
	}

	div.icon-container img {
		height: 3.5rem;
	}

	ul {
		display: flex;
		flex-direction: row;
		list-style: none;
		margin-block-start: 0;
		margin-block-end: 0;
		padding-inline-start: 0;
		align-items: center;
	}

	@media (max-width: 768px) {
		ul {
			flex-direction: column;
			align-items: center;
			gap: 1rem;
			padding-bottom: 1rem;
		}
	}

	ul li {
		margin-right: 2.5rem;
		height: 100%;
		display: flex;
		align-items: center;
	}

	@media (max-width: 768px) {
		ul li {
			margin-right: 0;
		}
	}

	ul li a {
		font-family: var(--font-display);
		color: var(--text-inverse);
		font-size: 1.4rem;
		letter-spacing: 0.08em;
		text-decoration: none;
		padding-bottom: 14px;
		padding-top: 14px;
		height: auto;
		transition: opacity var(--transition-fast);
	}

	ul li a:hover {
		opacity: 0.8;
	}

	ul li a.selected {
		position: relative;
		opacity: 1;
	}

	ul li a.selected:hover {
		opacity: 1;
	}

	ul li a.selected::after {
		content: '';
		position: absolute;
		left: -8px;
		right: -8px;
		bottom: 0;
		height: 3px;
		border-radius: 2px;
		background-color: var(--cal-poly-secondary);
		width: calc(100% + 16px);
	}

	@media (max-width: 768px) {
		ul li a.selected::after {
			bottom: 4px;
		}
	}

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
		flex-direction: column;
		box-sizing: border-box;
		top: 2.8rem;
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

	.dropdown-content a {
		color: var(--text-primary);
		padding: 0.6rem 1rem;
		text-decoration: none;
		display: block;
		width: 100%;
		box-sizing: border-box;
		text-align: center;
		font-size: 1rem;
		transition: background-color var(--transition-fast), color var(--transition-fast);
	}

	.dropdown-content a:first-child {
		border-top: none;
	}

	.dropdown-content a:last-child {
		border-bottom: none;
	}

	.dropdown-content a:hover {
		background-color: var(--cal-poly-secondary);
		color: white;
	}

	.dropdown:hover .dropdown-content {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}
</style>
