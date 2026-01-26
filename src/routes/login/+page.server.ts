import { createSession, createSessionCookie, validatePassword } from '$lib/server/auth';
import { findUserByUsername } from '$lib/server/database';
import { fail, redirect } from '@sveltejs/kit';

import type { ServerLoad, Actions } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, '/admin');
	}
	return {
		subtitle: 'Login'
	};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				username,
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				username,
				message: 'Invalid password'
			});
		}

		const existingUser = await findUserByUsername(username);
		if (!existingUser) {
			return fail(400, {
				username,
				message: 'Invalid username or password'
			});
		}

		if (!validatePassword(password, existingUser.passwordHash)) {
			return fail(400, {
				username,
				message: 'Invalid username or password'
			});
		}

		const session = await createSession(existingUser._id.toString());
		const sessionCookie = createSessionCookie(session._id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		redirect(302, '/admin');
	}
};
