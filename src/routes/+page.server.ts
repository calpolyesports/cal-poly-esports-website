import * as db from '$lib/server/database';

export function load() {
    return {
        articles: db.getArticles(),
    }
}
