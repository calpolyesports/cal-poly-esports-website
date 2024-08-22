<script>
    import CollapsibleSection from "$lib/CollapsibleSection.svelte";

    export let data;
</script>

<h2>Teams</h2>

{#each data.teams as team}
    <CollapsibleSection headerText={team.name}>
        <table class="team-members">
            {#each team.members as member}
                <tr>
                    <td>{member.username}</td>
                    <td>{member.role}</td>
                </tr>
            {/each}
        </table>
    </CollapsibleSection>
{/each}
