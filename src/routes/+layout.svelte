<script>
    import TopNav from "./TopNav.svelte";

    const topNavItems = [
        { name: "Home", link: "/" },
        { name: "Calendar", link: "/calendar" },
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
        
        <div class="footer">
            <div class="column">
                <img src="/images/Main Logo/White Logo.png" alt="Cal Poly Esports Logo" />
            </div>
            <div class="column">
                <h3>Contact Us</h3>
                <a href="https://discord.gg/sd6bUz7">Discord</a>
                <a href="https://now.calpoly.edu/organization/esports">Cal Poly NOW</a>
                <a href="mailto:calpolyesports@gmail.com">Email</a>
                <a href="https://x.com/calpolyesports">Twitter</a>
                <a href="https://www.instagram.com/calpolyesports/">Instagram</a>
            </div>
            <div class="column">
                <h3>Quick Links</h3>
                <a href="/calendar">Calendar</a>
                <a href="/teams">Teams</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </div>
        </div>
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
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 5rem;
        width: 100%;
        background-color: var(--cal-poly-primary);
        color: white;
    }

    div.column {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin: 2rem 4rem;
    }

    div.column img {
        height: 10rem;
    }

    div.column h3 {
        font-size: 1.5rem;
        margin: 0.2rem 0;
        color: var(--cal-poly-secondary);
    }

    div.column a {
        color: white;
        text-decoration: none;
        font-size: 1rem;
        margin: 0.2rem 0;
    }
</style>
