<script lang="ts">
	import NewsFeed from './NewsFeed.svelte';
	import TwitchEmbed from './TwitchEmbed.svelte';

	import { PUBLIC_PAGE_URL } from '$env/static/public';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="container">
	<img class="banner" src="/images/Banner.png" alt="Banner" />
</div>

<div class="container">
	<div class="embeds">
		<div class="livestream">
			<TwitchEmbed channel="CalPolyEsports" parentUrl={PUBLIC_PAGE_URL} />
		</div>

		<div class="text-box">
			<h1>Lab Information</h1>
			<br />
			<p>
				Our Esports and Gaming Lab is currently <strong>being relocated</strong> and is
				unavailable for public access at this time.
			</p>
			<p>
				For any questions, please reach out to a board member in our
				<a href="https://discord.gg/sd6bUz7">Discord</a>.
			</p>
		</div>
	</div>
</div>

<h1>Socials</h1>

<div class="links">
	<a class="link" href="https://discord.gg/sd6bUz7">
		<img src="images/social/Discord.png" alt="Discord" />
		<p>Discord</p>
	</a>
	<a class="link" href="https://twitch.tv/CalPolyEsports">
		<img src="images/social/Twitch.png" alt="Twitch" />
		<p>Twitch</p>
	</a>
	<a class="link" href="https://x.com/calpolyesports">
		<img src="images/social/Twitter.png" alt="Twitter" />
		<p>Twitter</p>
	</a>
	<a class="link" href="https://www.instagram.com/calpolyesports/">
		<img src="images/social/Instagram.png" alt="Instagram" />
		<p>Instagram</p>
	</a>
</div>

<div class="container">
	<NewsFeed articles={data.articles} />
</div>

<h1>Featured Games</h1>

<div class="games">
	<img src="/images/games/Valorant.png" alt="Valorant" />
	<img src="/images/games/LOL.png" alt="League of Legends" />
	<img src="/images/games/Overwatch 2.png" alt="Overwatch 2" />
	<img src="/images/games/CS2.jpg" alt="Counter Strike 2" />
	<img src="/images/games/Smash.png" alt="Smash" />
	<img src="/images/games/TF2.png" alt="Team Fortress 2" />
</div>

<h1>Sister Schools</h1>

<div class="sister-schools">
	<p>Check out esports at other Cal Poly campuses:</p>
	<div class="school-links">
		<a class="school-link" href="https://mybar.cpp.edu/organization/esports">Cal Poly Pomona</a>
		<a class="school-link" href="https://www.humboldt.edu/campus-recreation/recreational-sports/clubs/e-sports">Cal Poly Humboldt</a>
	</div>
</div>

<style>
	div.container {
		margin-top: 2rem;
		width: 100%;
	}

	div.embeds {
		display: flex;
		justify-content: space-between;
		height: 25rem;
	}

	@media (max-width: 768px) {
		div.embeds {
			flex-direction: column;
			height: auto;
			width: 100%;
		}
	}

	div.livestream {
		width: 54%;
		height: 100%;
	}

	@media (max-width: 768px) {
		div.livestream {
			width: 100%;
			height: 50%;
		}
	}

	div.text-box {
		width: 44%;
		height: 100%;
		outline: 3px solid var(--cal-poly-primary);
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		div.text-box {
			width: 100%;
			height: 50%;
		}
	}

	div.text-box h1 {
		font-size: 3rem;
		margin: 1rem 0;
	}

	div.text-box p {
		font-size: 1.6rem;
		margin: 0.5rem 3rem;
	}

	div.games {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		margin: 5rem 0;
		height: 10vw;
	}

	div.games img {
		height: 100%;
	}

	div.links {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		row-gap: 2rem;
		width: 100%;
		margin: 4rem 0;
	}

	a.link {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;
		font-family: 'abolition', sans-serif;
	}

	a.link img {
		height: 12vw;
		transition: transform 0.2s;
	}

	a.link img:hover {
		cursor: pointer;
		transform: scale(1.1);
	}

	a.link p {
		font-size: 2.5rem;
		margin-top: 1rem;
	}

	@media (max-width: 768px) {
		a.link img {
			height: 15vw;
		}

		a.link p {
			font-size: 1.8rem;
		}
	}

	img.banner {
		width: 100%;
	}

	h1 {
		font-size: 5rem;
		font-weight: bold;
		margin: 0 2rem;
		margin-top: 4rem;
		color: black;
		text-align: center;
		text-decoration-line: underline;
		text-decoration-color: var(--cal-poly-secondary);
		text-decoration-thickness: 0.2rem;
		text-underline-offset: 2rem;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 3rem;
			text-underline-offset: 1rem;
		}
	}

	p {
		font-size: 1.5rem;
		margin: 0.5rem 2rem;
	}

	a {
		color: black;
	}

	strong {
		color: var(--cal-poly-secondary);
	}

	div.sister-schools {
		text-align: center;
		margin: 4rem 0;
	}

	div.sister-schools p {
		font-size: 1.6rem;
		margin-bottom: 2rem;
	}

	div.school-links {
		display: flex;
		justify-content: center;
		gap: 3rem;
		flex-wrap: wrap;
	}

	a.school-link {
		font-family: 'abolition', sans-serif;
		font-size: 2rem;
		color: white;
		background-color: var(--cal-poly-primary);
		padding: 1rem 2.5rem;
		text-decoration: none;
		transition: transform 0.2s;
	}

	a.school-link:hover {
		transform: scale(1.05);
	}
</style>
