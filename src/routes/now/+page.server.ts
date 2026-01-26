import { redirect } from '@sveltejs/kit';

import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (_event) => {
	redirect(302, 'https://now.calpoly.edu/organization/esports');
};
