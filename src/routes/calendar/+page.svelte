<script lang="ts">
    import EventCalendar from '$lib/EventCalendar.svelte';
    import type { ModalEvent } from '$lib/EventCalendar.svelte';
    import type { WithStringId, Event } from '$lib/types.js';

    export let data;

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
</script>

<h1>Calendar</h1>

<EventCalendar
    events={data.events}
    clubs={data.clubs}
    adminFor={data.adminFor}
    sendAddEvent={sendAddEvent}
    sendUpdateEvent={sendUpdateEvent}
    sendDeleteEvent={sendDeleteEvent} />
