import * as db from '$lib/server/database';
import type { WithStringId, Event } from '$lib/types';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

interface EventFormData {
	title: string;
	start: Date;
	end: Date;
	club: string;
	location: string;
	locationLink: string | undefined;
	description: string | undefined;
	usesLab: boolean;
	showPublic: boolean;
}

function parseEventFormData(body: FormData): EventFormData | { error: string; field?: string } {
	const title = body.get('title');
	const start = body.get('start');
	const end = body.get('end');
	const club = body.get('club');
	const location = body.get('location');
	const locationLink = body.get('locationLink');
	const description = body.get('description');
	const usesLab = body.get('usesLab') === 'on';
	const showPublic = body.get('showPublic') === 'on';

	if (typeof title !== 'string' || !title.trim()) {
		return { error: 'Title is required', field: 'title' };
	}
	if (typeof start !== 'string' || !start.trim()) {
		return { error: 'Start date is required', field: 'start' };
	}
	if (typeof end !== 'string' || !end.trim()) {
		return { error: 'End date is required', field: 'end' };
	}
	if (typeof club !== 'string' || !club.trim()) {
		return { error: 'Club is required', field: 'club' };
	}
	if (typeof location !== 'string' || !club.trim()) {
		return { error: 'Location is required', field: 'location' };
	}

	const startDate = new Date(start);
	const endDate = new Date(end);

	if (isNaN(startDate.getTime())) {
		return { error: 'Invalid start date format', field: 'start' };
	}
	if (isNaN(endDate.getTime())) {
		return { error: 'Invalid end date format', field: 'end' };
	}
	if (startDate >= endDate) {
		return { error: 'End date must be after start date', field: 'end' };
	}

	return {
		title: title.trim(),
		start: startDate,
		end: endDate,
		club: club.trim(),
		location: location.trim(),
		locationLink:
			typeof locationLink === 'string' && locationLink.trim() ? locationLink.trim() : undefined,
		description:
			typeof description === 'string' && description.trim() ? description.trim() : undefined,
		usesLab,
		showPublic
	};
}

function checkClubAccess(user: { adminFor: string[] }, club: string): boolean {
	return user.adminFor.includes(club);
}

export const load: ServerLoad = async (event) => {
	const publicOnly = (event.locals.user?.adminFor.length || 0) === 0;

	const events = (await db.getEvents(event.locals.user?.adminFor, publicOnly)).map(
		db.stringifyObjectId
	) as WithStringId<Event>[];

	return {
		subtitle: 'Calendar',
		events
	};
};

export const actions: Actions = {
	create: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to create events' });
		}

		const body = await request.formData();
		const parsed = parseEventFormData(body);

		if ('error' in parsed) {
			return fail(400, { message: parsed.error, field: parsed.field });
		}

		if (!checkClubAccess(locals.user, parsed.club)) {
			return fail(403, { message: 'You do not have permission to add events for this club' });
		}

		const newId = await db.addEvent(parsed);

		if (!newId) {
			return fail(500, { message: 'Failed to add event' });
		}

		const newEvent = await db.getEventById(newId, locals.user.adminFor);
		if (!newEvent) {
			return fail(500, { message: 'Event created but could not be retrieved' });
		}

		return { event: db.stringifyObjectId(newEvent) };
	},

	edit: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to edit events' });
		}

		const body = await request.formData();
		const id = body.get('id');

		if (typeof id !== 'string' || !id.trim()) {
			return fail(400, { message: 'Event ID is required', field: 'id' });
		}

		const parsed = parseEventFormData(body);
		if ('error' in parsed) {
			return fail(400, { message: parsed.error, field: parsed.field });
		}

		let oldEvent = await db.getEventById(new ObjectId(id));
		try {
			oldEvent = await db.getEventById(new ObjectId(id));
		} catch {
			return fail(400, { message: 'Invalid event ID' });
		}

		if (!oldEvent) {
			return fail(404, { message: 'Event not found' });
		}

		if (
			!checkClubAccess(locals.user, parsed.club) ||
			!checkClubAccess(locals.user, oldEvent.club)
		) {
			return fail(403, { message: 'You do not have permission to update events for this club' });
		}

		const success = await db.updateEvent(oldEvent._id, parsed);

		if (!success) {
			return fail(500, { message: 'Failed to update event' });
		}

		const updatedEvent = await db.getEventById(oldEvent._id, locals.user.adminFor);
		if (!updatedEvent) {
			return fail(500, { message: 'Event updated but could not be retrieved' });
		}

		return { event: db.stringifyObjectId(updatedEvent) };
	},

	delete: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to delete events' });
		}

		const body = await request.formData();
		const id = body.get('id');

		if (typeof id !== 'string' || !id.trim()) {
			return fail(400, { message: 'Event ID is required', field: 'id' });
		}

		let eventId: ObjectId;
		try {
			eventId = new ObjectId(id);
		} catch {
			return fail(400, { message: 'Invalid event ID' });
		}

		const oldEvent = await db.getEventById(eventId);

		if (!oldEvent) {
			return fail(404, { message: 'Event not found' });
		}

		if (!checkClubAccess(locals.user, oldEvent.club)) {
			return fail(403, { message: 'You do not have permission to delete events for this club' });
		}

		const success = await db.deleteEvent(eventId);

		if (!success) {
			return fail(500, { message: 'Failed to delete event' });
		}

		return { message: 'Event deleted successfully' };
	}
};
