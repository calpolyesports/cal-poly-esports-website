import * as db from '$lib/server/database';
import type { WithStringId, Event } from '$lib/types';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { invalidateSession, createBlankSessionCookie } from '$lib/server/auth';

export const load: ServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(302, '/login');
	}

	const events = (await db.getEvents(event.locals.user?.adminFor)).map((event) => ({
		...event,
		_id: event._id.toString()
	})) as WithStringId<Event>[];

	return {
		subtitle: 'Admin',
		events
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await invalidateSession(event.locals.session._id);
		const sessionCookie = createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		redirect(302, '/');
	}
};
