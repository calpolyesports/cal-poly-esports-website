import { MongoClient, ObjectId, ServerApiVersion, type MongoClientOptions } from 'mongodb';
import { env } from '$env/dynamic/private';

import * as models from '../models';

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

export const Website = client.db('website');
export const User = Website.collection<models.UserDoc>('users');
export const Session = Website.collection<models.SessionDoc>('sessions');
export const Article = Website.collection<models.Article>('articles');
export const Roster = Website.collection<models.Game>('rosters');
export const Event = Website.collection<models.EventDoc>('events');
export const Club = Website.collection<models.Club>('clubs');

export async function getArticles() {
    const response = await Article.find().toArray();
    const articles = response.map(article => models.Article.fromMongo(article));
    return articles.map(article => article.toJSON());
}

export async function getRosters() {
    const response = await Roster.find().toArray();
    const games = response.map(game => models.Game.fromMongo(game));
    return games.map(game => game.toJSON());
}

export async function getEvents(adminFor?: string[]) {
    const response = await Event.find().toArray();
    const events = response.map(event => models.Event.fromMongo(event._id.toString(), event));
    const clubs = await Club.find().toArray();
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
    const result = await Event.insertOne(event);
    return result.insertedId;
}

export async function getEventById(id: string, adminFor?: string[]) {
    const eventDoc = await Event.findOne({ _id: new ObjectId(id) });
    if (!eventDoc) {
        return null;
    }
    const event = models.Event.fromMongo(eventDoc._id.toString(), eventDoc);
    const club = await Club.findOne({ urlName: event.club });
    if (club) {
        event.backgroundColor = club.color;
        if (adminFor && adminFor.includes(event.club)) {
            event.editable = true;
        }
    }
    return event;
}

export async function updateEvent(event: models.Event) {
    const result = await Event.updateOne({ _id: new ObjectId(event.id) }, { $set: event.toMongo() });
    return result.matchedCount !== 0;
}

export async function deleteEvent(id: string) {
    const result = await Event.deleteOne({ _id: new ObjectId(id) });
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
    const response = await Club.find().toArray();
    const clubs = response.map(club => models.Club.fromMongo(club));
    return clubs.map(club => club.toJSON());
}
