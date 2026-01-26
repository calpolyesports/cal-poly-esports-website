<script lang="ts">
	import EventCalendar from '$lib/EventCalendar.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>Calendar</h1>

<EventCalendar events={data.events} clubs={data.clubs} adminFor={data.adminFor} />

<style>
	h1 {
		font-size: 3rem;
		font-weight: bold;
		margin-top: 1rem;
		text-align: center;
		text-decoration-line: underline;
		text-decoration-color: var(--cal-poly-secondary);
		text-decoration-thickness: 0.2rem;
		text-underline-offset: 2rem;
	}
</style>
