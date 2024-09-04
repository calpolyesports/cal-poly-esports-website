<script lang="ts">
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
    import Interaction from '@event-calendar/interaction';
    import { Event } from '$lib/models.js';
	import Modal from '$lib/Modal.svelte';

    interface ModalEvent {
        title: string,
        allDay: boolean,
        start: Date,
        end: Date,
        club: string,
    }

    export let data;
    let events = data.events;

    let modalVisible = false;
    let modalIsEdit = false;
    let modalEvent: Event | undefined = undefined;
    $: modalTitle = modalIsEdit ? 'Edit Event' : 'Add Event';

    let newEventTitle = '';
    let newEventAllDay = false;
    let newEventStart = '';
    let newEventEnd = '';
    let newEventClub = '';

    const setModalFields = (modalEvent?: ModalEvent) => {
        if (modalEvent) {
            const adjustedStart = new Date(modalEvent.start.getTime() - modalEvent.start.getTimezoneOffset() * 60000);
            const adjustedEnd = new Date(modalEvent.end.getTime() - modalEvent.end.getTimezoneOffset() * 60000);
            newEventTitle = modalEvent.title;
            newEventAllDay = modalEvent.allDay;
            newEventStart = adjustedStart.toISOString().slice(0, 16);
            newEventEnd = adjustedEnd.toISOString().slice(0, 16);
            newEventClub = modalEvent.club;
        } else {
            newEventTitle = '';
            newEventAllDay = false;
            newEventStart = '';
            newEventEnd = '';
            newEventClub = data.adminFor[0].urlName;
        }
    };

    const getModalFields = () => {
        return {
            title: newEventTitle,
            allDay: newEventAllDay,
            start: new Date(newEventStart),
            end: new Date(newEventEnd),
            club: newEventClub,
        };
    };

    const syncEventTimeInfo = (event: Calendar.Event) => {
        const targetEvent = events.find((e) => e.id === event.id);
        if (!targetEvent) {
            return;
        }
        targetEvent.allDay = event.allDay;
        targetEvent.start = event.start;
        targetEvent.end = event.end;
        return targetEvent;
    };

    const sendAddEvent = async (event: ModalEvent) => {
        const response = await fetch("/calendar", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (response.ok) {
            const newEvent = await response.json();
            if (newEvent.status >= 200 && newEvent.status < 300) {
                return new Event(
                    newEvent.event.id,
                    newEvent.event.title,
                    newEvent.event.allDay,
                    new Date(newEvent.event.start),
                    new Date(newEvent.event.end),
                    newEvent.event.club,
                    newEvent.event.backgroundColor,
                );
            }
        }

        return undefined;
    };
    
    const sendUpdateEvent = async (event?: Event) => {
        if (!event) {
            return false;
        }
        const response = await fetch("/calendar", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (response.ok) {
            const updatedEvent = await response.json();
            return updatedEvent.status >= 200 && updatedEvent.status < 300;
        }

        return false;
    };

    const sendDeleteEvent = async (event?: Event) => {
        if (!event) {
            return false;
        }
        const response = await fetch("/calendar", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (response.ok) {
            const deletedEvent = await response.json();
            return deletedEvent.status >= 200 && deletedEvent.status < 300;
        }

        return false;
    };

    const onClickAdd = () => {
        modalIsEdit = false;
        modalEvent = undefined;
        modalVisible = true;
    };

    const onSubmitAdd = () => {
        const newEvent = getModalFields();
        sendAddEvent(newEvent).then((event) => {
            if (event) {
                events = [...events, event];
                options.events = events;
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
        const updatedEvent = new Event(
            modalEvent.id,
            updatedEventInfo.title,
            updatedEventInfo.allDay,
            updatedEventInfo.start,
            updatedEventInfo.end,
            updatedEventInfo.club,
            modalEvent.backgroundColor,
        );
        sendUpdateEvent(updatedEvent).then((success) => {
            if (success) {
                events = events.map((e) => e.id === updatedEvent.id ? updatedEvent : e);
                options.events = events;
            }
        });
        setModalFields();
        modalVisible = false;
    };

    const onSubmitDelete = () => {
        sendDeleteEvent(modalEvent).then((success) => {
            if (success) {
                events = events.filter((e) => e.id !== modalEvent?.id);
                options.events = events;
            }
        });
        setModalFields();
        modalVisible = false;
    };

    let plugins = [TimeGrid, Interaction] as Calendar.Plugin[];
    let options = {
        view: 'timeGridWeek',
        selectable: true,
        events: events,
        display: 'auto',
        height: '50rem',
        slotMinTime: '08:00:00',
        slotMaxTime: '22:00:00',
        eventDrop: async (event) => {
            const editedEvent = syncEventTimeInfo(event.event);
            if (!await sendUpdateEvent(editedEvent)) {
                event.revert();
            }
        },
        eventResize: async (event) => {
            const editedEvent = syncEventTimeInfo(event.event);
            if (!await sendUpdateEvent(editedEvent)) {
                event.revert();
            }
        },
        eventClick: async (event) => {
            const clickedEvent = event.event;
            const eventInfo = events.find((e) => e.id === clickedEvent.id);
            if (!eventInfo) {
                return;
            }
            onClickEdit(eventInfo);
        },
    } as Calendar.Options;
</script>

<h1>Calendar</h1>

{#if data.adminFor.length > 0}
    <button on:click={onClickAdd}>Add Event</button>
{/if}

<Calendar {plugins} {options} />

<Modal bind:show={modalVisible} title={modalTitle}>
    <div class="form">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" bind:value={newEventTitle} required>
    
        <label for="allDay">All Day</label>
        <input type="checkbox" id="allDay" name="allDay" bind:value={newEventAllDay}>
    
        <label for="start">Start</label>
        <input type="datetime-local" id="start" name="start" bind:value={newEventStart} required>
    
        <label for="end">End</label>
        <input type="datetime-local" id="end" name="end" bind:value={newEventEnd} required>
    
        <label for="club">Club</label>
        <select id="club" name="club" bind:value={newEventClub} required>
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
    }
</style>
