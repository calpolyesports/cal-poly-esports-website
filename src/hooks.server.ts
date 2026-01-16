import {
	validateSession,
	createSessionCookie,
	createBlankSessionCookie,
	SESSION_COOKIE_NAME
} from '$lib/server/auth';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(SESSION_COOKIE_NAME);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = createSessionCookie(session._id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	}

	if (!session) {
		const sessionCookie = createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
