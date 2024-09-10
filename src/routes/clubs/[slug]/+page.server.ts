import type { PageServerLoad } from './$types';
import { getClubByName } from '$lib/server/database';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
    const club = await getClubByName(params.slug);

    if (!club) {
        return {
            status: 404,
            error: 'Club not found',
        };
    }
    
    club.aboutText = marked.parse(club.aboutText);
    club.aboutText = DOMPurify.sanitize(club.aboutText);

    return {
        club: {
            ...club,
            _id: club._id.toString(),
        },
    };
};
