import * as db from '$lib/server/database';
import type { ServerLoad } from '@sveltejs/kit';
import type { WithStringId, Club } from '$lib/types';

export const load: ServerLoad = async (event) => {
	const clubs = (await db.getClubs()).map((club) => {
		return {
			...club,
			_id: club._id.toString()
		};
	}) as WithStringId<Club>[];
	const adminFor = clubs.filter((club) => event.locals.user?.adminFor?.includes(club.urlName));

	return {
		clubs,
		username: event.locals.user?.username,
		adminFor
	};
};
