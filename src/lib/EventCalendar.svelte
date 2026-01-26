<script lang="ts">
	import { Calendar, DayGrid, TimeGrid, List, Interaction } from '@event-calendar/core';
	import type { WithStringId, Event, Club } from '$lib/types.js';
	import Modal from '$lib/Modal.svelte';
	import ModalForm from '$lib/ModalForm.svelte';
	import type { ModalFieldDefinition } from '$lib/ModalForm.svelte';
	import { slide } from 'svelte/transition';
	import { SvelteDate } from 'svelte/reactivity';
	import { resolve } from '$app/paths';
	import ToggleButton from './ToggleButton.svelte';

	let {
		events,
		clubs,
		adminFor
	}: {
		events: WithStringId<Event>[];
		clubs: WithStringId<Club>[];
		adminFor: WithStringId<Club>[];
	} = $props();

	let editable = $derived(adminFor.length > 0);

	const clubOptions: [string, string][] = $derived(
		adminFor.map((club) => [club.urlName, club.clubName])
	);

	let showLabEvents = $state(true);
	let showPublicEvents = $state(true);
	let visibleClubs = $derived(clubs.map((club) => club.urlName));
	let showFilters = $state(false);

	let addModal: ModalForm;
	let editModal: ModalForm;
	let displayModal: Modal | undefined = $state(undefined);
	let selectedEvent = $state(undefined) as WithStringId<Event> | undefined;
	let selectedEventClub = $derived(
		selectedEvent ? clubs.find((club) => club.urlName === selectedEvent!.club) : undefined
	);

	const modalFields = $derived([
		{ id: 'title', name: 'Title', type: 'text', required: true },
		{ id: 'start', name: 'Start', type: 'date', required: true },
		{ id: 'end', name: 'End', type: 'date', required: true },
		{
			id: 'club',
			name: 'Club',
			type: 'dropdown',
			options: adminFor.map((club) => [club.urlName, club.clubName]),
			required: true
		},
		{ id: 'location', name: 'Location', type: 'text', required: true },
		{ id: 'locationLink', name: 'Location Link', type: 'text' },
		{ id: 'description', name: 'Description', type: 'text' },
		{ id: 'showPublic', name: 'Show Publicly', type: 'checkbox' },
		{ id: 'usesLab', name: 'Uses Lab', type: 'checkbox' }
	]) as ModalFieldDefinition[];

	//////////////////////
	// CALENDAR HELPERS //
	//////////////////////

	const hasPermissions = (event: Event) => {
		return adminFor.some((club) => club.urlName === event.club);
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

	const convertToCalendarEvent = (event: WithStringId<Event>): Calendar.EventInput => {
		return {
			id: event._id,
			title: event.title,
			start: event.start,
			end: event.end,
			backgroundColor: event.backgroundColor,
			editable: event.editable,
			durationEditable: event.editable,
			startEditable: event.editable
		};
	};

	async function updateEventTimes(id: string, start: Date, end: Date): Promise<boolean> {
		const response = await fetch('/calendar', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, start, end })
		});
		return response.ok;
	}

	//////////////////////
	// CALENDAR OPTIONS //
	//////////////////////

	let plugins = [DayGrid, TimeGrid, List, Interaction] as Calendar.Plugin[];
	let options = $derived({
		view: 'timeGridWeek',
		dayMaxEvents: true,
		selectable: editable,
		editable: false,
		eventDurationEditable: false,
		eventStartEditable: false,
		pointer: true, // TODO: why does this not work
		nowIndicator: true,
		events: events
			.filter((event) => {
				// eventFilter is available, but this is easier
				if (!showLabEvents && event.usesLab) return false;
				if (!showPublicEvents && event.showPublic) return false;
				if (!visibleClubs.includes(event.club)) return false;

				return true;
			})
			.map(convertToCalendarEvent),
		display: 'auto',
		height: '60rem',
		slotMinTime: '07:00:00',
		slotMaxTime: '24:00:00',
		flexibleSlotTimeLimits: true,
		allDaySlot: false,
		select: async (selectInfo) => {
			const start = selectInfo.start;
			const end = selectInfo.end;

			addModal.fillFields({
				start: start,
				end: end,
				club: clubOptions[0][0]
			});
			addModal.showModal();
		},
		eventDrop: async (event) => {
			const { event: calEvent } = event;
			const success = await updateEventTimes(calEvent.id as string, calEvent.start, calEvent.end);
			if (!success) {
				event.revert();
			}
		},
		eventResize: async (event) => {
			const { event: calEvent } = event;
			const success = await updateEventTimes(calEvent.id as string, calEvent.start, calEvent.end);
			if (!success) {
				event.revert();
			}
		},
		eventClick: async (event) => {
			const clickedEvent = event.event;
			const eventInfo = events.find((e) => e._id === clickedEvent.id);
			if (eventInfo) {
				if (hasPermissions(eventInfo)) {
					onClickEdit(eventInfo);
				} else {
					selectedEvent = eventInfo;
					if (displayModal) {
						displayModal.showModal();
					}
				}
			}
		},
		dateClick: async (info) => {
			if (editable) {
				const plusOneHour = new Date(info.date.getTime() + 60 * 60 * 1000);
				addModal.fillFields({ start: info.date, end: plusOneHour, club: clubOptions[0][0] });
				addModal.showModal();
			}
		},
		headerToolbar: {
			start: 'title prev,next today',
			center: '',
			end: 'dayGridMonth,timeGridWeek,listMonth'
		}
	}) as Calendar.Options;

	////////////////////
	// EVENT HANDLERS //
	////////////////////

	const onClickAdd = () => {
		const nowWithoutMinutes = new SvelteDate();
		nowWithoutMinutes.setMinutes(0);
		nowWithoutMinutes.setSeconds(0);
		const plusOneHour = new Date(nowWithoutMinutes.getTime() + 60 * 60 * 1000);
		addModal.fillFields({
			start: nowWithoutMinutes,
			end: plusOneHour,
			club: clubOptions[0][0]
		});
		addModal.showModal();
	};

	const onClickEdit = (event: WithStringId<Event>) => {
		selectedEvent = event;
		editModal.fillFields({
			title: event.title,
			start: event.start,
			end: event.end,
			club: event.club,
			location: event.location ?? '',
			locationLink: event.locationLink ?? '',
			description: event.description ?? '',
			showPublic: event.showPublic ?? false,
			usesLab: event.usesLab ?? false
		});
		editModal.showModal();
	};
</script>

<!-- Filter buttons -->
<div class="center-horizontal">
	{#if adminFor.length > 0}
		<button class="button-medium" onclick={onClickAdd}>Add Event</button>
	{/if}

	<button
		class="button-medium filter-visibility-button"
		onclick={() => (showFilters = !showFilters)}>{showFilters ? 'Hide' : 'Show'} Filters</button
	>

	{#if showFilters}
		<div class="filter-container" transition:slide>
			<!-- Filter buttons for Lab and Public events -->
			{#if editable}
				<div class="filter-buttons">
					<ToggleButton
						displayName="Lab Events"
						color="var(--cal-poly-secondary)"
						bind:isActive={showLabEvents}
					/>
					<ToggleButton
						displayName="Public Events"
						color="var(--cal-poly-secondary)"
						bind:isActive={showPublicEvents}
					/>
				</div>
			{/if}

			<!-- Filter buttons for specific clubs -->
			<div class="filter-checkboxes">
				{#each clubs as club (club._id)}
					<ToggleButton
						id={club.urlName}
						displayName={club.clubName}
						color={club.color}
						isActive={true}
						bind:group={visibleClubs}
					/>
				{/each}
			</div>
			<div class="filter-buttons">
				<button onclick={() => (visibleClubs = clubs.map((club) => club.urlName))}>Show All</button>
				<button onclick={() => (visibleClubs = [])}>Hide All</button>
			</div>
		</div>
	{/if}
</div>

<Calendar {plugins} {options} />

<ModalForm
	bind:this={addModal}
	title="Add Event"
	fields={modalFields}
	actions={[{ name: 'Submit', action: 'calendar?/create' }]}
/>

<ModalForm
	bind:this={editModal}
	title="Edit Event"
	fields={modalFields}
	extraInfo={selectedEvent
		? {
				id: selectedEvent._id
			}
		: undefined}
	actions={[
		{ name: 'Submit', action: 'calendar?/edit' },
		{ name: 'Delete', action: 'calendar?/delete' }
	]}
/>

{#if selectedEvent}
	<Modal bind:this={displayModal} title={selectedEvent.title}>
		{#if selectedEvent.description}
			<p>{selectedEvent.description}</p>
		{/if}
		<div class="event-info">
			{#if selectedEvent.location}
				{#if selectedEvent.locationLink}
					<p>
						<em
							>Location: <a rel="external" href={selectedEvent.locationLink} target="_blank"
								>{selectedEvent.location}</a
							></em
						>
					</p>
				{:else}
					<p><em>Location: {selectedEvent.location}</em></p>
				{/if}
			{/if}
			{#if selectedEventClub}
				<p>
					<em
						>Club: <a href={resolve('/clubs/[slug]', { slug: selectedEventClub.urlName })}
							>{selectedEventClub.clubName ?? 'unknown'}</a
						></em
					>
				</p>
			{/if}
			<p><em>Start: {formatDate(selectedEvent.start)}</em></p>
			<p><em>End: {formatDate(selectedEvent.end)}</em></p>
		</div>
	</Modal>
{/if}

<style>
	p {
		margin: 0.5rem 0;
		font-size: 1.25rem;
	}

	.event-info {
		margin-top: 1rem;
	}

	.center-horizontal {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	a {
		color: var(--cal-poly-secondary);
	}

	div.filter-container {
		width: 80%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
		border: 3px solid #777;
		border-radius: 1rem;
		padding: 1rem;
	}

	div.filter-checkboxes {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
	}

	div.filter-buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}

	div.filter-buttons button {
		margin-top: 1rem;
		background-color: transparent;
		border: 3px solid #777;
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-size: 1rem;
		transition:
			background-color 0.3s,
			color 0.3s;
	}

	div.filter-buttons button:hover {
		background-color: #777;
		color: white;
	}

	.filter-visibility-button {
		margin-bottom: 2rem;
	}
</style>
