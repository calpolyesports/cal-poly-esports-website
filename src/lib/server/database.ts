import { connect, type InferRawDocType } from 'mongoose';
import { env } from '$env/dynamic/private';
import { ObjectId } from 'mongodb';

import * as models from './models';

console.log("Connecting to MongoDB...");
await connect(env.DB_CONN_STRING!);
console.log("Connected to MongoDB");

export async function getEvents(adminFor?: string[]) {
    const response = await models.EventModel.find().lean();
    const clubs = await models.ClubModel.find().lean();
    return response.map((event) => {
        const club = clubs.find(club => club.urlName === event.club);
        return {
            ...event,
            backgroundColor: club?.color ?? '#154734',
            editable: adminFor?.includes(event.club) ?? false,
        };
    });
}

export async function getEventById(id: ObjectId, adminFor?: string[]) {
    const eventDoc = await models.EventModel.findOne({ _id: id }).lean();
    if (!eventDoc) return null;
    const clubDoc = await models.ClubModel.findOne({ urlName: eventDoc.club }).lean();
    const event = {
        ...eventDoc,
        backgroundColor: clubDoc ? clubDoc.color : '#154734',
        editable: adminFor?.includes(eventDoc.club) ?? false,
    };
    return event;
}

export async function addEvent(event: InferRawDocType<typeof models.EventModel>) {
    const newEvent = new models.EventModel(event);
    await newEvent.save();
    return newEvent._id;
}

export async function updateEvent(id: ObjectId, event: InferRawDocType<typeof models.EventModel>) {
    await models.EventModel.updateOne({
        _id: id,
    }, event);
}

export async function deleteEvent(id: ObjectId) {
    await models.EventModel.deleteOne({ _id: id });
}

export async function getRosterGames() {
    const allGameDocs = await models.RosterGameModel.find().lean()
        .populate({
            path: 'teams',
            populate: { path: 'members' }
        });
    return allGameDocs;
}

export async function getRosterGameById(id: ObjectId) {
    const gameDoc = await models.RosterGameModel.findOne({ _id: id }).lean()
        .populate({
            path: 'teams',
            populate: { path: 'members' }
        });
    return gameDoc;
}

export async function addRosterGame(game: InferRawDocType<typeof models.RosterGameModel>) {
    const newGame = new models.RosterGameModel(game);
    await newGame.save();
    return newGame;
}

export async function updateRosterGame(id: ObjectId, game: InferRawDocType<typeof models.RosterGameModel>) {
    const updatedGame = new models.RosterGameModel(game);
    await models.RosterGameModel.updateOne({
        _id: id,
    }, updatedGame);
}

export async function deleteRosterGame(id: ObjectId) {
    await models.RosterGameModel.deleteOne({ _id: id });
}

export async function getRosterTeams() {
    const allTeamDocs = await models.RosterTeamModel.find().lean()
        .populate('members');
    return allTeamDocs;
}

export async function getRosterTeamById(id: ObjectId) {
    const teamDoc = await models.RosterTeamModel.findOne({ _id: id }).lean()
        .populate('members');
    return teamDoc;
}

export async function getArticles() {
    const response = await models.ArticleModel.find().lean();
    return response;
}

export async function getClubByName(urlName: string) {
    const clubDoc = await models.ClubModel.findOne({ urlName }).lean();
    return clubDoc;
}

export async function getClubs() {
    const response = await models.ClubModel.find().lean();
    return response;
}
