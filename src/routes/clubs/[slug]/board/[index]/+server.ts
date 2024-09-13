import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import type { BoardMember } from "$lib/types";

export const PUT: RequestHandler = async (event) => {
    const slug = event.params.slug;
    const index = Number(event.params.index);

    if (!slug) {
        return json({
            message: "Club not found"
        }, { status: 404 });
    }

    if (!index) {
        return json({
            message: "Board member not found"
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
            message: "You do not have permission to update members for this club"
        }, { status: 403 });
    }

    const newDoc = {
        name,
        position,
        profileImage,
    } as BoardMember;

    const updatedBoardMember = await db.updateBoardMember(club._id, index, newDoc);

    return json({
        member: updatedBoardMember
    }, { status: 200 });
};

export const DELETE: RequestHandler = async (event) => {
    const slug = event.params.slug;
    const index = Number(event.params.index);

    if (!slug) {
        return json({
            message: "Club not found"
        }, { status: 404 });
    }

    if (!index) {
        return json({
            message: "Board member not found"
        }, { status: 404 });
    }

    const club = await db.getClubByName(slug);

    if (!club) {
        return json({
            message: "Club not found"
        }, { status: 404 });
    }

    if (!event.locals.user?.admin_for.includes(club.urlName)) {
        return json({
            message: "You do not have permission to delete members for this club"
        }, { status: 403 });
    }

    const boardMember = club.boardMembers[index];

    if (!boardMember) {
        return json({
            message: "Board member not found"
        }, { status: 404 });
    }

    await db.deleteBoardMember(club._id, index);

    return json({
        message: "Board member deleted"
    }, { status: 200 });
};
