import { lucia } from '$lib/server/auth';
import { UserModel } from '$lib/server/models';
import { fail, redirect } from '@sveltejs/kit';
import { verify, hash } from '@node-rs/argon2';
import { ObjectId } from 'mongodb';

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

		const existingUser = await UserModel.findOne({ username });
		if (!existingUser) {
			return fail(400, {
				username,
				message: 'Invalid username or password'
			});
		}

		const passwordIsValid = await verify(existingUser.password_hash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!passwordIsValid) {
			return fail(400, {
				username,
				message: 'Invalid username or password'
			});
		}

		console.log(
			await hash('flipreset', {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			})
		);

		const session = await lucia.createSession(existingUser._id.toString(), {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/admin');
	}
};
