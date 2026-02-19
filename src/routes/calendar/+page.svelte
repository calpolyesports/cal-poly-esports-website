<script lang="ts">
	import EventCalendar from '$lib/EventCalendar.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>Calendar</h1>

<EventCalendar events={data.events} clubs={data.clubs} adminFor={data.adminFor} />

<style>
	h1 {
		font-family: var(--font-display);
		font-size: var(--font-size-2xl);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: bold;
		margin-top: 1rem;
		text-align: center;
		position: relative;
		padding-bottom: 0.75rem;
		margin-bottom: var(--space-lg);
	}

	h1::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		height: 3px;
		background: var(--cal-poly-secondary);
	}
</style>
