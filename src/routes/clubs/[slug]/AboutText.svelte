<script lang="ts">
    export let html: string;
</script>

<div class='about'>{@html html}</div>

<style>
    div.about {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .about > :global(p) {
        font-size: 1.2rem;
        margin: 0.2rem 0;
    }

    .about > :global(h1) {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        text-decoration-line: underline;
        text-decoration-color: var(--cal-poly-secondary);
        text-decoration-thickness: 0.2rem;
        text-underline-offset: 1.5rem;
    }

    .about > :global(h2) {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        text-decoration-line: underline;
        text-decoration-color: var(--cal-poly-secondary);
        text-decoration-thickness: 0.2rem;
        text-underline-offset: 1rem;
    }

    .about > :global(h3) {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        text-decoration-line: underline;
        text-decoration-color: var(--cal-poly-secondary);
        text-decoration-thickness: 0.2rem;
        text-underline-offset: 0.5rem;
    }

    .about > :global(ul), :global(ol) {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0;
        margin: 0;
    }

    .about > :global(ul), :global(ol) > :global(li) {
        font-size: 1.2rem;
    }
</style>
