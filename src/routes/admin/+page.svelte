<script lang="ts">
    import Calendar from '@event-calendar/core';
    import DayGrid from '@event-calendar/day-grid';
    import TimeGrid from '@event-calendar/time-grid';
    import List from '@event-calendar/list';
    import Interaction from '@event-calendar/interaction';
    import type { WithStringId, Event } from '$lib/types.js';
    import Modal from '$lib/Modal.svelte';
    import ModalForm from '$lib/ModalForm.svelte';
    import type { ModalFieldDefinition, FilledModalFields } from '$lib/ModalForm.svelte';
    import { onMount } from 'svelte';
    import { enhance } from "$app/forms";

    interface ModalEvent {
        title: string;
        start: Date;
        end: Date;
        club: string;
        location?: string;
        description?: string;
        usesLab: boolean;
        showPublic: boolean;
    }

    export let data;
    let events: WithStringId<Event>[] = data.events;
    const clubOptions: [string, string][] = data.adminFor.map((club) => [club.urlName, club.clubName]);

    let ec: Calendar;
    let showLabEvents = true;
    let showPublicEvents = true;

    let addModal: ModalForm;
    let editModal: ModalForm;
    let displayModal: Modal;
    let selectedEvent = undefined as WithStringId<Event> | undefined;
    $: selectedEventClub = selectedEvent ? data.clubs.find((club) => club.urlName === selectedEvent!.club) : undefined;

    let mounted = false;

    const modalFields = [
        { name: 'title', type: 'text' },
        { name: 'start', type: 'date' },
        { name: 'end', type: 'date' },
        { name: 'club', type: 'dropdown', options: data.adminFor.map((club) => [club.urlName, club.clubName]) },
        { name: 'location', type: 'text' },
        { name: 'locationLink', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'showPublic', type: 'checkbox' },
        { name: 'usesLab', type: 'checkbox' },
    ] as ModalFieldDefinition[];

    //////////////////////
    // CALENDAR HELPERS //
    //////////////////////

    const syncEventTimeInfo = (event: Calendar.Event) => {
        const targetEvent = events.find((e) => e._id === event.id);
        if (!targetEvent) {
            return;
        }
        targetEvent.start = event.start;
        targetEvent.end = event.end;
        return targetEvent;
    };

    const hasPermissions = (event: Event) => {
        return data.adminFor.find((club) => club.urlName === event.club);
    };

    const convertToCalendarEvent = (event: WithStringId<Event>): Calendar.EventInput => {
        return {
            id: event._id,
            title: event.title,
            start: event.start,
            end: event.end,
            backgroundColor: event.backgroundColor,
            editable: event.editable,
        };
    };

    const rawModalInfoToModalEvent = (info: FilledModalFields) => {
        return {
            title: info.title as string,
            start: info.start as Date,
            end: info.end as Date,
            club: info.club as string,
            location: info.location === '' ? undefined : info.location as string,
            locationLink: info.locationLink === '' ? undefined : info.locationLink as string,
            description: info.description === '' ? undefined : info.description as string,
            showPublic: info.showPublic as boolean,
            usesLab: info.usesLab as boolean,
        } as ModalEvent;
    };

    const syncCalendarWithEvents = () => {
    let filteredEvents = events.filter(event => {
        if (showLabEvents && event.usesLab) return true;
        if (showPublicEvents && event.showPublic) return true;

        return false;
    });

    ec.setOption('events', filteredEvents.map(convertToCalendarEvent));
};

    const toggleLabEvents = () => {
        showLabEvents = !showLabEvents;
        syncCalendarWithEvents();
    };

    const togglePublicEvents = () => {
        showPublicEvents = !showPublicEvents;
        syncCalendarWithEvents();
    };

    function formatDate(date: Date = new Date()): string {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    }

    //////////////////////
    // API INTERACTIONS //
    //////////////////////

    const sendAddEvent = async (event: ModalEvent): Promise<WithStringId<Event> | undefined> => {
        const response = await fetch("/admin", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (response.ok) {
            const data = await response.json();
            return data.event;
        }

        return undefined;
    };
    
    const sendUpdateEvent = async (id: string, event: ModalEvent): Promise<WithStringId<Event> | undefined> => {
        const response = await fetch(`/admin/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (response.ok) {
            const data = await response.json();
            return data.event;
        }

        return undefined;
    };

    const sendDeleteEvent = async (id: string): Promise<boolean> => {
        const response = await fetch(`/calendar/${id}`, {
            method: 'DELETE',
        });

        return response.ok;
    };

    ////////////////////
    // EVENT HANDLERS //
    ////////////////////

    const onClickAdd = () => {
        const nowWithoutMinutes = new Date();
        nowWithoutMinutes.setMinutes(0);
        nowWithoutMinutes.setSeconds(0);
        const plusOneHour = new Date(nowWithoutMinutes.getTime() + 60 * 60 * 1000);
        addModal.fillFields({
            start: nowWithoutMinutes,
            end: plusOneHour,
            club: clubOptions[0][0],
        });
        addModal.showModal();
    };

    const onSubmitAdd = async (modalFields: FilledModalFields) => {
        const newEvent = rawModalInfoToModalEvent(modalFields);
        const event = await sendAddEvent(newEvent);
        if (event) {
            // correct date timezones for calendar
            event.start = new Date(event.start);
            event.end = new Date(event.end);
            events.push(event);
            syncCalendarWithEvents();
        }
        addModal.clearFields();
        addModal.hideModal();
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
            usesLab: event.usesLab ?? false,
        });
        editModal.showModal();
    };

    const onSubmitEdit = async (modalFields: FilledModalFields) => {
        if (!selectedEvent) {
            return;
        }
        const updatedEventInfo = rawModalInfoToModalEvent(modalFields);
        const updatedEvent = await sendUpdateEvent(selectedEvent._id, updatedEventInfo);
        if (updatedEvent) {
            // correct date timezones for calendar
            updatedEvent.start = new Date(updatedEvent.start);
            updatedEvent.end = new Date(updatedEvent.end);
            events = events.map((e) => e._id === updatedEvent._id ? updatedEvent : e);
            syncCalendarWithEvents();
        }
        editModal.clearFields();
        editModal.hideModal();
    };

    const onSubmitDelete = async (values: FilledModalFields) => {
        if (!selectedEvent) {
            return;
        }
        const clickedEvent = selectedEvent;
        const success = await sendDeleteEvent(clickedEvent._id);
        if (success) {
            events = events.filter((e) => e._id !== clickedEvent._id);
            syncCalendarWithEvents();
        }
        editModal.clearFields();
        editModal.hideModal();
    };
    
    //////////////////////
    // CALENDAR OPTIONS //
    //////////////////////

    let plugins = [DayGrid, TimeGrid, List, Interaction] as Calendar.Plugin[];
    let options = {
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
                club: clubOptions[0][0],
            });
            addModal.showModal();
        },
        eventDrop: async (event) => {
            const editedEvent = syncEventTimeInfo(event.event);
            if (editedEvent && !await sendUpdateEvent(editedEvent._id, editedEvent)) {
                event.revert();
            }
        },
        eventResize: async (event) => {
            const editedEvent = syncEventTimeInfo(event.event);
            if (editedEvent && !await sendUpdateEvent(editedEvent._id, editedEvent)) {
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
                    displayModal.showModal();
                }
            }
        },
        headerToolbar: {
            start: 'title prev,next today',
            center: '',
            end: 'dayGridMonth,timeGridWeek,listMonth',
        }
    } as Calendar.Options;

    onMount(() => {
        mounted = true;
    });

    $: if (mounted) {
        syncCalendarWithEvents();
    }
</script>

<div>
    <h1>Admin</h1>
</div>

<!-- Filter buttons -->
<div class="button-container">
    <button on:click={onClickAdd} class="button-medium">Add Event</button>

    <!-- Filter buttons for Lab and Public events -->
    <div class="filter-buttons">
        <button class="filter-button" on:click={toggleLabEvents} style="background-color: {showLabEvents ? 'var(--cal-poly-secondary)' : 'gray'}">
            Lab Events
        </button>
        <button class="filter-button" on:click={togglePublicEvents} style="background-color: {showPublicEvents ? 'var(--cal-poly-secondary)' : 'gray'}">
            Public Events
        </button>
    </div>
</div>

<Calendar bind:this={ec} {plugins} {options} />

<!-- Ethernet Availability Info in Table -->
<div class="ethernet-availability">
    <h3>ETHERNET AVAILABILITY:</h3>
    <table>
        <thead>
            <tr>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
                <th>Sunday</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>5:30-midnight</td>
                <td>4:30-midnight</td>
                <td>5:30-midnight</td>
                <td>4:30-midnight</td>
                <td>2:00-midnight</td>
                <td>All-Day</td>
                <td>All-Day</td>
            </tr>
        </tbody>
    </table>
</div>

<div>
    <h2>Logged in as: {data.username}</h2>

	<form method="post" use:enhance>
		<button>Log out</button>
	</form>
</div>

<div>
    <h3>Clubs</h3>
    {#each data.adminFor as club}
        <a href="/clubs/{club.urlName}">{club.clubName}</a>
    {/each}
</div>

<ModalForm
    bind:this={addModal}
    title="Add Lab Event"
    fields={modalFields}
    actions={[
        { name: 'Submit', callback: onSubmitAdd },
    ]} />

<ModalForm
    bind:this={editModal}
    title="Edit Event"
    fields={modalFields}
    actions={[
        { name: 'Submit', callback: onSubmitEdit },
        { name: 'Delete', callback: onSubmitDelete },
    ]} />  

<Modal
    bind:this={displayModal}
    title={selectedEvent?.title}>
    {#if selectedEvent?.description}
        <p>{selectedEvent?.description}</p>
    {/if}
    <div class="event-info">
        {#if selectedEvent?.location}
            {#if selectedEvent?.locationLink}
                <p><em>Location: <a href={selectedEvent?.locationLink} target="_blank">{selectedEvent?.location}</a></em></p>
            {:else}
                <p><em>Location: {selectedEvent?.location}</em></p>
            {/if}
        {/if}
        <p><em>Club: <a href="/clubs/{selectedEventClub?.urlName}">{selectedEventClub?.clubName ?? 'unknown'}</a></em></p>
        <p><em>Start: {formatDate(selectedEvent?.start)}</em></p>
        <p><em>End: {formatDate(selectedEvent?.end)}</em></p>
    </div>
</Modal>

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

    h2 {
        font-size: 2rem;
        font-weight: bold;
        margin-top: 1rem;
    }

    h3 {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
        color: var(--cal-poly-secondary);
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

    .ethernet-availability {
        text-align: center;
    }

    .ethernet-availability h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: var(--cal-poly-secondary);
    }

    .ethernet-availability table {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        border-collapse: collapse;
        font-size: 1.25rem;
    }

    .ethernet-availability th, .ethernet-availability td {
        border: 1px solid #ccc;
        padding: 0.5rem;
        text-align: center;
    }

    .ethernet-availability th {
        background-color: var(--cal-poly-secondary);
        color: white;
        font-weight: bold;
    }

    .ethernet-availability td {
        background-color: #f9f9f9;
    }
</style>