import * as db from '$lib/server/database';
import type { RosterTeam } from '$lib/types';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { nameToId } from '$lib/server/util';

interface TeamFormData {
	name: string;
}

function parseTeamFormData(body: FormData): TeamFormData | { error: string; field?: string } {
	const name = body.get('name');

	if (typeof name !== 'string' || !name.trim()) {
		return { error: 'Team name is required', field: 'name' };
	}

	return { name: name.trim() };
}

// This is not necessary but I'm leaving it here anyways
export const load: ServerLoad = async ({ params }) => {
	const gameId = params.gameId;
	if (!gameId) {
		return { game: null };
	}

	let game;
	try {
		game = await db.getRosterGameById(new ObjectId(gameId));
	} catch {
		return { game: null };
	}

	return {
		game: game
			? {
					...game,
					_id: game._id.toString()
				}
			: null
	};
};

export const actions: Actions = {
	create: async ({ locals, request, params }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to add teams' });
		}

		const gameId = params.gameId;
		if (!gameId) {
			return fail(400, { message: 'Game ID is required' });
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

		if (!locals.user.adminFor.includes(game.adminRole)) {
			return fail(403, { message: 'You do not have permission to add teams for this game' });
		}

		const body = await request.formData();
		const parsed = parseTeamFormData(body);

		if ('error' in parsed) {
			return fail(400, { message: parsed.error, field: parsed.field });
		}

		const newDoc: RosterTeam = {
			id: nameToId(parsed.name),
			name: parsed.name,
			members: []
		};

		const success = await db.addRosterTeam(new ObjectId(gameId), newDoc);

		if (!success) {
			return fail(500, { message: 'Failed to add team' });
		}

		const newTeam = await db.getRosterTeamById(new ObjectId(gameId), newDoc.id);

		return { message: 'Team added successfully', team: newTeam };
	},

	edit: async ({ locals, request, params }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to edit teams' });
		}

		const gameId = params.gameId;

		if (!gameId) {
			return fail(400, { message: 'Game ID is required' });
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

		if (!locals.user.adminFor.includes(game.adminRole)) {
			return fail(403, { message: 'You do not have permission to edit teams for this game' });
		}

		const body = await request.formData();
		const parsed = parseTeamFormData(body);

		if ('error' in parsed) {
			return fail(400, { message: parsed.error, field: parsed.field });
		}

		const teamId = body.get('id') as string;
		if (!teamId) {
			return fail(400, { message: 'Team ID is required' });
		}

		const team = game.teams.find((t) => t.id === teamId);
		if (!team) {
			return fail(404, { message: 'Team not found' });
		}

		const updatedDoc: Partial<RosterTeam> = {
			name: parsed.name
		};

		const success = await db.updateRosterTeam(new ObjectId(gameId), teamId, updatedDoc);

		if (!success) {
			return fail(500, { message: 'Failed to update team' });
		}

		const updatedTeam = await db.getRosterTeamById(new ObjectId(gameId), teamId);

		return { message: 'Team updated successfully', team: updatedTeam };
	},

	delete: async ({ locals, request, params }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to delete teams' });
		}

		const gameId = params.gameId;

		if (!gameId) {
			return fail(400, { message: 'Game ID is required' });
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

		const body = await request.formData();

		const teamId = body.get('id') as string;
		if (!teamId) {
			return fail(400, { message: 'Team ID is required' });
		}

		const team = game.teams.find((t) => t.id === teamId);
		if (!team) {
			return fail(404, { message: 'Team not found' });
		}

		if (!locals.user.adminFor.includes(game.adminRole)) {
			return fail(403, { message: 'You do not have permission to delete teams for this game' });
		}

		const success = await db.deleteRosterTeam(new ObjectId(gameId), teamId);

		if (!success) {
			return fail(500, { message: 'Failed to delete team' });
		}

		return { message: 'Team deleted successfully' };
	}
};
