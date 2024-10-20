import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import type { Event } from "$lib/types";

export const POST: RequestHandler = async (event) => {
    const body = await event.request.json();
    const title = body.title;
    const start = body.start;
    const end = body.end;
    const club = body.club;
    const location = body.location;
    const locationLink = body.locationLink;
    const description = body.description;
    const usesLab = body.usesLab;
    const showPublic = body.showPublic;
    
    if (!event.locals.user?.admin_for.includes(club)) {
        return json({
            message: "You do not have permission to add events for this club"
        }, { status: 403 });
    }

    const newDoc = {
        title,
        start: new Date(start),
        end: new Date(end),
        club,
        location,
        locationLink,
        description,
        usesLab: usesLab ?? false,
        showPublic: showPublic ?? false,
    } as Event;

    const newId = await db.addEvent(newDoc);

    if (!newId) {
        return json({
            message: "Failed to add event"
        }, { status: 500 });
    }

    const newEvent = await db.getEventById(newId, event.locals.user?.admin_for);

    return json({
        event: newEvent
    }, { status: 200 });
};
