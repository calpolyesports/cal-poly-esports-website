<script>
    import NewsFeed from './NewsFeed.svelte';

    export let data;
</script>

<div>
    <NewsFeed articles={data.articles} />
</div>

<style>
    div {
        margin-top: 3rem;
        width: 100%;
    }
</style>
