import * as db from '$lib/server/database';
import type { Article } from '$lib/types';

export async function load() {
    const articles = (await db.getArticles()).map((article) => {
        return {
            ...article,
            _id: article._id.toString(),
        };
    }) as Article[];
    return {
        articles,
    }
}
