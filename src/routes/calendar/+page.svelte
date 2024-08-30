<script>
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

<style>
    h1 {
        font-size: 3rem;
        font-weight: bold;
        margin: 1rem 0;
    }
</style>
