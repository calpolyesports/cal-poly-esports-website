import { env } from '$env/dynamic/private';
import { ObjectId, type WithId } from 'mongodb';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import { BlobServiceClient } from '@azure/storage-blob';
import { MongoClient, ServerApiVersion } from 'mongodb';

import * as types from '../types';
import * as serverTypes from './types';

const sasUrl = env.PLAYER_PORTRAIT_BLOB;

const client = new MongoClient(env.DB_CONN_STRING, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db('admin').command({ ping: 1 });
		console.log('Pinged your deployment. You successfully connected to MongoDB!');
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}

export function stringifyObjectId<T>(obj: WithId<T>): types.WithStringId<T> {
	return {
		...obj,
		_id: obj._id.toString()
	} as types.WithStringId<T>;
}

export async function getEvents(
	adminFor?: string[],
	publicOnly: boolean = false
): Promise<WithId<types.Event>[]> {
	const database = client.db(env.DB_NAME);

	const eventsCollection = database.collection<serverTypes.Event>('events');
	const clubsCollection = database.collection<types.Club>('clubs');

	const query: {
		showPublic?: boolean;
	} = {};
	if (publicOnly) {
		query.showPublic = true;
	}

	const eventsCursor = eventsCollection.find(query);
	const events = await eventsCursor.toArray();

	const clubsCursor = clubsCollection.find();
	const clubs = await clubsCursor.toArray();

	return events.map((event) => {
		const club = clubs.find((club) => club.urlName === event.club);
		return {
			...event,
			backgroundColor: club?.color ?? '#154734',
			editable: adminFor?.includes(event.club) ?? false
		};
	});
}

export async function getEventById(
	id: ObjectId,
	adminFor?: string[],
	usesLabOnly: boolean = false
): Promise<WithId<types.Event> | null> {
	const database = client.db(env.DB_NAME);

	const eventsCollection = database.collection<serverTypes.Event>('events');
	const clubsCollection = database.collection<types.Club>('clubs');

	const query: {
		_id: ObjectId;
		usesLab?: boolean;
	} = { _id: id };
	if (usesLabOnly) {
		query.usesLab = true;
	}

	const eventDoc = await eventsCollection.findOne(query);
	if (!eventDoc) return null;

	const clubDoc = await clubsCollection.findOne({ urlName: eventDoc.club });
	const event = {
		...eventDoc,
		backgroundColor: clubDoc ? clubDoc.color : '#154734',
		editable: adminFor?.includes(eventDoc.club) ?? false
	};
	return event;
}

export async function addEvent(event: serverTypes.Event): Promise<ObjectId> {
	const database = client.db(env.DB_NAME);
	const eventsCollection = database.collection<serverTypes.Event>('events');
	const result = await eventsCollection.insertOne(event);
	return result.insertedId;
}

export async function updateEvent(
	id: ObjectId,
	event: Partial<serverTypes.Event>
): Promise<boolean> {
	const database = client.db(env.DB_NAME);
	const eventsCollection = database.collection<serverTypes.Event>('events');
	const result = await eventsCollection.updateOne({ _id: id }, { $set: event });
	return result.matchedCount > 0;
}

export async function deleteEvent(id: ObjectId): Promise<boolean> {
	const database = client.db(env.DB_NAME);
	const eventsCollection = database.collection<serverTypes.Event>('events');
	const result = await eventsCollection.deleteOne({ _id: id });
	return result.deletedCount > 0;
}

export async function getRosterGames(): Promise<WithId<types.RosterGame>[]> {
	const database = client.db(env.DB_NAME);
	const gamesCollection = database.collection<types.RosterGame>('rosters');
	const gamesCursor = gamesCollection.find();
	const games = await gamesCursor.toArray();
	return games;
}

export async function getRosterGameById(id: ObjectId): Promise<WithId<types.RosterGame> | null> {
	const database = client.db(env.DB_NAME);
	const gamesCollection = database.collection<types.RosterGame>('rosters');
	const gameDoc = await gamesCollection.findOne({ _id: id });
	return gameDoc;
}

export async function getRosterTeams(gameId: ObjectId): Promise<types.RosterTeam[] | null> {
	return (await getRosterGameById(gameId))?.teams || null;
}

export async function getRosterTeamById(
	gameId: ObjectId,
	teamId: string
): Promise<types.RosterTeam | null> {
	return (await getRosterGameById(gameId))?.teams.find((team) => team.id === teamId) || null;
}

export async function addRosterTeam(gameId: ObjectId, team: types.RosterTeam): Promise<boolean> {
	const database = client.db(env.DB_NAME);
	const gamesCollection = database.collection<types.RosterGame>('rosters');

	const result = await gamesCollection.updateOne(
		{ _id: gameId },
		{
			$push: { teams: team }
		}
	);

	return result.matchedCount > 0;
}

export async function updateRosterTeam(
	gameId: ObjectId,
	teamId: string,
	team: Partial<types.RosterTeam>
): Promise<boolean> {
	const database = client.db(env.DB_NAME);
	const gamesCollection = database.collection<types.RosterGame>('rosters');

	const result = await gamesCollection.updateOne(
		{ _id: gameId },
		{
			$set: {
				'teams.$[team]': team
			}
		},
		{
			arrayFilters: [{ 'team.id': teamId }]
		}
	);

	return result.matchedCount > 0;
}

export async function deleteRosterTeam(gameId: ObjectId, teamId: string): Promise<boolean> {
	const database = client.db(env.DB_NAME);
	const gamesCollection = database.collection<types.RosterGame>('rosters');

	const result = await gamesCollection.updateOne(
		{ _id: gameId },
		{
			$pull: {
				teams: { id: teamId }
			}
		}
	);

	return result.matchedCount > 0;
}

export async function getRosterMembers(
	gameId: ObjectId,
	teamId: string
): Promise<types.RosterMember[] | null> {
	return (await getRosterTeamById(gameId, teamId))?.members || null;
}

export async function getRosterMemberById(
	gameId: ObjectId,
	teamId: string,
	memberId: string
): Promise<types.RosterMember | null> {
	return (
		(await getRosterTeamById(gameId, teamId))?.members.find((member) => member.id === memberId) ||
		null
	);
}

export async function addRosterMember(
	gameId: ObjectId,
	teamId: string,
	member: types.RosterMember
): Promise<boolean> {
	const database = client.db(env.DB_NAME);
	const gamesCollection = database.collection<types.RosterGame>('rosters');

	const result = await gamesCollection.updateOne(
		{ _id: gameId },
		{
			$push: {
				'teams.$[team].members': member
			}
		},
		{
			arrayFilters: [{ 'team.id': teamId }]
		}
	);

	return result.matchedCount > 0;
}

export async function updateRosterMember(
	gameId: ObjectId,
	teamId: string,
	memberId: string,
	member: Partial<types.RosterMember>
): Promise<boolean> {
	const database = client.db(env.DB_NAME);
	const gamesCollection = database.collection<types.RosterGame>('rosters');

	const result = await gamesCollection.updateOne(
		{ _id: gameId },
		{
			$set: {
				'teams.$[team].members.$[member]': member
			}
		},
		{
			arrayFilters: [{ 'team.id': teamId }, { 'member.id': memberId }]
		}
	);

	return result.matchedCount > 0;
}

export async function deleteRosterMember(
	gameId: ObjectId,
	teamId: string,
	memberId: string
): Promise<boolean> {
	const database = client.db(env.DB_NAME);
	const gamesCollection = database.collection<types.RosterGame>('rosters');

	const member = await getRosterMemberById(gameId, teamId, memberId);
	if (!member) return false;

	if (member.picture) {
		try {
			await deleteFileFromAzure(member.picture, 'players');
		} catch (error) {
			console.error('Error deleting picture from Azure:', error);
		}
	}

	const result = await gamesCollection.updateOne(
		{ _id: gameId },
		{
			$pull: {
				'teams.$[team].members': { id: memberId }
			}
		},
		{
			arrayFilters: [{ 'team.id': teamId }]
		}
	);

	return result.matchedCount > 0;
}

export async function getArticles(): Promise<WithId<types.Article>[]> {
	const database = client.db(env.DB_NAME);
	const articlesCollection = database.collection<types.Article>('articles');
	const articlesCursor = articlesCollection.find();
	const articles = await articlesCursor.toArray();
	return articles;
}

export async function getClubs(): Promise<WithId<types.Club>[]> {
	const database = client.db(env.DB_NAME);
	const clubsCollection = database.collection<types.Club>('clubs');
	const clubsCursor = clubsCollection.find();
	const clubs = await clubsCursor.toArray();
	return clubs;
}

export async function getClubByUrlName(urlName: string): Promise<WithId<types.Club> | null> {
	const database = client.db(env.DB_NAME);
	const clubsCollection = database.collection<types.Club>('clubs');
	const clubDoc = await clubsCollection.findOne({
		urlName: urlName
	});
	return clubDoc;
}

export async function updateClub(id: ObjectId, club: Partial<types.Club>): Promise<boolean> {
	if (club.aboutText) {
		club.aboutHtml = DOMPurify.sanitize(await marked.parse(club.aboutText));
	}

	const database = client.db(env.DB_NAME);
	const clubsCollection = database.collection<types.Club>('clubs');
	const result = await clubsCollection.updateOne(
		{
			_id: id
		},
		{ $set: club }
	);

	return result.matchedCount > 0;
}

export async function addBoardMember(
	clubId: ObjectId,
	boardMember: types.BoardMember
): Promise<boolean> {
	const database = client.db(env.DB_NAME);
	const clubsCollection = database.collection<types.Club>('clubs');

	const result = await clubsCollection.updateOne(
		{ _id: clubId },
		{
			$push: {
				boardMembers: boardMember
			}
		}
	);

	return result.matchedCount > 0;
}

export async function updateBoardMember(
	clubId: ObjectId,
	boardMemberId: string,
	boardMember: Partial<types.BoardMember>
): Promise<boolean> {
	const database = client.db(env.DB_NAME);
	const clubsCollection = database.collection<types.Club>('clubs');

	const result = await clubsCollection.updateOne(
		{ _id: clubId },
		{
			$set: {
				'boardMembers.$[boardMember]': boardMember
			}
		},
		{
			arrayFilters: [{ 'boardMember.id': boardMemberId }]
		}
	);

	return result.matchedCount > 0;
}

export async function deleteBoardMember(clubId: ObjectId, boardMemberId: string): Promise<boolean> {
	const database = client.db(env.DB_NAME);
	const clubsCollection = database.collection<types.Club>('clubs');

	const club = await clubsCollection.findOne({ _id: clubId });
	if (!club) return false;

	const member = club.boardMembers.find((m) => m.id === boardMemberId);
	if (!member) return false;

	const defaultPicture =
		'https://cpsloesports.blob.core.windows.net/portraits/boards/blank_person.jpeg';
	if (member.profileImage && member.profileImage !== defaultPicture) {
		try {
			await deleteFileFromAzure(member.profileImage, 'boards');
		} catch (error) {
			console.error('Error deleting picture from Azure:', error);
		}
	}

	const result = await clubsCollection.updateOne(
		{ _id: clubId },
		{
			$pull: {
				boardMembers: { id: boardMemberId }
			}
		}
	);

	return result.matchedCount > 0;
}

export const uploadFileToBlob = async (file: File, containerName: string): Promise<string> => {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const blobServiceClient = new BlobServiceClient(sasUrl);
	const containerClient = blobServiceClient.getContainerClient(containerName);
	const blobName = `${Date.now()}-${file.name}`;
	const blockBlobClient = containerClient.getBlockBlobClient(blobName);

	await blockBlobClient.uploadData(buffer, {
		blobHTTPHeaders: {
			blobContentType: file.type
		}
	});

	return `${sasUrl.split('?')[0]}/${containerName}/${blobName}`;
};

export async function deleteFileFromAzure(
	pictureUrl: string,
	containerName: string
): Promise<void> {
	if (!pictureUrl) {
		throw new Error('Invalid picture URL provided');
	}

	const blobServiceClient = new BlobServiceClient(sasUrl);
	const containerClient = blobServiceClient.getContainerClient(containerName);
	const blobName = pictureUrl.split('/').pop();

	if (!blobName) {
		throw new Error('Invalid blob name extracted from the URL');
	}

	const blockBlobClient = containerClient.getBlockBlobClient(blobName);

	await blockBlobClient.delete();
}

export async function findUserByUsername(
	username: string
): Promise<WithId<serverTypes.User> | null> {
	const database = client.db(env.DB_NAME);
	const usersCollection = database.collection<serverTypes.User>('users');
	return await usersCollection.findOne({ username });
}

export async function createUser(user: serverTypes.User): Promise<string> {
	const database = client.db(env.DB_NAME);
	const usersCollection = database.collection<serverTypes.User>('users');
	const result = await usersCollection.insertOne(user);
	return result.insertedId.toString();
}

export async function getUserById(id: string): Promise<WithId<serverTypes.User> | null> {
	const database = client.db(env.DB_NAME);
	const usersCollection = database.collection<serverTypes.User>('users');
	return await usersCollection.findOne({ _id: id });
}

export async function createSession(userId: string, expiresAt: Date): Promise<string> {
	const database = client.db(env.DB_NAME);
	const sessionsCollection = database.collection<serverTypes.Session>('sessions');
	const result = await sessionsCollection.insertOne({
		_id: crypto.randomUUID(),
		userId: userId,
		expiresAt: expiresAt,
		fresh: true
	});
	return result.insertedId;
}

export async function getSessionById(id: string): Promise<serverTypes.Session | null> {
	const database = client.db(env.DB_NAME);
	const sessionsCollection = database.collection<serverTypes.Session>('sessions');
	return await sessionsCollection.findOne({ _id: id });
}

export async function deleteSession(id: string): Promise<void> {
	const database = client.db(env.DB_NAME);
	const sessionsCollection = database.collection<serverTypes.Session>('sessions');
	await sessionsCollection.deleteOne({ _id: id });
}

export async function deleteExpiredSessions(): Promise<number> {
	const database = client.db(env.DB_NAME);
	const sessionsCollection = database.collection<serverTypes.Session>('sessions');
	const result = await sessionsCollection.deleteMany({
		expires_at: { $lt: new Date() }
	});
	return result.deletedCount;
}

run().catch(console.dir);
