import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import type { Club } from "$lib/types";

export const PUT: RequestHandler = async (event) => {
    const clubUrlName = event.params.slug;
    const body = await event.request.json();
    const newAbout = body.aboutText;

    if (!clubUrlName) {
        return json({
            message: "Missing slug"
        }, { status: 400 });
    }

    const oldClub = await db.getClubByName(clubUrlName);

    if (!oldClub) {
        return json({
            message: "Club not found"
        }, { status: 404 });
    }

    if (!event.locals.user?.admin_for.includes(oldClub.urlName)) {
        return json({
            message: "You do not have permission to update this club",
        }, { status: 403 });
    }

    const newDoc = {
        aboutText: newAbout,
        aboutHtml: '',
    } as Club;

    await db.updateClub(oldClub._id, newDoc);

    const newClub = await db.getClubByName(clubUrlName);

    return json({
        club: newClub,
    }, { status: 200 });
};
