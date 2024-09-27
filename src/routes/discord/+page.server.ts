import { redirect } from '@sveltejs/kit';

import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
    redirect(302, "https://discord.gg/sd6bUz7");
};
