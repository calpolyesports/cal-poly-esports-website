import {
	createSession as dbCreateSession,
	getSessionById,
	deleteSession,
	getUserById
} from '$lib/server/database';
import type { Session } from '$lib/server/types';
import type { User } from '$lib/types';
import { verify, hash } from '@node-rs/argon2';
import type { Cookies } from '@sveltejs/kit';

const SESSION_COOKIE_NAME = 'session_id';
const SESSION_EXPIRY_DAYS = 30;
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export interface ValidationResult {
	session: Session | null;
	user: User | null;
}

export async function createSession(userId: string): Promise<Session> {
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);
	const id = await dbCreateSession(userId, expiresAt);
	return {
		_id: id,
		userId,
		expiresAt,
		fresh: true
	};
}

export async function validateSession(sessionId: string): Promise<ValidationResult> {
	const session = await getSessionById(sessionId);
	if (!session) {
		return { session: null, user: null };
	}
	const now = new Date();
	const isExpired = session.expiresAt < now;
	if (isExpired) {
		await deleteSession(sessionId);
		return { session: null, user: null };
	}
	const user = await getUserById(session.userId);
	if (!user) {
		await deleteSession(sessionId);
		return { session: null, user: null };
	}
	const isFresh = session.expiresAt.getTime() - now.getTime() > SESSION_EXPIRY_MS / 2;
	return {
		session: {
			_id: session._id,
			userId: session.userId,
			expiresAt: session.expiresAt,
			fresh: isFresh
		},
		user: {
			_id: user._id,
			username: user.username,
			adminFor: user.adminFor
		}
	};
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await deleteSession(sessionId);
}

export interface SessionCookie {
	name: string;
	value: string;
	attributes: {
		path: string;
		httpOnly: boolean;
		sameSite: 'lax' | 'strict' | 'none';
		secure: boolean;
		expires?: Date;
		maxAge?: number;
	};
}

export function createSessionCookie(sessionId: string): SessionCookie {
	return {
		name: SESSION_COOKIE_NAME,
		value: sessionId,
		attributes: {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
			expires: new Date(Date.now() + SESSION_EXPIRY_MS),
			maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60
		}
	};
}

export function createBlankSessionCookie(): SessionCookie {
	return {
		name: SESSION_COOKIE_NAME,
		value: '',
		attributes: {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
			expires: new Date(0),
			maxAge: 0
		}
	};
}

export function getSessionIdFromCookies(cookies: Cookies): string | undefined {
	return cookies.get(SESSION_COOKIE_NAME);
}

export async function validatePassword(password: string, hash: string): Promise<boolean> {
	return await verify(hash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
}

export async function hashPassword(password: string): Promise<string> {
	return await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
}

export { SESSION_COOKIE_NAME };
