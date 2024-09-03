import * as db from '$lib/server/database';

import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
    const events = await db.getEvents(event.locals.user?.admin_for);
    return {
        events: events,
    }
}
