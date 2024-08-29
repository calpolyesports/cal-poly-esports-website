<script lang="ts">
    import NewsFeed from './NewsFeed.svelte';
    import TwitchEmbed from './TwitchEmbed.svelte';

    import { PUBLIC_PAGE_URL } from '$env/static/public';

    export let data;
</script>

<div class="container">
    <img class="banner" src="/images/Banner.png" alt="Banner" />
</div>

<div class="container">
    <div class="embeds">
        <div class="livestream">
            <TwitchEmbed channel="CalPoly_Esports" parentUrl={PUBLIC_PAGE_URL} />
        </div>

        <div class="text-box">
            <h1>Lab Information</h1>
            <br>
            <p>Come check out our new Esports and Gaming Lab, equipped with <strong>six high-end gaming PCs!</strong></p>
            <p>The lab is currently located in <a href="https://maps.calpoly.edu/place/bldg-021-0">Building 21</a>, Room 233. You can find <a href="/calendar">open hours for free usage here.</a></p>
        </div>
    </div>
</div>

<h1>Socials</h1>

<div class="links">
    <a class="link" href="https://discord.gg/sd6bUz7">
        <img src="images/social/Discord.png" alt="Discord" />
        <p>Discord</p>
    </a>
    <a class="link" href="https://twitch.tv/CalPoly_Esports">
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

    div.livestream {
        width: 54%;
        height: 100%;
    }
    
    div.text-box {
        width: 44%;
        height: 100%;
        outline: 3px solid var(--cal-poly-primary);
        overflow: hidden; /* Temporary fix; make responsive later */
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
        justify-content: space-around;
        margin: 5rem 0;
        height: 10rem;
    }

    div.games img {
        height: 100%;
    }

    div.links {
        display: flex;
        justify-content: space-around;
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
        height: 10rem;
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
</style>
