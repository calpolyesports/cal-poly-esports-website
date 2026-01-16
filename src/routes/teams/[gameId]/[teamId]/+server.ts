import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import * as db from '$lib/server/database';
import { ObjectId } from 'mongodb';
import type { RosterTeam, RosterMember } from '$lib/types';
import { nameToId } from '$lib/server/util';

export const POST: RequestHandler = async (event) => {
	const gameId = event.params.gameId;
	const teamId = event.params.teamId;

	if (!gameId || !teamId) {
		return json(
			{
				message: 'Missing parameters'
			},
			{ status: 400 }
		);
	}

	const formData = await event.request.formData();
	const name = formData.get('name') as string;
	const id = nameToId(name);
	const username = formData.get('username') as string;
	const role = formData.get('role') as string;
	const pictureData = formData.get('picture') as File | null;

	const game = await db.getRosterGameById(new ObjectId(gameId));

	if (!game) {
		return json(
			{
				message: 'Game not found'
			},
			{ status: 404 }
		);
	}

	const team = game.teams.find((team) => team.id === teamId);

	if (!team) {
		return json(
			{
				message: 'Team not found'
			},
			{ status: 404 }
		);
	}

	if (!event.locals.user?.adminFor.includes(game.adminRole)) {
		return json(
			{
				message: 'You do not have permission to add members for this game'
			},
			{ status: 403 }
		);
	}

	let picture = null;

	if (pictureData) {
		picture = await db.uploadFileToBlob(pictureData, 'players');
	}

	const newDoc = {
		id,
		name,
		username,
		role,
		picture
	} as RosterMember;

	const success = await db.addRosterMember(new ObjectId(gameId), teamId, newDoc);

	if (!success) {
		return json(
			{
				message: 'Failed to add member'
			},
			{ status: 500 }
		);
	}

	const newMember = await db.getRosterMemberById(new ObjectId(gameId), teamId, id);

	return json(
		{
			member: newMember
		},
		{ status: 200 }
	);
};

export const PUT: RequestHandler = async (event) => {
	const gameId = event.params.gameId;
	const teamId = event.params.teamId;

	if (!gameId || !teamId) {
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
				message: 'You do not have permission to update teams for this game'
			},
			{ status: 403 }
		);
	}

	const newDoc = {
		name
		// purposefully omit members
	} as RosterTeam;

	await db.updateRosterTeam(new ObjectId(gameId), teamId, newDoc);

	const newTeam = await db.getRosterTeamById(new ObjectId(gameId), teamId);

	return json(
		{
			team: newTeam
		},
		{ status: 200 }
	);
};

export const DELETE: RequestHandler = async (event) => {
	const gameId = event.params.gameId;
	const teamId = event.params.teamId;

	if (!gameId || !teamId) {
		return json(
			{
				message: 'Missing parameters'
			},
			{ status: 400 }
		);
	}

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
				message: 'You do not have permission to delete teams for this game'
			},
			{ status: 403 }
		);
	}

	await db.deleteRosterTeam(new ObjectId(gameId), teamId);

	return json(
		{
			message: 'Team deleted'
		},
		{ status: 200 }
	);
};
