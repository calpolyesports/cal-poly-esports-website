<svelte:head>
	<link rel="stylesheet" href="/css/style.css" />
</svelte:head>

<header>
    <div class="top-banner">
        <h1>Cal Poly Esports</h1>
    </div>
    <nav>
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
