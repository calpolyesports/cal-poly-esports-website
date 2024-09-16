<script lang="ts">
    import { page } from '$app/stores';
    import { type Club } from "$lib/types";

    export let items;
    export let adminItem;
    export let isAdmin;
    export let icon;
    export let clubs: Club[];

    let currentPath: string;
    $: $page.url.pathname && (currentPath = $page.url.pathname);
</script>

<nav>
    <div class="icon-container">
        <a href="/"><img src={icon} alt="icon" /></a>
    </div>
    <ul>
        {#each items as item}
            <li>
                {#if item.name === "Clubs"}
                    <div class="dropdown">
                        <a href={item.link} class:selected={currentPath.startsWith('/clubs')}>{item.name}</a>
                        <div class="dropdown-content">
                            {#each clubs as club}
                                <a href={`/clubs/${club.urlName}`}>{club.clubName}</a>
                            {/each}
                        </div>
                    </div>
                {:else}
                    <a href={item.link} class:selected={currentPath === item.link}>{item.name}</a>
                {/if}
            </li>
        {/each}
        {#if isAdmin}
            <li>
                <a href={adminItem.link} class:selected={currentPath === adminItem.link}>{adminItem.name}</a>
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
        height: 100%;
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

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: white;
        width: 200px;
        box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1;
        flex-direction: column;
        box-sizing: border-box;
        top: 50.5px;
        border-left: 8px solid var(--cal-poly-primary);
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
