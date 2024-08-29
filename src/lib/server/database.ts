import { MongoClient, ServerApiVersion, type MongoClientOptions } from 'mongodb';
import { env } from '$env/dynamic/private';

import * as models from '../models';

const client = new MongoClient(env.DB_CONN_STRING, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
} as MongoClientOptions);

async function run() {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
console.log("Connecting to MongoDB...");
run().catch(console.dir);

const events = [
    {
        id: "1",
        allDay: false,
        start: new Date("2024-08-23T12:00:00Z"),
        end: new Date("2024-08-23T13:00:00Z"),
        title: "Test Event 1",
        display: 'auto',
        backgroundColor: '#154734',
    }
]

export async function getArticles() {
    const response = await client.db('website').collection<models.Article>('articles').find().toArray();
    const articles = response.map(article => models.Article.fromMongo(article));
    return articles.map(article => article.toJSON());
}

export async function getRosters() {
    const response = await client.db('website').collection<models.Game>('rosters').find().toArray();
    const games = response.map(game => models.Game.fromMongo(game));
    return games.map(game => game.toJSON());
}

export function getEvents() {
    return events;
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
        };
    }
    return null;
}

export async function getClubs() {
    const response = await client.db('website').collection<models.Club>('clubs').find().toArray();
    const clubs = response.map(club => models.Club.fromMongo(club));
    return clubs.map(club => club.toJSON());
}
