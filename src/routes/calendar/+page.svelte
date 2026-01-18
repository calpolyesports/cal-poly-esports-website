<script lang="ts">
	import EventCalendar from '$lib/EventCalendar.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>Calendar</h1>

<EventCalendar events={data.events} clubs={data.clubs} adminFor={data.adminFor} />
