import * as db from '$lib/server/database';

export async function load() {
    const articles = await db.getArticles();
    return {
        articles,
    }
}
