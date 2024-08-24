<script lang="ts">
    import NewsFeed from './NewsFeed.svelte';
    import TwitchEmbed from './TwitchEmbed.svelte';
    import TwitterEmbed from './TwitterEmbed.svelte';

    export let data;
</script>

<div class="container">
    <img src="/images/Banner.png" alt="Banner" />
</div>

<div class="container">
    <div class="embeds">
        <div class="livestream">
            <TwitchEmbed channel="CalPoly_Esports" />
        </div>

        <div class="twitter">
            <TwitterEmbed channel="calpolyesports" refSrc="twsrc%5Etfw"/>
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

    div.twitter {
        width: 44%;
        height: 100%;
    }

    img {
        width: 100%;
    }
</style>
