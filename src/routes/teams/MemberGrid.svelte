<script lang="ts">
    import * as types from '$lib/types';
    import PlayerCard from './PlayerCard.svelte';

    export let members: types.RosterMember[];
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
