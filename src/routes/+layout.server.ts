import * as db from '$lib/server/database';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
    const clubs = await db.getClubs();

    return {
        clubs,
        username: event.locals.user?.username,
    };
}
