<script lang="ts">
    import Calendar from '@event-calendar/core';
    import DayGrid from '@event-calendar/day-grid';
    import TimeGrid from '@event-calendar/time-grid';
    import List from '@event-calendar/list';
    import Interaction from '@event-calendar/interaction';
    import type { WithStringId, Event } from '$lib/types.js';
    import ModalForm from '$lib/ModalForm.svelte';
    import type { ModalFieldDefinition, FilledModalFields } from '$lib/ModalForm.svelte';
    import { onMount } from 'svelte';

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
    let selectedEvent = undefined as WithStringId<Event> | undefined;

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
        // If either lab events are shown or public events are shown, include the event
        if (showLabEvents && event.usesLab) return true; // Show lab events if enabled
        if (showPublicEvents && event.showPublic) return true; // Show public events if enabled

        // If neither are selected, exclude the event
        return false;
    });

    // Update the calendar with the filtered events
    ec.setOption('events', filteredEvents.map(convertToCalendarEvent));
};

    // Toggle showing lab events
    const toggleLabEvents = () => {
        showLabEvents = !showLabEvents;
        syncCalendarWithEvents();
    };

    // Toggle showing public events
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
        selectable: false,
        editable: false,
        eventDurationEditable: false,
        eventStartEditable: false,
        nowIndicator: true,
        events: [],
        display: 'auto',
        height: '50rem',
        slotMinTime: '08:00:00',
        slotMaxTime: '22:00:00',
        flexibleSlotTimeLimits: true,
        allDaySlot: false,
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

<h1>Admin Calendar</h1>
<button on:click={onClickAdd} class="button-medium">Add Event</button>

<!-- Filter buttons -->
<div class="filter-buttons">
    <button class="filter-button" on:click={toggleLabEvents} style="background-color: {showLabEvents ? 'var(--cal-poly-secondary)' : 'gray'}">
        Lab Events
    </button>
    <button class="filter-button" on:click={togglePublicEvents} style="background-color: {showPublicEvents ? 'var(--cal-poly-secondary)' : 'gray'}">
        Public Events
    </button>
</div>

<Calendar bind:this={ec} {plugins} {options} />

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

<style>
    /* Filter buttons container */
    .filter-buttons {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    /* Filter button styles */
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