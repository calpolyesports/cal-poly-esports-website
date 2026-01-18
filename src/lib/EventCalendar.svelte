<script lang="ts">
	import { Calendar, DayGrid, TimeGrid, List, Interaction } from '@event-calendar/core';
	import type { WithStringId, Event, Club } from '$lib/types.js';
	import Modal from '$lib/Modal.svelte';
	import ModalForm from '$lib/ModalForm.svelte';
	import type { ModalFieldDefinition } from '$lib/ModalForm.svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { SvelteDate } from 'svelte/reactivity';
	import { resolve } from '$app/paths';

	let {
		events,
		clubs,
		adminFor
	}: {
		events: WithStringId<Event>[];
		clubs: WithStringId<Club>[];
		adminFor: WithStringId<Club>[];
	} = $props();

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

	let mounted = $state(false);

	const modalFields = $derived([
		{ name: 'title', type: 'text', required: true },
		{ name: 'start', type: 'date', required: true },
		{ name: 'end', type: 'date', required: true },
		{
			name: 'club',
			type: 'dropdown',
			options: adminFor.map((club) => [club.urlName, club.clubName]),
			required: true
		},
		{ name: 'location', type: 'text', required: true },
		{ name: 'locationLink', type: 'text' },
		{ name: 'description', type: 'text' },
		{ name: 'showPublic', type: 'checkbox' },
		{ name: 'usesLab', type: 'checkbox' }
	]) as ModalFieldDefinition[];

	//////////////////////
	// CALENDAR OPTIONS //
	//////////////////////

	let plugins = [DayGrid, TimeGrid, List, Interaction] as Calendar.Plugin[];
	let options = $state({
		view: 'timeGridWeek',
		selectable: true,
		editable: true,
		eventDurationEditable: false,
		eventStartEditable: false,
		nowIndicator: true,
		events: [],
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
		eventDrop: async (_event) => {
			// TODO: bring back this functionality
			// const editedEvent = syncEventTimeInfo(event.event);
			// if (editedEvent && !(await sendUpdateEvent(editedEvent._id, editedEvent))) {
			// 	event.revert();
			// }
		},
		eventResize: async (_event) => {
			// TODO: bring back this functionality
			// const editedEvent = syncEventTimeInfo(event.event);
			// if (editedEvent && !(await sendUpdateEvent(editedEvent._id, editedEvent))) {
			// 	event.revert();
			// }
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
		headerToolbar: {
			start: 'title prev,next today',
			center: '',
			end: 'dayGridMonth,timeGridWeek,listMonth'
		}
	}) as Calendar.Options;

	//////////////////////
	// CALENDAR HELPERS //
	//////////////////////

	const hasPermissions = (event: Event) => {
		return adminFor.find((club) => club.urlName === event.club);
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
			editable: event.editable
		};
	};

	const syncCalendarWithEvents = () => {
		let filteredEvents = events.filter((event) => {
			if (showLabEvents && event.usesLab) return true;
			if (showPublicEvents && event.showPublic) return true;
			if (visibleClubs.includes(event.club)) return true;

			return false;
		});

		options.events = filteredEvents.map(convertToCalendarEvent);
	};

	const toggleLabEvents = () => {
		showLabEvents = !showLabEvents;
		syncCalendarWithEvents();
	};

	const togglePublicEvents = () => {
		showPublicEvents = !showPublicEvents;
		syncCalendarWithEvents();
	};

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

	onMount(() => {
		mounted = true;
	});

	$effect(() => {
		if (mounted) {
			syncCalendarWithEvents();
		}
	});
</script>

<div>
	<h1>Admin</h1>
</div>

<!-- Filter buttons -->
<div class="button-container">
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
			<div class="filter-buttons">
				<button
					class="filter-button"
					onclick={toggleLabEvents}
					style="background-color: {showLabEvents ? 'var(--cal-poly-secondary)' : 'gray'}"
				>
					Lab Events
				</button>
				<button
					class="filter-button"
					onclick={togglePublicEvents}
					style="background-color: {showPublicEvents ? 'var(--cal-poly-secondary)' : 'gray'}"
				>
					Public Events
				</button>
			</div>

			<!-- Filter buttons for specific clubs -->
			<div class="filter-checkboxes">
				{#each clubs as club (club._id)}
					<label
						style="
                        border-color: {club.color};
                        background-color: {visibleClubs.find((urlName) => club.urlName === urlName)
							? club.color
							: 'transparent'};
                        color: {visibleClubs.find((urlName) => club.urlName === urlName)
							? 'white'
							: club.color}"
					>
						<input
							type="checkbox"
							name="visibleClubs"
							value={club.urlName}
							bind:group={visibleClubs}
							checked
						/>
						{club.clubName}
					</label>
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
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin: 1rem auto;
	}

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

	a {
		font-size: 1.25rem;
		margin: 0;
		color: black;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	button {
		font-size: 1.25rem;
		margin-bottom: 2rem;
		padding: 0.5rem 1rem;
		background-color: var(--cal-poly-secondary);
		color: white;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
	}

	.button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.button-medium {
		font-size: 1.25rem;
		margin-bottom: 0rem;
		padding: 0.5rem 1rem;
		background-color: var(--cal-poly-secondary);
		color: white;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
	}

	.filter-buttons {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;
	}

	.filter-button {
		color: rgb(255, 255, 255);
		border: none;
		padding: 0.5rem 1rem;
		cursor: pointer;
		border-radius: 0.5rem;
		font-size: 1rem;
	}

	.filter-button:hover {
		opacity: 0.8;
	}
</style>
