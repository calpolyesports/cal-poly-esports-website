import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import type { EventDoc } from "$lib/server/models";
import { Event } from "$lib/types";
import { verifyString, verifyDate, verifyClubPermissions } from "$lib/util";

export const PUT: RequestHandler = async (event) => {
    const id = event.params.id;
    const body = await event.request.json();
    const newTitle = body.title;
    const newStart = body.start;
    const newEnd = body.end;
    const newClub = body.club;

    const verifyId = verifyString(id, 1, 255);
    if (verifyId) {
        return json({
            message: `Invalid id: ${verifyId}`
        }, { status: 400 });
    }

    const oldEvent = await db.getEventById(id!);

    if (!oldEvent) {
        return json({
            message: "Event not found"
        }, { status: 404 });
    }

    const titleVerification = verifyString(newTitle, 1, 255);
    if (titleVerification) {
        return json({
            message: `Invalid title: ${titleVerification}`
        }, { status: 400 });
    }

    const startVerification = verifyDate(newStart);
    if (startVerification) {
        return json({
            message: `Invalid start date: ${startVerification}`
        }, { status: 400 });
    }

    const endVerification = verifyDate(newEnd);
    if (endVerification) {
        return json({
            message: `Invalid end date: ${endVerification}`
        }, { status: 400 });
    }

    const clubPermission = verifyClubPermissions([newClub], event.locals.user ?? undefined);
    if (clubPermission) {
        return json({
            message: clubPermission,
        }, { status: 403 });
    }

    const newDoc = {
        title: newTitle,
        start: new Date(newStart),
        end: new Date(newEnd),
        club: newClub
    } as EventDoc;

    const success = await db.updateEvent(oldEvent.id, newDoc);

    if (!success) {
        return json({
            message: "Failed to update event"
        }, { status: 500 });
    }

    const newEvent = await db.getEventById(oldEvent.id, event.locals.user?.admin_for);

    return json({
        event: newEvent,
    }, { status: 200 });
}

export const DELETE: RequestHandler = async (event) => {
    const id = event.params.id;

    const verifyId = verifyString(id, 1, 255);
    if (verifyId) {
        return json({
            message: `Invalid id: ${verifyId}`
        }, { status: 400 });
    }

    const oldEvent = await db.getEventById(id!);

    if (!oldEvent) {
        return json({
            message: "Event not found"
        }, { status: 404 });
    }

    const clubPermission = verifyClubPermissions([oldEvent.club], event.locals.user ?? undefined);
    if (clubPermission) {
        return json({
            status: 403,
            message: clubPermission,
        });
    }

    const success = await db.deleteEvent(id!);

    if (!success) {
        return json({
            message: "Failed to delete event"
        }, { status: 500 });
    }

    return new Response(null, { status: 204 });
}
