<script>
    import TopNav from "./TopNav.svelte";

    const topNavItems = [
        { name: "Home", link: "/" },
        { name: "Events", link: "/events" },
        { name: "Teams", link: "/teams" },
        { name: "About", link: "/about" },
        { name: "Contact", link: "/contact" },
    ];
</script>

<svelte:head>
	<link rel="stylesheet" href="/css/style.css" />
    <link rel="stylesheet" href="https://use.typekit.net/yij1veh.css">
</svelte:head>

<div class="everything">
    <header>
        <TopNav items={topNavItems} icon="/images/Main Logo/White Logo.png" />
    </header>
    
    <div class="main-body">
        <div class="container">
            <slot />
        </div>
        
        <div class="footer"></div>
    </div>
</div>

<style>
    div.everything {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    div.main-body {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    div.container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 80%;
        margin: 1rem auto;
    }

    div.footer {
        margin-top: 5rem;
        height: 15rem;
        width: 100%;
        background-color: var(--cal-poly-primary);
    }
</style>
