<script>
    export let data;
</script>

<h2>News Feed</h2>

{#each data.blogs as item}
    <div>
        <h3>{item.title}</h3>
        <p>{item.content}</p>
    </div>
{/each}
