import * as db from '$lib/server/database';
import { nameToId } from '$lib/server/util';
import type { BoardMember } from '$lib/types';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

const PROFILE_CONTAINER = 'portraits';

interface BoardMemberFormData {
	name: string;
	position: string;
	profileImage?: string;
}

function parseBoardMemberFormData(
	body: FormData
): BoardMemberFormData | { error: string; field?: string } {
	const name = body.get('name');
	const position = body.get('position');
	const profileImageData = body.get('profileImage');

	if (typeof name !== 'string' || !name.trim()) {
		return { error: 'Name is required', field: 'name' };
	}
	if (typeof position !== 'string' || !position.trim()) {
		return { error: 'Position is required', field: 'position' };
	}

	let profileImage: string | undefined;

	if (profileImageData && profileImageData instanceof File && profileImageData.size > 0) {
		profileImage = profileImageData.name;
	}

	return {
		name: name.trim(),
		position: position.trim(),
		profileImage
	};
}

export const load: ServerLoad = async ({ params }) => {
	const slug = params.slug;
	if (!slug) {
		return { club: null };
	}
	const club = await db.getClubByUrlName(slug);
	return {
		club: club
			? {
					...club,
					_id: club._id.toString()
				}
			: null
	};
};

export const actions: Actions = {
	create: async ({ locals, request, params }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to add board members' });
		}

		const slug = params.slug;
		if (!slug) {
			return fail(404, { message: 'Club not found' });
		}

		const club = await db.getClubByUrlName(slug);
		if (!club) {
			return fail(404, { message: 'Club not found' });
		}

		if (!locals.user.adminFor.includes(club.urlName)) {
			return fail(403, { message: 'You do not have permission to add members for this club' });
		}

		const body = await request.formData();
		const parsed = parseBoardMemberFormData(body);

		if ('error' in parsed) {
			return fail(400, { message: parsed.error, field: parsed.field });
		}

		const profileImageData = body.get('profileImage');
		const profileImageUrl = await db.trySwapImage(
			profileImageData instanceof File ? profileImageData : null,
			undefined,
			PROFILE_CONTAINER
		);

		const newDoc: BoardMember = {
			id: nameToId(parsed.name),
			name: parsed.name,
			position: parsed.position,
			profileImage: profileImageUrl
		};

		const success = await db.addBoardMember(club._id, newDoc);

		if (!success) {
			return fail(500, { message: 'Failed to add board member' });
		}

		return { message: 'Board member added successfully', member: newDoc };
	},

	edit: async ({ locals, request, params }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to edit board members' });
		}

		const slug = params.slug;

		if (!slug) {
			return fail(404, { message: 'Club not found' });
		}

		const club = await db.getClubByUrlName(slug);
		if (!club) {
			return fail(404, { message: 'Club not found' });
		}

		if (!locals.user.adminFor.includes(club.urlName)) {
			return fail(403, { message: 'You do not have permission to edit members for this club' });
		}

		const body = await request.formData();
		const parsed = parseBoardMemberFormData(body);

		if ('error' in parsed) {
			return fail(400, { message: parsed.error, field: parsed.field });
		}

		const boardMemberId = body.get('id');
		if (!boardMemberId || typeof boardMemberId !== 'string') {
			return fail(404, { message: 'Board member not found' });
		}

		const boardMember = club.boardMembers.find((bm) => bm.id === boardMemberId);
		if (!boardMember) {
			return fail(404, { message: 'Board member not found' });
		}

		const profileImageData = body.get('profileImage');
		const profileImageUrl = await db.trySwapImage(
			profileImageData instanceof File ? profileImageData : null,
			boardMember.profileImage,
			PROFILE_CONTAINER
		);

		const updatedDoc: Partial<BoardMember> = {
			name: parsed.name,
			position: parsed.position,
			profileImage: profileImageUrl
		};

		const success = await db.updateBoardMember(club._id, boardMemberId, updatedDoc);

		if (!success) {
			return fail(500, { message: 'Failed to update board member' });
		}

		return {
			message: 'Board member updated successfully',
			member: { ...boardMember, ...updatedDoc }
		};
	},

	delete: async ({ locals, request, params }) => {
		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to delete board members' });
		}

		const slug = params.slug;

		if (!slug) {
			return fail(404, { message: 'Club not found' });
		}

		const club = await db.getClubByUrlName(slug);
		if (!club) {
			return fail(404, { message: 'Club not found' });
		}

		if (!locals.user.adminFor.includes(club.urlName)) {
			return fail(403, { message: 'You do not have permission to delete members for this club' });
		}

		const body = await request.formData();
		const boardMemberId = body.get('id');

		if (!boardMemberId || typeof boardMemberId !== 'string') {
			return fail(404, { message: 'Board member not found' });
		}

		const boardMember = club.boardMembers.find((bm) => bm.id === boardMemberId);
		if (!boardMember) {
			return fail(404, { message: 'Board member not found' });
		}

		const success = await db.deleteBoardMember(club._id, boardMemberId);

		if (boardMember.profileImage) {
			try {
				await db.deleteFileFromAzure(boardMember.profileImage, PROFILE_CONTAINER);
			} catch (error) {
				console.error('Error deleting old profile image from Azure:', error);
			}
		}

		if (!success) {
			return fail(500, { message: 'Failed to delete board member' });
		}

		return { message: 'Board member deleted successfully' };
	}
};
