<script>
    import NewsFeed from './NewsFeed.svelte';

    export let data;
</script>

<div>
    <img src="/images/Banner.png" alt="Banner" />
</div>

<div>
    <NewsFeed articles={data.articles} />
</div>

<style>
    div {
        margin-top: 2rem;
        width: 100%;
    }

    img {
        width: 100%;
    }
</style>
