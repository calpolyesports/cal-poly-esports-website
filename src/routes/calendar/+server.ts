import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import type { EventDoc } from "$lib/server/models";
import { verifyString, verifyDate, verifyClubPermissions } from "$lib/util";

export const POST: RequestHandler = async (event) => {
    const body = await event.request.json();
    const title = body.title;
    const start = body.start;
    const end = body.end;
    const club = body.club;

    const titleVerification = verifyString(title, 1, 255);
    if (titleVerification) {
        return json({
            message: `Invalid title: ${titleVerification}`
        }, { status: 400 });
    }

    const startVerification = verifyDate(start);
    if (startVerification) {
        return json({
            message: `Invalid start date: ${startVerification}`
        }, { status: 400 });
    }

    const endVerification = verifyDate(end);
    if (endVerification) {
        return json({
            message: `Invalid end date: ${endVerification}`
        }, { status: 400 });
    }

    const clubPermission = verifyClubPermissions([club], event.locals.user ?? undefined);
    if (clubPermission) {
        return json({
            message: clubPermission,
        }, { status: 403 });
    }

    const newDoc = {
        title,
        start: new Date(start),
        end: new Date(end),
        club
    } as EventDoc;

    const newId = await db.addEvent(newDoc);

    if (!newId) {
        return json({
            message: "Failed to add event"
        }, { status: 500 });
    }

    const newEvent = await db.getEventById(newId.toString(), event.locals.user?.admin_for);

    return json({
        event: newEvent
    }, { status: 200 });
}
