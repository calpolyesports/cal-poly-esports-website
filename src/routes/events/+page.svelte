<script>
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';

    export let data;

    let plugins = [TimeGrid];
    let options = {
        view: 'timeGridWeek',
        events: data.events,
        height: '50rem',
    };
</script>

<h2>Event Calendar</h2>

<Calendar {plugins} {options} />
