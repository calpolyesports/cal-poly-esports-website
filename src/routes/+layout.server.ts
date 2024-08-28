import * as db from '$lib/server/database';

export async function load() {
    const clubs = await db.getClubs();
    return {
        clubs,
    }
}
