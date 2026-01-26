<script lang="ts">
	import type { PageProps } from './$types';
	import TeamSelector from './TeamSelector.svelte';

	let { data }: PageProps = $props();
</script>

<TeamSelector adminFor={data.adminFor.map((club) => club.urlName)} games={data.games} />
