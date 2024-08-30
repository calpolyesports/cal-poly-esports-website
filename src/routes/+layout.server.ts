import * as db from '$lib/server/database';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
    const clubs = await db.getClubs();
    const adminFor = clubs.filter((club) => event.locals.user?.admin_for?.includes(club.urlName));

    return {
        clubs,
        username: event.locals.user?.username,
        adminFor,
    };
}
