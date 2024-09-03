<script lang="ts">
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
    import Interaction from '@event-calendar/interaction';
    import { Event } from '$lib/models.js';
	import { tick } from 'svelte';

    export let data;

    const addEvent = async (event: {
        title: string,
        allDay: boolean,
        start: string,
        end: string,
        club: string,
    }) => {
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
    
    const updateEvent = async (event: Calendar.Event) => {
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

    const deleteEvent = async (event: Calendar.Event) => {
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

    let events = data.events;

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
            const newEvent = event.event;
            if (!await updateEvent(newEvent)) {
                event.revert();
            }
        },
        eventResize: async (event) => {
            const resizedEvent = event.event;
            if (!await updateEvent(resizedEvent)) {
                event.revert();
            }
        },
        eventClick: async (event) => {
            const clickedEvent = event.event;
            if (await deleteEvent(clickedEvent)) {
                events = events.filter((e) => e.id !== clickedEvent.id);
                options.events = events;
            }
        },
    } as Calendar.Options;

    const onClickAdd = () => {
        const title = (document.getElementById('title') as HTMLInputElement).value;
        const allDay = (document.getElementById('allDay') as HTMLInputElement).checked;
        const start = (document.getElementById('start') as HTMLInputElement).value;
        const end = (document.getElementById('end') as HTMLInputElement).value;
        const club = (document.getElementById('club') as HTMLSelectElement).value;

        const newEvent = {
            title: title,
            allDay: allDay,
            start: start,
            end: end,
            club: club,
        };

        addEvent(newEvent).then((event) => {
            if (event) {
                events = [...events, event];
                options.events = events;
            }
        });
    };
</script>

<h1>Calendar</h1>

<Calendar {plugins} {options} />

{#if data.adminFor.length > 0}
    <h1>Add New Event</h1>
    <div class="form">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" required>
    
        <label for="allDay">All Day</label>
        <input type="checkbox" id="allDay" name="allDay">
    
        <label for="start">Start</label>
        <input type="datetime-local" id="start" name="start" required>
    
        <label for="end">End</label>
        <input type="datetime-local" id="end" name="end" required>
    
        <label for="club">Club</label>
        <select id="club" name="club" required>
            {#each data.adminFor as club}
                <option value={club.urlName}>{club.clubName}</option>
            {/each}
        </select>
    
        <button on:click={onClickAdd}>Add Event</button>
    </div>
{/if}

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
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0.5rem 0;
    }

    input {
        font-size: 1.25rem;
        margin: 0.5rem 0;
        padding: 0.5rem;
        width: 100%;
    }

    select {
        font-size: 1.25rem;
        margin: 0.5rem 0;
        padding: 0.5rem;
        width: 100%;
    }

    button {
        font-size: 1.25rem;
        margin: 1rem 0;
        padding: 0.5rem 1rem;
        background-color: var(--cal-poly-secondary);
        color: white;
    }
</style>
