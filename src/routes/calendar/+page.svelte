<script lang="ts">
    import Calendar from '@event-calendar/core';
    import DayGrid from '@event-calendar/day-grid';
    import TimeGrid from '@event-calendar/time-grid';
    import List from '@event-calendar/list';
    import Interaction from '@event-calendar/interaction';
    import { type Event } from '$lib/types.js';
	import Modal from '$lib/Modal.svelte';

    interface ModalEvent {
        title: string,
        start: Date,
        end: Date,
        club: string,
    }

    export let data;
    let events: Event[] = data.events;

    let modalVisible = false;
    let modalIsEdit = false;
    let modalEvent: Event | undefined = undefined;
    $: modalTitle = modalIsEdit ? 'Edit Event' : 'Add Event';

    let newEventTitle = '';
    let newEventStart = '';
    let newEventEnd = '';
    let newEventClub = '';

    let ec: Calendar;

    /////////////////////
    // MODAL FUNCTIONS //
    /////////////////////

    const setModalFields = (modalEvent?: ModalEvent) => {
        if (modalEvent) {
            const adjustedStart = new Date(modalEvent.start.getTime() - modalEvent.start.getTimezoneOffset() * 60000);
            const adjustedEnd = new Date(modalEvent.end.getTime() - modalEvent.end.getTimezoneOffset() * 60000);
            newEventTitle = modalEvent.title;
            newEventStart = adjustedStart.toISOString().slice(0, 16);
            newEventEnd = adjustedEnd.toISOString().slice(0, 16);
            newEventClub = modalEvent.club;
        } else {
            newEventTitle = '';
            newEventStart = '';
            newEventEnd = '';
            newEventClub = data.adminFor[0].urlName;
        }
    };

    const getModalFields = () => {
        let startDate = new Date(newEventStart);
        let endDate = new Date(newEventEnd);
        if (startDate.getTime() > endDate.getTime()) {
            const temp = startDate;
            startDate = endDate;
            endDate = temp;
        }

        return {
            title: newEventTitle,
            start: startDate,
            end: endDate,
            club: newEventClub,
        };
    };

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

    const convertToCalendarEvent = (event: Event): Calendar.EventInput => {
        return {
            id: event._id,
            title: event.title,
            start: event.start,
            end: event.end,
            backgroundColor: event.backgroundColor,
            editable: event.editable,
        };
    };

    //////////////////////
    // API INTERACTIONS //
    //////////////////////

    const sendAddEvent = async (event: ModalEvent): Promise<Event | undefined> => {
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
    
    const sendUpdateEvent = async (id: string, event: ModalEvent): Promise<Event | undefined> => {
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

        if (response.ok) {
            return true;
        }

        return false;
    };

    //////////////////////
    // EVENT HANDLERS   //
    //////////////////////

    const onClickAdd = () => {
        modalIsEdit = false;
        modalEvent = undefined;
        setModalFields();
        modalVisible = true;
    };

    const onSubmitAdd = () => {
        const newEventInfo = getModalFields();
        sendAddEvent(newEventInfo).then((event) => {
            if (event) {
                // correct date timezones for calendar
                event.start = new Date(event.start);
                event.end = new Date(event.end);
                events.push(event);
                ec.addEvent(convertToCalendarEvent(event));
            }
        });
        setModalFields();
        modalVisible = false;
    };

    const onClickEdit = (event: Event) => {
        setModalFields(event);
        modalIsEdit = true;
        modalEvent = event;
        modalVisible = true;
    };

    const onSubmitEdit = () => {
        if (!modalEvent) {
            return;
        }
        const updatedEventInfo = getModalFields();
        sendUpdateEvent(modalEvent._id, updatedEventInfo).then((updatedEvent) => {
            if (updatedEvent) {
                // correct date timezones for calendar
                updatedEvent.start = new Date(updatedEvent.start);
                updatedEvent.end = new Date(updatedEvent.end);
                events = events.map((e) => e._id === updatedEvent._id ? updatedEvent : e);
                ec.updateEvent(convertToCalendarEvent(updatedEvent));
            }
        });
        setModalFields();
        modalVisible = false;
    };

    const onSubmitDelete = () => {
        if (!modalEvent) {
            return;
        }
        const clickedEvent = modalEvent;
        sendDeleteEvent(clickedEvent._id).then((success) => {
            if (success) {
                ec.removeEventById(clickedEvent._id);
            }
        });
        setModalFields();
        modalVisible = false;
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
            if (!eventInfo || !hasPermissions(eventInfo)) {
                return;
            }
            onClickEdit(eventInfo);
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
    <button on:click={onClickAdd}>Add Event</button>
{/if}

<Calendar bind:this={ec} {plugins} {options} />

<Modal bind:show={modalVisible} title={modalTitle}>
    <div class="form">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" bind:value={newEventTitle} required>
    
        <label for="start">Start</label>
        <input type="datetime-local" id="start" name="start" step="300" bind:value={newEventStart} required>
    
        <label for="end">End</label>
        <input type="datetime-local" id="end" name="end" step="300" bind:value={newEventEnd} required>
    
        <label for="club">Club</label>
        <select id="club" name="club" bind:value={newEventClub} required>
            {#if data.isGeneralAdmin}
                <option value="general">General</option>
            {/if}
            {#each data.adminFor as club}
                <option value={club.urlName}>{club.clubName}</option>
            {/each}
        </select>
    
        <button on:click={modalIsEdit ? onSubmitEdit : onSubmitAdd}>Confirm</button>

        {#if modalIsEdit}
            <button on:click={onSubmitDelete}>Delete</button>
        {/if}
    </div>
</Modal>

<style>
    h1 {
        font-size: 3rem;
        font-weight: bold;
        margin: 1rem 0;
    }

    div.form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 30rem;
        margin: 1rem auto;
    }

    label {
        font-size: 1rem;
        margin-top: 1rem;
        font-weight: bold;
    }

    input {
        font-size: 1.25rem;
        padding: 0.5rem;
        width: 100%;
    }

    select {
        font-size: 1.25rem;
        padding: 0.5rem;
        width: 100%;
    }

    button {
        font-size: 1.25rem;
        padding: 0.5rem 1rem;
        margin-top: 1rem;
        background-color: var(--cal-poly-secondary);
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
    }
</style>
