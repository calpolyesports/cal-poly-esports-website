<script>
    import CollapsibleSection from "$lib/CollapsibleSection.svelte";
    import TeamTable from "./TeamTable.svelte";

    export let data;
</script>

<h2>Teams</h2>

{#each data.teams as team}
    <CollapsibleSection headerText={team.name}>
        <TeamTable members={team.members} />
    </CollapsibleSection>
{/each}
