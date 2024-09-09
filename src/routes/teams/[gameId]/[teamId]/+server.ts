import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import * as models from "$lib/server/models";
import type { InferRawDocType } from "mongoose";
import { ObjectId } from "mongodb";

export const POST: RequestHandler = async (event) => {
    const gameId = event.params.gameId;
    const teamId = event.params.teamId;

    const body = await event.request.json();
    const name = body.name;
    const username = body.username;
    const role = body.role;
    const picture = body.picture;

    const game = await db.getRosterGameById(new ObjectId(gameId));

    if (!game) {
        return json({
            message: "Game not found"
        }, { status: 404 });
    }

    const team = await db.getRosterTeamById(new ObjectId(teamId));

    if (!team) {
        return json({
            message: "Team not found"
        }, { status: 404 });
    }

    if (!event.locals.user?.admin_for.includes(game.adminRole)) {
        return json({
            message: "You do not have permission to add members for this game"
        }, { status: 403 });
    }

    const newDoc = {
        name,
        username,
        role,
        picture
    } as InferRawDocType<typeof models.RosterMemberModel>;

    const newId = await db.addRosterMember(new ObjectId(teamId), newDoc);

    if (!newId) {
        return json({
            message: "Failed to add member"
        }, { status: 500 });
    }

    const newMember = await db.getRosterMemberById(newId);

    return json({
        member: newMember
    }, { status: 200 });
};

export const PUT: RequestHandler = async (event) => {
    const gameId = event.params.gameId;
    const teamId = event.params.teamId;

    const body = await event.request.json();
    const name = body.name;

    const game = await db.getRosterGameById(new ObjectId(gameId));

    if (!game) {
        return json({
            message: "Game not found"
        }, { status: 404 });
    }

    if (!event.locals.user?.admin_for.includes(game.adminRole)) {
        return json({
            message: "You do not have permission to update teams for this game"
        }, { status: 403 });
    }

    const newDoc = {
        name
    } as InferRawDocType<typeof models.RosterTeamModel>;

    await db.updateRosterTeam(new ObjectId(teamId), newDoc);

    const newTeam = await db.getRosterTeamById(new ObjectId(gameId));

    return json({
        team: newTeam
    }, { status: 200 });
};

export const DELETE: RequestHandler = async (event) => {
    const gameId = event.params.gameId;
    const teamId = event.params.teamId;

    const game = await db.getRosterGameById(new ObjectId(gameId));

    if (!game) {
        return json({
            message: "Game not found"
        }, { status: 404 });
    }

    if (!event.locals.user?.admin_for.includes(game.adminRole)) {
        return json({
            message: "You do not have permission to delete teams for this game"
        }, { status: 403 });
    }

    await db.deleteRosterTeam(new ObjectId(gameId), new ObjectId(teamId));

    return json({
        message: "Team deleted"
    }, { status: 200 });
};
