<script lang="ts">
    import TeamSelector from "./TeamSelector.svelte";

    export let data;
</script>

<TeamSelector adminFor={data.adminFor.map((club) => club.urlName)} games={data.games} />
