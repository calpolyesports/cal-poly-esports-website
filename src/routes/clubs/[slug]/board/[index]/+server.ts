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
    if (index === null) {
        return json({
            message: "Board member not found"
        }, { status: 404 });
    }
    const formData = await event.request.formData();
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const profileImageData = formData.get('profileImage') as File | null;

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

    let profileImage = club.boardMembers[index].profileImage;

    if (profileImageData) {
        if(profileImage != 'https://cpsloesports.blob.core.windows.net/portraits/boards/blank_person.jpeg') {
            try {
                await db.deleteFileFromAzure(profileImage, 'boards');
            } catch (error) {
                console.error('Error deleting old picture from Azure:', error);
                return json({
                    message: "Error deleting old picture"
                }, { status: 500 });
            }
        }

        profileImage = await db.uploadFileToBlob(profileImageData, 'boards');
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
