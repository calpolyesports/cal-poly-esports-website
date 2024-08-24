import * as db from '$lib/server/database';

export async function load() {
    const games = await db.getRosters();
    return {
        games,
    }
}
