import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as db from '$lib/server/database';
import { ObjectId } from 'mongodb';

export const PATCH: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'You must be logged in to update event times' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { id, start, end } = body;

		if (!id || !start || !end) {
			return json({ error: 'Event ID, start time, and end time are required' }, { status: 400 });
		}

		const eventId = new ObjectId(id);
		const startDate = new Date(start);
		const endDate = new Date(end);

		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			return json({ error: 'Invalid date format' }, { status: 400 });
		}

		if (startDate >= endDate) {
			return json({ error: 'End date must be after start date' }, { status: 400 });
		}

		const oldEvent = await db.getEventById(eventId);
		if (!oldEvent) {
			return json({ error: 'Event not found' }, { status: 404 });
		}

		if (!locals.user.adminFor.includes(oldEvent.club)) {
			return json({ error: 'You do not have permission to update this event' }, { status: 403 });
		}

		const success = await db.updateEvent(eventId, { start: startDate, end: endDate });

		if (!success) {
			return json({ error: 'Failed to update event times' }, { status: 500 });
		}

		return json({ message: 'Event times updated successfully' });
	} catch (error) {
		console.error('Error updating event times:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
