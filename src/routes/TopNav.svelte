<script>
    export let items;
    export let icon;
</script>

<nav>
    <div class="icon-container">
        <a href="/"><img src="{icon}" alt="icon" /></a>
    </div>
    <ul>
        {#each items as item}
            <li>
                <a href="{item.link}">{item.name}</a>
            </li>
        {/each}
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

    div.icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin-right: auto;
        margin-left: 1rem;
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

    ul li {
        margin-right: 3rem;
    }

    ul li a {
        font-family: 'abolition', sans-serif;
        color: var(--neutral-bright);
        font-size: 2rem;
        text-decoration: none;
    }
</style>
