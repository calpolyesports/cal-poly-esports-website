import * as db from '$lib/server/database';

export function load() {
    return {
        blogs: db.getBlogs(),
    }
}
