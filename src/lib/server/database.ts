import { MongoClient, ObjectId, ServerApiVersion, type MongoClientOptions } from 'mongodb';
import { env } from '$env/dynamic/private';

import * as models from './models';
import * as types from '../types';

const client = new MongoClient(env.DB_CONN_STRING, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
} as MongoClientOptions);
console.log("Connecting to MongoDB...");
await client.connect();
await client.db("admin").command({ ping: 1 });
console.log("Pinged your deployment. You successfully connected to MongoDB!");

export const WEBSITE = client.db('website');
export const USER = WEBSITE.collection<models.UserDoc>('users');
export const SESSION = WEBSITE.collection<models.SessionDoc>('sessions');
export const ARTICLE = WEBSITE.collection<models.ArticleDoc>('articles');
export const ROSTER_GAME = WEBSITE.collection<models.RosterGameDoc>('games');
export const ROSTER_TEAM = WEBSITE.collection<models.RosterTeamDoc>('teams');
export const ROSTER_MEMBER = WEBSITE.collection<models.RosterMemberDoc>('members');
export const EVENT = WEBSITE.collection<models.EventDoc>('events');
export const CLUB = WEBSITE.collection<models.ClubDoc>('clubs');

export async function getArticles() {
    const response = await ARTICLE.find().toArray();
    const articles = response.map(article => types.Article.fromMongo(article));
    return articles.map(article => article.toJSON());
}

export async function getRosters() {
    const allGameDocs = await ROSTER_GAME.find().toArray();
    const allTeamDocs = await ROSTER_TEAM.find().toArray();
    const allMemberDocs = await ROSTER_MEMBER.find().toArray();
    const membersByTeamId: { [teamId: string]: models.RosterMemberDoc[] } = {};
    allMemberDocs.forEach((member) => {
        const teamIdString = member.team.toString();
        if (!membersByTeamId[teamIdString]) {
            membersByTeamId[teamIdString] = [];
        }
        membersByTeamId[teamIdString].push(member);
    });

    const games: types.RosterGame[] = [];
    allGameDocs.forEach((gameDoc) => {
        const teamDocs = allTeamDocs.filter((team) => team.game.equals(gameDoc._id));
        games.push(types.RosterGame.fromMongo(gameDoc, teamDocs, membersByTeamId));
    });

    return games.map(game => game.toJSON());
}

export async function getEvents(adminFor?: string[]) {
    const response = await EVENT.find().toArray();
    const events = response.map(event => types.Event.fromMongo(event));
    const clubs = await CLUB.find().toArray();
    events.forEach((event) => {
        const club = clubs.find(club => club.urlName === event.club);
        if (club) {
            event.backgroundColor = club.color
        }
        if (adminFor && adminFor.includes(event.club)) {
            event.editable = true;
        }
    });
    return events.map(event => event.toJSON());
}

export async function addEvent(event: models.EventDoc) {
    const result = await EVENT.insertOne(event);
    return result.insertedId;
}

export async function getEventById(id: string, adminFor?: string[]) {
    const eventDoc = await EVENT.findOne({ _id: new ObjectId(id) });
    if (!eventDoc) {
        return null;
    }
    const event = types.Event.fromMongo(eventDoc);
    const club = await CLUB.findOne({ urlName: event.club });
    if (club) {
        event.backgroundColor = club.color;
        if (adminFor && adminFor.includes(event.club)) {
            event.editable = true;
        }
    }
    return event;
}

export async function updateEvent(event: types.Event) {
    const result = await EVENT.updateOne({ _id: new ObjectId(event.id) }, { $set: event.toMongo() });
    return result.matchedCount !== 0;
}

export async function deleteEvent(id: string) {
    const result = await EVENT.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount !== 0;
}

export async function getClubByName(urlName: string) {
    await client.connect();
    const db = client.db('website');
    const collection = db.collection('clubs');
    const club = await collection.findOne({ urlName: urlName });

    if (club) {
        return {
            clubName: club.clubName,
            aboutText: club.aboutText,
            boardMembers: club.boardMembers,
            color: club.color,
        };
    }
    return null;
}

export async function getClubs() {
    const response = await CLUB.find().toArray();
    const clubs = response.map(club => types.Club.fromMongo(club));
    return clubs.map(club => club.toJSON());
}
