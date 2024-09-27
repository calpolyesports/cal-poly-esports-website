import { redirect } from '@sveltejs/kit';

import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
    redirect(302, "https://www.instagram.com/calpolyesports/");
};
