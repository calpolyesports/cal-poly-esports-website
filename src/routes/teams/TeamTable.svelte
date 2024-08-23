<script lang="ts">
    import * as models from '$lib/models';

    export let members: models.Member[] = [];
</script>

<table class="team-members">
    {#each members as member}
        <tr>
            <td>{member.username}</td>
            <td>{member.role}</td>
        </tr>
    {/each}
</table>

<style>
    table.team-members {
        width: 80%;
        border-collapse: collapse;
        border-spacing: 0;
        margin: 0 auto;
    }

    table.team-members tr {
        border: solid;
        border-width: 1px 0;
        border-color: var(--neutral-semi-bright);
    }

    table.team-members tr:first-child {
        border-top: 0;
    }

    table.team-members tr:last-child {
        border-bottom: 0;
    }

    table.team-members td {
        padding: 0.5rem;
        text-align: center;
        font-size: 1.2rem;
    }
</style>
