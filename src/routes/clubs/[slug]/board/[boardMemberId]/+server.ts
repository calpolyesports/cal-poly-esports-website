import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import * as db from '$lib/server/database';
import type { BoardMember } from '$lib/types';

export const PUT: RequestHandler = async (event) => {
	const slug = event.params.slug;
	const boardMemberId = event.params.boardMemberId;
	if (!slug) {
		return json(
			{
				message: 'Club not found'
			},
			{ status: 404 }
		);
	}
	if (boardMemberId === undefined) {
		return json(
			{
				message: 'Board member not found'
			},
			{ status: 404 }
		);
	}
	const formData = await event.request.formData();
	const name = formData.get('name') as string;
	const position = formData.get('position') as string;
	const profileImageData = formData.get('profileImage') as File | null;

	const club = await db.getClubByUrlName(slug);

	if (!club) {
		return json(
			{
				message: 'Club not found'
			},
			{ status: 404 }
		);
	}

	if (!event.locals.user?.adminFor.includes(club.urlName)) {
		return json(
			{
				message: 'You do not have permission to update members for this club'
			},
			{ status: 403 }
		);
	}

	const boardMember = club.boardMembers.find((bm) => bm.id === boardMemberId);
	if (!boardMember) {
		return json(
			{
				message: 'Board member not found'
			},
			{ status: 404 }
		);
	}

	let profileImage = boardMember.profileImage;

	if (profileImageData) {
		// TODO: This is repeated code that also happens in @database.ts somewhere.
		if (
			profileImage !=
			'https://cpsloesports.blob.core.windows.net/portraits/boards/blank_person.jpeg'
		) {
			try {
				await db.deleteFileFromAzure(profileImage, 'boards');
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

		profileImage = await db.uploadFileToBlob(profileImageData, 'boards');
	}

	const newDoc = {
		name,
		position,
		profileImage
	} as BoardMember;

	const updatedBoardMember = await db.updateBoardMember(club._id, boardMemberId, newDoc);

	return json(
		{
			member: updatedBoardMember
		},
		{ status: 200 }
	);
};

export const DELETE: RequestHandler = async (event) => {
	const slug = event.params.slug;
	const boardMemberId = event.params.boardMemberId;

	if (!slug) {
		return json(
			{
				message: 'Club not found'
			},
			{ status: 404 }
		);
	}

	if (boardMemberId === undefined) {
		return json(
			{
				message: 'Board member not found'
			},
			{ status: 404 }
		);
	}

	const club = await db.getClubByUrlName(slug);

	if (!club) {
		return json(
			{
				message: 'Club not found'
			},
			{ status: 404 }
		);
	}

	if (!event.locals.user?.adminFor.includes(club.urlName)) {
		return json(
			{
				message: 'You do not have permission to delete members for this club'
			},
			{ status: 403 }
		);
	}

	const boardMember = club.boardMembers.find((bm) => bm.id === boardMemberId);

	if (!boardMember) {
		return json(
			{
				message: 'Board member not found'
			},
			{ status: 404 }
		);
	}

	await db.deleteBoardMember(club._id, boardMemberId);

	return json(
		{
			message: 'Board member deleted'
		},
		{ status: 200 }
	);
};
