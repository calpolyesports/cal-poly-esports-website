import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import type { EventDoc } from "$lib/models";

export const POST: RequestHandler = async (event) => {
    const body = await event.request.json();
    const title = body.title;
    const allDay = body.allDay;
    const start = body.start;
    const end = body.end;
    const club = body.club;

    if (
        typeof title !== "string" ||
        title.length < 1 ||
        title.length > 255
    ) {
        return json({
            status: 400,
            message: "Invalid title"
        });
    }

    if (
        typeof allDay !== "boolean"
    ) {
        return json({
            status: 400,
            message: "Invalid allDay"
        });
    }

    if (
        typeof start !== "string" ||
        typeof end !== "string"
    ) {
        return json({
            status: 400,
            message: "Invalid date"
        });
    }

    if (
        typeof club !== "string" ||
        club.length < 1 ||
        club.length > 255
    ) {
        return json({
            status: 400,
            message: "Invalid club"
        });
    }

    if (!event.locals.user?.admin_for.includes(club)) {
        return json({
            status: 403,
            message: "You do not have permission to add events for this club"
        });
    }

    const newDoc = {
        title,
        allDay,
        start: new Date(start),
        end: new Date(end),
        club
    } as EventDoc;

    const newId = await db.addEvent(newDoc);

    if (!newId) {
        return json({
            status: 500,
            message: "Failed to add event"
        });
    }

    const newEvent = await db.getEventById(newId.toString());

    return json({
        status: 200,
        event: newEvent
    });
}

export const PUT: RequestHandler = async (event) => {
    const body = await event.request.json();
    const id = body.id;
    const newStart = body.start;
    const newEnd = body.end;
    
    const oldEvent = await db.getEventById(id);

    if (!oldEvent) {
        return json({
            status: 404,
            message: "Event not found"
        });
    }

    if (!event.locals.user?.admin_for.includes(oldEvent.club)) {
        return json({
            status: 403,
            message: "You do not have permission to update events for this club"
        });
    }

    if (
        typeof newStart !== "string" ||
        typeof newEnd !== "string"
    ) {
        return json({
            status: 400,
            message: "Invalid date"
        });
    }

    oldEvent.start = new Date(newStart);
    oldEvent.end = new Date(newEnd);

    const success = await db.updateEvent(oldEvent);

    if (!success) {
        return json({
            status: 500,
            message: "Failed to update event"
        });
    }

    return json({
        status: 200,
        message: "Event updated"
    });
}

export const DELETE: RequestHandler = async (event) => {
    const body = await event.request.json();
    const id = body.id;

    const currentEvent = await db.getEventById(id);

    if (!currentEvent) {
        return json({
            status: 404,
            message: "Event not found"
        });
    }

    if (!event.locals.user?.admin_for.includes(currentEvent.club)) {
        return json({
            status: 403,
            message: "You do not have permission to delete events for this club"
        });
    }

    const success = await db.deleteEvent(id);

    if (!success) {
        return json({
            status: 500,
            message: "Failed to delete event"
        });
    }

    return json({
        status: 200,
        message: "Event deleted"
    });
}
