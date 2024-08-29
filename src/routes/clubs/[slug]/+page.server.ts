import type { PageServerLoad } from './$types';
import { getClubByName } from '$lib/server/database';

export const load: PageServerLoad = async ({ params }) => {
    const club = await getClubByName(params.slug);

    if (!club) {
        return {
            status: 404,
            error: 'Club not found',
        };
    }

    return {
        club,
    };
};
