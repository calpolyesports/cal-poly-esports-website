import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import type { Event } from "$lib/types";

export const POST: RequestHandler = async (event) => {
    const body = await event.request.json();
    const { title, start, end, club, location, locationLink, description, showPublic } = body;

    // Ensure the user has permission to add events for the specified club
    if (!event.locals.user?.admin_for.includes(club)) {
        return json({
            message: "You do not have permission to add events for this club"
        }, { status: 403 });
    }

    // Construct the new event with `usesLab = true` and `showPublic`
    const newDoc = {
        title,
        start: new Date(start),
        end: new Date(end),
        club,
        location: location ?? null,
        locationLink: locationLink ?? null,
        description: description ?? null,
        usesLab: true, // Always set to true for admin events
        showPublic: showPublic ?? false, // Set based on admin input
    } as Event;

    // Add the event to the database
    const newId = await db.addEvent(newDoc);

    if (!newId) {
        return json({
            message: "Failed to add event"
        }, { status: 500 });
    }

    // Fetch and return the newly created event
    const newEvent = await db.getEventById(newId, event.locals.user?.admin_for);

    return json({
        event: newEvent
    }, { status: 200 });
};
