import { connect, type InferRawDocType } from 'mongoose';
import { env } from '$env/dynamic/private';

import * as models from './models';

console.log("Connecting to MongoDB...");
await connect(env.DB_CONN_STRING!);
console.log("Connected to MongoDB");

export async function getArticles() {
    const response = await models.ArticleModel.find().lean();
    return response;
}

export async function getRosterGames() {
    const allGameDocs = await models.RosterGameModel.find().lean()
        .populate({
            path: 'teams',
            populate: { path: 'members' }
        });
    return allGameDocs;
}

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

export async function getEventById(id: string, adminFor?: string[]) {
    const eventDoc = await models.EventModel.findOne({ _id: id }).lean();
    if (!eventDoc) return null;
    const clubDoc = await models.ClubModel.findOne({ urlName: eventDoc.club }).lean();
    if (!clubDoc) return null;
    const event = {
        ...eventDoc,
        backgroundColor: clubDoc.color,
        editable: adminFor?.includes(eventDoc.club) ?? false,
    };
    return event;
}

export async function addEvent(event: InferRawDocType<typeof models.EventModel>) {
    const newEvent = new models.EventModel(event);
    await newEvent.save();
    return newEvent;
}

export async function updateEvent(id: string, event: InferRawDocType<typeof models.EventModel>) {
    const updatedEvent = new models.EventModel(event);
    await updatedEvent.save();
    return updatedEvent;
}

export async function deleteEvent(id: string) {
    await models.EventModel.deleteOne({ _id: id });
}

export async function getClubByName(urlName: string) {
    const clubDoc = await models.ClubModel.findOne({ urlName }).lean();
    return clubDoc;
}

export async function getClubs() {
    const response = await models.ClubModel.find().lean();
    return response;
}
