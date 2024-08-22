<svelte:head>
	<link rel="stylesheet" href="/css/style.css" />
</svelte:head>

<header>
    <div class="top-banner">
        <h1>Cal Poly Esports</h1>
    </div>
    <nav class="main-navbar">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/teams">Teams</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </nav>
</header>

<div class="container">
    <slot />
</div>

<style>
    div.container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 60%;
        margin: 1rem auto;
    }

    div.top-banner {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 15rem;
        background-color: var(--cal-poly-primary);
        color: var(--neutral-bright);
    }
    
    div.top-banner h1 {
        font-size: 6em;
        margin: 0;
    }
    
    nav.main-navbar {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 4rem;
        background-color: var(--cal-poly-secondary);
    }
    
    nav.main-navbar ul {
        display: flex;
        flex-direction: row;
        list-style: none;
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
    }
    
    nav.main-navbar ul li {
        margin: 0 1.5rem;
    }
    
    nav.main-navbar ul li a {
        color: var(--neutral-bright);
        font-size: 2rem;
        text-decoration: none;
        transition: 0.3s;
    }
    
    nav.main-navbar ul li a:hover {
        color: var(--neutral-semi-bright);
    }
</style>
