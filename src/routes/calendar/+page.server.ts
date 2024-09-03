import * as db from '$lib/server/database';

import { fail } from '@sveltejs/kit';
import type { ServerLoad, Actions } from '@sveltejs/kit';

import * as models from '$lib/models';

export const load: ServerLoad = async (event) => {
    const events = await db.getEvents();
    events.forEach((calEvent) => {
        if (event.locals.user?.admin_for.includes(calEvent.club)) {
            calEvent.editable = true;
        }
    });
    return {
        events: events,
    }
}

export const actions: Actions = {
    add: async (event) => {
        const formData = await event.request.formData();
        const title = formData.get('title');
        const allDay = formData.get('allDay') !== null;
        const start = formData.get('start');
        const end = formData.get('end');
        const club = formData.get('club');

        if (
            typeof title !== 'string' ||
            title.length < 1 ||
            title.length > 255
        ) {
            return fail(400, {
                title,
                message: 'Invalid title'
            });
        }

        if (
            typeof start !== 'string' ||
            typeof end !== 'string'
        ) {
            return fail(400, {
                title,
                message: 'Invalid date'
            });
        }

        if (
            typeof club !== 'string' ||
            club.length < 1 ||
            club.length > 255
        ) {
            return fail(400, {
                title,
                message: 'Invalid club'
            });
        }
        
        if (!event.locals.user?.admin_for.includes(club)) {
            return fail(403, {
                title,
                message: 'You do not have permission to add events for this club'
            });
        }

        await db.addEvent({
            title,
            allDay,
            start: new Date(start),
            end: new Date(end),
            club,
        } as models.Event);
    },
}
