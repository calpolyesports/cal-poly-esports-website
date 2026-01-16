import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import * as db from '$lib/server/database';
import type { RosterMember } from '$lib/types';
import { ObjectId } from 'mongodb';

export const PUT: RequestHandler = async (event) => {
	const gameId = event.params.gameId;
	const teamId = event.params.teamId;
	const memberId = event.params.memberId;

	if (!gameId || !teamId || !memberId) {
		return json(
			{
				message: 'Missing parameters'
			},
			{ status: 400 }
		);
	}

	const formData = await event.request.formData();
	const name = formData.get('name') as string;
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

	const member = game.teams
		.find((team) => team.id === teamId)
		?.members.find((m) => m.id === memberId);
	if (!member) {
		return json(
			{
				message: 'Member not found'
			},
			{ status: 404 }
		);
	}

	if (!event.locals.user?.adminFor.includes(game.adminRole)) {
		return json(
			{
				message: 'You do not have permission to update members for this game'
			},
			{ status: 403 }
		);
	}

	let picture = member.picture;

	if (pictureData) {
		if (member.picture) {
			try {
				await db.deleteFileFromAzure(member.picture, 'players');
			} catch (error) {
				console.error('Error deleting old picture from Azure:', error);
				return json(
					{
						message: 'Error deleting old picture'
					},
					{ status: 500 }
				);
			}
		}

		picture = await db.uploadFileToBlob(pictureData, 'players');
	}

	const newDoc = {
		name,
		username,
		role,
		picture
	} as unknown as RosterMember;

	await db.updateRosterMember(new ObjectId(memberId), teamId, memberId, newDoc);

	const newMember = await db.getRosterMemberById(new ObjectId(memberId), teamId, memberId);

	return json(
		{
			member: newMember
		},
		{ status: 200 }
	);
};

export const DELETE: RequestHandler = async (event) => {
	const gameId = event.params.gameId;
	const teamId = event.params.teamId;
	const memberId = event.params.memberId;

	if (!gameId || !teamId || !memberId) {
		return json(
			{
				message: 'Missing parameters'
			},
			{ status: 400 }
		);
	}

	const member = await db.getRosterMemberById(new ObjectId(memberId), teamId, memberId);
	if (!member) {
		return json(
			{
				message: 'Member not found'
			},
			{ status: 404 }
		);
	}

	await db.deleteRosterMember(new ObjectId(memberId), teamId, memberId);

	return new Response(null, { status: 204 });
};
