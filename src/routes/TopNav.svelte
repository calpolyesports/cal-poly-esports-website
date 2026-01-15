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
				<a href={resolve('/clubs')} class:selected={currentPath.startsWith('/clubs')}>Clubs</a>
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
		height: 4rem;
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
		margin-left: 1rem;
	}

	@media (max-width: 768px) {
		div.icon-container {
			margin: 1rem auto;
		}
	}

	div.icon-container img {
		height: 3rem;
	}

	ul {
		display: flex;
		flex-direction: row;
		list-style: none;
		margin-block-start: 0;
		margin-block-end: 0;
		padding-inline-start: 0;
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
		margin-right: 3rem;
		height: 100%;
	}

	@media (max-width: 768px) {
		ul li {
			margin-right: 0;
		}
	}

	ul li a {
		font-family: 'abolition', sans-serif;
		color: var(--neutral-bright);
		font-size: 2rem;
		text-decoration: none;
		padding-bottom: 20px;
		padding-top: 20px;
		height: auto;
	}

	ul li a.selected {
		position: relative;
	}

	ul li a.selected::after {
		content: '';
		position: absolute;
		left: -10px;
		right: -10px;
		bottom: 5.5px;
		height: 4px;
		background-color: var(--cal-poly-secondary);
		width: calc(100% + 20px);
	}

	@media (max-width: 768px) {
		ul li a.selected::after {
			bottom: 10px;
		}
	}

	.dropdown {
		position: relative;
		display: inline-block;
	}

	.dropdown-content {
		display: none;
		position: absolute;
		background-color: white;
		width: 13rem;
		box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
		z-index: 1000;
		flex-direction: column;
		box-sizing: border-box;
		top: 3.15rem;
		border-left: 8px solid var(--cal-poly-primary);
	}

	@media (max-width: 768px) {
		.dropdown-content {
			/* center dropdown */
			left: 50%;
			transform: translateX(-50%);
		}
	}

	.dropdown-content a {
		color: black;
		padding: 0.5rem;
		text-decoration: none;
		display: block;
		border-top: 1px solid var(--cal-poly-primary);
		border-bottom: 1px solid var(--cal-poly-primary);
		width: 100%;
		box-sizing: border-box;
		text-align: center;
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
		border-color: var(--cal-poly-primary);
	}

	.dropdown:hover .dropdown-content {
		display: flex;
	}
</style>
