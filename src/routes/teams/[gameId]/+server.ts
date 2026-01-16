import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import * as db from '$lib/server/database';
import { ObjectId } from 'mongodb';
import type { RosterTeam } from '$lib/types';
import { nameToId } from '$lib/server/util';

export const POST: RequestHandler = async (event) => {
	const gameId = event.params.gameId;

	if (!gameId) {
		return json(
			{
				message: 'Missing parameters'
			},
			{ status: 400 }
		);
	}

	const formData = await event.request.formData();
	const name = formData.get('name') as string;

	const game = await db.getRosterGameById(new ObjectId(gameId));

	if (!game) {
		return json(
			{
				message: 'Game not found'
			},
			{ status: 404 }
		);
	}

	if (!event.locals.user?.adminFor.includes(game.adminRole)) {
		return json(
			{
				message: 'You do not have permission to add teams for this game'
			},
			{ status: 403 }
		);
	}

	const newDoc = {
		id: nameToId(name),
		name,
		members: []
	} as RosterTeam;

	const success = await db.addRosterTeam(new ObjectId(gameId), newDoc);

	if (!success) {
		return json(
			{
				message: 'Failed to add team'
			},
			{ status: 500 }
		);
	}

	const newTeam = await db.getRosterTeamById(new ObjectId(gameId), newDoc.id);

	return json(
		{
			team: newTeam
		},
		{ status: 200 }
	);
};
