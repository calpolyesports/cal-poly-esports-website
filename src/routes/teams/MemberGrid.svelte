<script lang="ts">
    import * as models from '$lib/models';
    import PlayerCard from './PlayerCard.svelte';

    export let members: models.Member[];
</script>

<div class="member-grid">
    {#each members as member}
        <PlayerCard player={member} />
    {/each}
</div>

<style>
    div.member-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
