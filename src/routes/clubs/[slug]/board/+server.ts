import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import type { BoardMember } from "$lib/types";

export const POST: RequestHandler = async (event) => {
    const slug = event.params.slug;

    if (!slug) {
        return json({
            message: "Club not found"
        }, { status: 404 });
    }
    
    const body = await event.request.json();
    const name = body.name;
    const position = body.position;
    const profileImage = body.profileImage;

    const club = await db.getClubByName(slug);

    if (!club) {
        return json({
            message: "Club not found"
        }, { status: 404 });
    }

    if (!event.locals.user?.admin_for.includes(club.urlName)) {
        return json({
            message: "You do not have permission to add members for this club"
        }, { status: 403 });
    }

    const newDoc = {
        name,
        position,
        profileImage,
    } as BoardMember;

    const newBoardMember = await db.addBoardMember(club._id, newDoc);

    return json({
        member: newBoardMember
    }, { status: 200 });
};
