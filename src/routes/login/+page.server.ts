import { lucia } from '$lib/server/auth';
import { User } from '$lib/server/database';
import { fail } from '@sveltejs/kit';
import { verify } from '@node-rs/argon2';

import type { Actions } from '@sveltejs/kit';

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
                message: 'Invalid username'
            });
        }
        if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
            return fail(400, {
                message: 'Invalid password'
            });
        }

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return fail(400, {
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
                message: 'Invalid username or password'
            });
        }

        const session = await lucia.createSession(existingUser._id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes
        });
    }
};
