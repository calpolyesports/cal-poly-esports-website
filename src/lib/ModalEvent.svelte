<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import type { Event, Club } from '$lib/types';
	import { resolve } from '$app/paths';

	let {
		selectedEvent,
		selectedEventClub
	}: { selectedEvent: Event; selectedEventClub?: Club | null } = $props();

	let displayModal: Modal;
	export const showModal = async () => {
		displayModal.showModal();
	};

	function formatDate(date: Date = new Date()): string {
		return date.toLocaleString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});
	}
</script>

<Modal bind:this={displayModal} title={selectedEvent.title}>
	{#if selectedEvent.description}
		<p class="description">{selectedEvent.description}</p>
	{/if}
	<div class="event-info">
		{#if selectedEvent.location}
			<p class="label">Location</p>
			{#if selectedEvent.locationLink}
				<p>
					<em
						><a rel="external" href={selectedEvent.locationLink} target="_blank"
							>{selectedEvent.location}</a
						></em
					>
				</p>
			{:else}
				<p><em>{selectedEvent.location}</em></p>
			{/if}
		{/if}
		{#if selectedEventClub}
			<p class="label">Club</p>
			<p>
				<em
					><a href={resolve('/clubs/[slug]', { slug: selectedEventClub.urlName })}
						>{selectedEventClub.clubName ?? 'unknown'}</a
					></em
				>
			</p>
		{/if}
		<p class="label">Start Time</p>
		<p><em>{formatDate(selectedEvent.start)}</em></p>
		<p class="label">End Time</p>
		<p><em>{formatDate(selectedEvent.end)}</em></p>
	</div>
</Modal>

<style>
	p {
		font-size: 1.25rem;
		margin: 0;
	}

	.label {
		font-weight: bold;
		font-size: 0.95rem;
		text-transform: uppercase;
		margin-top: 1rem;
	}

	.description {
		white-space: pre-line;
	}

	.event-info {
		margin-top: 1rem;
	}

	a {
		color: var(--cal-poly-secondary);
	}
</style>
