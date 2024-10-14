<script lang="ts">
    import Calendar from '@event-calendar/core';
    import DayGrid from '@event-calendar/day-grid';
    import TimeGrid from '@event-calendar/time-grid';
    import List from '@event-calendar/list';
    import Interaction from '@event-calendar/interaction';
    import type { WithStringId, Event, Club } from '$lib/types.js';
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
        public: boolean;
    }

    export let data;
    let events: WithStringId<Event>[] = data.events;

    let ec: Calendar;

    let showFilters = false;

    let addModal: ModalForm;
    let editModal: ModalForm;
    let selectedEvent: WithStringId<Event> | undefined = undefined;

    let mounted = false;

    const modalFields = [
        { name: 'title', type: 'text' },
        { name: 'start', type: 'date' },
        { name: 'end', type: 'date' },
        { name: 'club', type: 'dropdown', options: data.adminFor.map((club) => [club.urlName, club.clubName]) },
        { name: 'location', type: 'text' },
        { name: 'locationLink', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'showPublic', type: 'checkbox', label: 'Show on Public Calendar' },
    ] as ModalFieldDefinition[];

    ////////////////////////
    // CALENDAR FUNCTIONS //
    ////////////////////////

    const syncCalendarWithEvents = () => {
        ec.setOption('events', events.map((event) => ({
            id: event._id,
            title: event.title,
            start: event.start,
            end: event.end,
            backgroundColor: event.backgroundColor,
            editable: event.editable,
        })));
    };

    //////////////////////////
    // EVENT HANDLERS LOGIC //
    //////////////////////////

    const onClickAdd = () => {
        const nowWithoutMinutes = new Date();
        nowWithoutMinutes.setMinutes(0);
        nowWithoutMinutes.setSeconds(0);
        const plusOneHour = new Date(nowWithoutMinutes.getTime() + 60 * 60 * 1000);
        addModal.fillFields({
            start: nowWithoutMinutes,
            end: plusOneHour,
            club: data.adminFor[0].urlName,
            showPublic: false,  // Default is not public
        });
        addModal.showModal();
    };

    const onSubmitAdd = async (modalFields: FilledModalFields) => {
        const newEvent = {
            ...modalFields,
            usesLab: true, // Auto set usesLab to true for admin events
            showPublic: modalFields.showPublic as boolean,
        } as ModalEvent;
        const response = await fetch("/admin", {  // Use `/admin` since the server route is defined at `/admin/+server.ts`
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEvent),
        });

        if (response.ok) {
            const data = await response.json();
            events.push(data.event);
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
        });
        editModal.showModal();
    };

    const onSubmitEdit = async (modalFields: FilledModalFields) => {
        if (!selectedEvent) {
            return;
        }
        const updatedEventInfo = {
            ...modalFields,
            usesLab: true, // Ensure usesLab stays true for admin events
            showPublic: modalFields.showPublic as boolean,
        } as ModalEvent;
        const response = await fetch(`/admin/${selectedEvent._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEventInfo),
        });

        if (response.ok) {
            const data = await response.json();
            events = events.map((e) => e._id === data.event._id ? data.event : e);
            syncCalendarWithEvents();
        }
        editModal.clearFields();
        editModal.hideModal();
    };

    const onSubmitDelete = async () => {
        if (!selectedEvent) {
            return;
        }
        const response = await fetch(`/admin/${selectedEvent._id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            events = events.filter((e) => e._id !== selectedEvent._id);
            syncCalendarWithEvents();
        }
        editModal.clearFields();
        editModal.hideModal();
    };

    //////////////////////
    // SVELTE MOUNT LOGIC //
    //////////////////////

    let options = {
        view: 'timeGridWeek',
        editable: true,
        events: [],
        eventClick: (info) => {
            const clickedEvent = info.event;
            const eventData = events.find((e) => e._id === clickedEvent.id);
            if (eventData) {
                onClickEdit(eventData);
            }
        },
        eventDrop: async (event) => {
            const updatedEvent = syncEventTimeInfo(event.event);
            if (updatedEvent && !await sendUpdateEvent(updatedEvent._id, updatedEvent)) {
                event.revert();
            }
        },
        eventResize: async (event) => {
            const updatedEvent = syncEventTimeInfo(event.event);
            if (updatedEvent && !await sendUpdateEvent(updatedEvent._id, updatedEvent)) {
                event.revert();
            }
        },
        headerToolbar: {
            start: 'title prev,next today',
            center: '',
            end: 'dayGridMonth,timeGridWeek,listMonth',
        },
    };


    onMount(() => {
        mounted = true;
    });

    $: if (mounted) {
        syncCalendarWithEvents();
    }
</script>

<h1>Admin Calendar</h1>
<button on:click={onClickAdd} class="button-medium">Add Event</button>

<Calendar bind:this={ec} plugins={[DayGrid, TimeGrid, List, Interaction]} options={{ view: 'timeGridWeek', editable: true, events: [] }} />

<ModalForm
    bind:this={addModal}
    title="Add Lab Event"
    fields={modalFields}
    showPublicCheckbox={true}
    actions={[
        { name: 'Submit', callback: onSubmitAdd },
    ]}
/>
