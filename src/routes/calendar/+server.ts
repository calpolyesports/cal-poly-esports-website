import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";

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
