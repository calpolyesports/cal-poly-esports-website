<script lang="ts">
    import TeamSelector from "./TeamSelector.svelte";

    export let data;
</script>

<TeamSelector games={data.games} />
