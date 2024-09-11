import * as db from '$lib/server/database';
import type { WithStringId, Event } from '$lib/types';

import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
    const events = (await db.getEvents(event.locals.user?.admin_for)).map((event) => {
        return {
            ...event,
            _id: event._id.toString(),
        };
    }) as WithStringId<Event>[];
    return {
        events,
    }
}
