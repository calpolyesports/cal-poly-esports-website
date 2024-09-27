import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import type { Event } from "$lib/types";
import { ObjectId } from "mongodb";

export const PUT: RequestHandler = async (event) => {
    const id = event.params.id;
    const body = await event.request.json();
    const newTitle = body.title;
    const newStart = body.start;
    const newEnd = body.end;
    const newClub = body.club;
    const newLocation = body.location;
    const newLocationLink = body.locationLink;
    const newDescription = body.description

    if (!id) {
        return json({
            message: "Missing id"
        }, { status: 400 });
    }

    const oldEvent = await db.getEventById(new ObjectId(id));

    if (!oldEvent) {
        return json({
            message: "Event not found"
        }, { status: 404 });
    }

    if (!event.locals.user?.admin_for.includes(newClub) ||
        !event.locals.user?.admin_for.includes(oldEvent?.club)) {
        return json({
            message: "You do not have permission to update events for this club",
        }, { status: 403 });
    }

    const newDoc = {
        title: newTitle,
        start: new Date(newStart),
        end: new Date(newEnd),
        club: newClub,
        location: newLocation ?? null,
        locationLink: newLocationLink ?? null,
        description: newDescription ?? null,
    } as Event;

    await db.updateEvent(new ObjectId(id), newDoc);

    const newEvent = await db.getEventById(oldEvent._id, event.locals.user?.admin_for);

    return json({
        event: newEvent,
    }, { status: 200 });
}

export const DELETE: RequestHandler = async (event) => {
    const id = event.params.id;

    const oldEvent = await db.getEventById(new ObjectId(id!));

    if (!oldEvent) {
        return json({
            message: "Event not found"
        }, { status: 404 });
    }

    if (!event.locals.user?.admin_for.includes(oldEvent.club)) {
        return json({
            status: 403,
            message: "You do not have permission to delete events for this club",
        });
    }

    await db.deleteEvent(new ObjectId(id!));

    return new Response(null, { status: 204 });
}
