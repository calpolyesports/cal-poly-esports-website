import * as db from '$lib/server/database';
import type { RosterMember } from '$lib/types';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

const PICTURE_CONTAINER = 'players';

interface MemberFormData {
	name: string;
	username: string;
	role: string;
}

function parseMemberFormData(body: FormData): MemberFormData | { error: string; field?: string } {
	const name = body.get('name');
	const username = body.get('username');
	const role = body.get('role');

	if (typeof name !== 'string' || !name.trim()) {
		return { error: 'Name is required', field: 'name' };
	}
	if (typeof username !== 'string' || !username.trim()) {
		return { error: 'Username is required', field: 'username' };
	}
	if (typeof role !== 'string' || !role.trim()) {
		return { error: 'Role is required', field: 'role' };
	}

	return {
		name: name.trim(),
		username: username.trim(),
		role: role.trim()
	};
}

async function handlePictureUpload(
	pictureData: File | null,
	oldPicture: string | undefined
): Promise<string | undefined> {
	if (!pictureData || pictureData.size === 0) {
		return oldPicture;
	}

	if (oldPicture) {
		try {
			await db.deleteFileFromAzure(oldPicture, PICTURE_CONTAINER);
		} catch (error) {
			console.error('Error deleting old picture from Azure:', error);
		}
	}

	return await db.uploadFileToBlob(pictureData, PICTURE_CONTAINER);
}

// This is not necessary but I'm leaving it here anyways
export const load: ServerLoad = async ({ params }) => {
	const gameId = params.gameId;
	const teamId = params.teamId;

	if (!gameId || !teamId) {
		return { game: null, team: null };
	}

	let game;
	try {
		game = await db.getRosterGameById(new ObjectId(gameId));
	} catch {
		return { game: null, team: null };
	}

	if (!game) {
		return { game: null, team: null };
	}

	const team = game.teams.find((t) => t.id === teamId);

	return {
		game: db.stringifyObjectId(game),
		team: team || null
	};
};

export const actions: Actions = {
	create: async ({ locals, request, params }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to add members' });
		}

		const gameId = params.gameId;
		const teamId = params.teamId;

		if (!gameId) {
			return fail(400, { message: 'Game ID is required' });
		}
		if (!teamId) {
			return fail(400, { message: 'Team ID is required' });
		}

		let game;
		try {
			game = await db.getRosterGameById(new ObjectId(gameId));
		} catch {
			return fail(400, { message: 'Invalid game ID' });
		}

		if (!game) {
			return fail(404, { message: 'Game not found' });
		}

		const team = game.teams.find((t) => t.id === teamId);
		if (!team) {
			return fail(404, { message: 'Team not found' });
		}

		if (!locals.user.adminFor.includes(game.adminRole)) {
			return fail(403, { message: 'You do not have permission to add members for this game' });
		}

		const body = await request.formData();
		const parsed = parseMemberFormData(body);

		if ('error' in parsed) {
			return fail(400, { message: parsed.error, field: parsed.field });
		}

		const pictureData = body.get('picture');
		const picture = await handlePictureUpload(
			pictureData instanceof File ? pictureData : null,
			undefined
		);

		const newDoc: RosterMember = {
			id: crypto.randomUUID(),
			name: parsed.name,
			username: parsed.username,
			role: parsed.role,
			picture: picture || ''
		};

		const success = await db.addRosterMember(new ObjectId(gameId), teamId, newDoc);

		if (!success) {
			return fail(500, { message: 'Failed to add member' });
		}

		const newMember = await db.getRosterMemberById(new ObjectId(gameId), teamId, newDoc.id);

		return { message: 'Member added successfully', member: newMember };
	},

	edit: async ({ locals, request, params }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to edit members' });
		}

		const gameId = params.gameId;
		const teamId = params.teamId;
		const memberId = params.memberId;

		if (!gameId) {
			return fail(400, { message: 'Game ID is required' });
		}
		if (!teamId) {
			return fail(400, { message: 'Team ID is required' });
		}
		if (!memberId) {
			return fail(400, { message: 'Member ID is required' });
		}

		let game;
		try {
			game = await db.getRosterGameById(new ObjectId(gameId));
		} catch {
			return fail(400, { message: 'Invalid game ID' });
		}

		if (!game) {
			return fail(404, { message: 'Game not found' });
		}

		const team = game.teams.find((t) => t.id === teamId);
		if (!team) {
			return fail(404, { message: 'Team not found' });
		}

		const member = team.members.find((m) => m.id === memberId);
		if (!member) {
			return fail(404, { message: 'Member not found' });
		}

		if (!locals.user.adminFor.includes(game.adminRole)) {
			return fail(403, { message: 'You do not have permission to edit members for this game' });
		}

		const body = await request.formData();
		const parsed = parseMemberFormData(body);

		if ('error' in parsed) {
			return fail(400, { message: parsed.error, field: parsed.field });
		}

		const pictureData = body.get('picture');
		const picture = await handlePictureUpload(
			pictureData instanceof File ? pictureData : null,
			member.picture
		);

		const updatedDoc: Partial<RosterMember> = {
			name: parsed.name,
			username: parsed.username,
			role: parsed.role,
			picture
		};

		const success = await db.updateRosterMember(new ObjectId(gameId), teamId, memberId, updatedDoc);

		if (!success) {
			return fail(500, { message: 'Failed to update member' });
		}

		const updatedMember = await db.getRosterMemberById(new ObjectId(gameId), teamId, memberId);

		return { message: 'Member updated successfully', member: updatedMember };
	},

	delete: async ({ locals, params }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to delete members' });
		}

		const gameId = params.gameId;
		const teamId = params.teamId;
		const memberId = params.memberId;

		if (!gameId) {
			return fail(400, { message: 'Game ID is required' });
		}
		if (!teamId) {
			return fail(400, { message: 'Team ID is required' });
		}
		if (!memberId) {
			return fail(400, { message: 'Member ID is required' });
		}

		let game;
		try {
			game = await db.getRosterGameById(new ObjectId(gameId));
		} catch {
			return fail(400, { message: 'Invalid game ID' });
		}

		if (!game) {
			return fail(404, { message: 'Game not found' });
		}

		const team = game.teams.find((t) => t.id === teamId);
		if (!team) {
			return fail(404, { message: 'Team not found' });
		}

		const member = team.members.find((m) => m.id === memberId);
		if (!member) {
			return fail(404, { message: 'Member not found' });
		}

		if (!locals.user.adminFor.includes(game.adminRole)) {
			return fail(403, { message: 'You do not have permission to delete members for this game' });
		}

		const success = await db.deleteRosterMember(new ObjectId(gameId), teamId, memberId);

		if (!success) {
			return fail(500, { message: 'Failed to delete member' });
		}

		return { message: 'Member deleted successfully' };
	}
};
