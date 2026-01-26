import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (_event) => {
	return {
		subtitle: 'About'
	};
};
