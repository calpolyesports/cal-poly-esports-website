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

    interface ModalEvent {
        title: string,
        start: Date,
        end: Date,
        club: string,
        location?: string,
        description?: string,
    }

    export let data;
    let events: WithStringId<Event>[] = data.events;
    const clubOptions: [string, string][] = data.adminFor.map((club) => [club.urlName, club.clubName]);
    if (data.isGeneralAdmin) {
        clubOptions.unshift(['general', 'General']);
    }

    let ec: Calendar;

    let displayModal: Modal;

    let addModal: ModalForm;

    let editModal: ModalForm;
    let selectedEvent = undefined as WithStringId<Event> | undefined;

    const modalFields = [
        { name: 'title', type: 'text' },
        { name: 'start', type: 'date' },
        { name: 'end', type: 'date' },
        { name: 'club', type: 'dropdown', options: clubOptions },
        { name: 'location', type: 'text' },
        { name: 'description', type: 'text' },
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
        if (event.club === 'general') {
            return data.isGeneralAdmin;
        }
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
            description: info.description === '' ? undefined : info.description as string,
        } as ModalEvent;
    };

    //////////////////////
    // API INTERACTIONS //
    //////////////////////

    const sendAddEvent = async (event: ModalEvent): Promise<WithStringId<Event> | undefined> => {
        const response = await fetch("/calendar", {
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
        const response = await fetch(`/calendar/${id}`, {
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
        addModal.clearFields();
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
            ec.addEvent(convertToCalendarEvent(event));
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
            description: event.description ?? '',
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
            ec.updateEvent(convertToCalendarEvent(updatedEvent));
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
            ec.removeEventById(clickedEvent._id);
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
        events: events.map(convertToCalendarEvent),
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
</script>

<h1>Calendar</h1>

{#if data.adminFor.length > 0}
    <button class="button-medium" on:click={onClickAdd}>Add Event</button>
{/if}

<Calendar bind:this={ec} {plugins} {options} />

<ModalForm
    bind:this={addModal}
    title="Add Event"
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
            <p><em>Location: {selectedEvent?.location}</em></p>
        {/if}
        <p><em>Club: {selectedEvent?.club}</em></p>
        <p><em>Start: {selectedEvent?.start.toLocaleString()}</em></p>
        <p><em>End: {selectedEvent?.start.toLocaleString()}</em></p>
    </div>
</Modal>
<style>
    p {
        margin: 0.5rem 0;
        font-size: 1.25rem;
    }

    .event-info {
        margin-top: 1rem;
    }
</style>
