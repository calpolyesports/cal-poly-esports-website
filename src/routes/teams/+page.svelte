<script>
    import CollapsibleSection from "$lib/CollapsibleSection.svelte";
    import TeamTable from "./TeamTable.svelte";

    export let data;
</script>

<h1>Teams</h1>

{#each data.teams as team}
    <CollapsibleSection headerText={team.name}>
        <TeamTable members={team.members} />
    </CollapsibleSection>
{/each}

<style>
    h1 {
        font-size: 3rem;
        font-weight: bold;
        margin: 1rem 0;
    }
</style>
