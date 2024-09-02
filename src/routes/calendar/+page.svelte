<script>
    import { enhance } from '$app/forms';
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';

    export let data;

    let plugins = [TimeGrid];
    let options = {
        view: 'timeGridWeek',
        events: data.events,
        height: '50rem',
        slotMinTime: '08:00:00',
        slotMaxTime: '22:00:00',
    };
</script>

<h1>Calendar</h1>

<Calendar {plugins} {options} />

{#if data.adminFor.length > 0}
    <h1>Add New Event</h1>
    <form method="post" use:enhance>
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

        <button>Add Event</button>
    </form>
{/if}

<style>
    h1 {
        font-size: 3rem;
        font-weight: bold;
        margin: 1rem 0;
    }

    form {
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
