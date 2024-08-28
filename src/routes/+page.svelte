<script lang="ts">
    import NewsFeed from './NewsFeed.svelte';
    import TwitchEmbed from './TwitchEmbed.svelte';

    import { PUBLIC_PAGE_URL } from '$env/static/public';

    export let data;
</script>

<div class="container">
    <img src="/images/Banner.png" alt="Banner" />
</div>

<div class="container">
    <div class="embeds">
        <div class="livestream">
            <TwitchEmbed channel="CalPoly_Esports" parentUrl={PUBLIC_PAGE_URL} />
        </div>

        <div class="text-box">
            <h1>Lab Information</h1>
            <p>Come check out our new Esports and Gaming Lab, equipped with <strong>six high-end gaming PCs!</strong></p>
            <p>The lab is currently located in <a href="https://maps.calpoly.edu/place/bldg-021-0">Building 21</a>, Room 233. You can find <a href="/calendar">open hours for free usage here.</a></p>
        </div>
    </div>
</div>

<div class="container">
    <NewsFeed articles={data.articles} />
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
    }

    img {
        width: 100%;
    }

    h1 {
        font-size: 3rem;
        font-weight: bold;
        margin: 1rem 2rem;
        color: var(--cal-poly-secondary);
        text-align: center;
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
