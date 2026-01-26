import type { PageServerLoad } from './$types';
import { getClubByUrlName } from '$lib/server/database';
import type { WithStringId, Club } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const club = await getClubByUrlName(params.slug);

	if (!club) {
		return {
			status: 404,
			error: 'Club not found'
		};
	}

	return {
		club: {
			...club,
			_id: club._id.toString()
		} as WithStringId<Club>
	};
};
