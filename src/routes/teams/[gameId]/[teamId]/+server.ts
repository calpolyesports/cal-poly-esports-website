import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import * as models from "$lib/server/models";
import { ObjectId } from "mongodb";
import type { RosterTeam, RosterMember } from "$lib/types";

export const POST: RequestHandler = async (event) => {
    const gameId = event.params.gameId;
    const teamId = event.params.teamId;

    const formData = await event.request.formData();
    const name = formData.get('name') as string;
    const username = formData.get('username') as string;
    const role = formData.get('role') as string;
    const pictureData = formData.get('picture') as File | null;

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

    let picture = null;

    if (pictureData) {
        picture = await db.uploadFileToBlob(pictureData, 'players');
    }

    const newDoc = {
        name,
        username,
        role,
        picture
    } as unknown as RosterMember;

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
        name,
        // purposefully omit members
    } as RosterTeam;

    await db.updateRosterTeam(new ObjectId(teamId), newDoc);

    const newTeam = await db.getRosterTeamById(new ObjectId(teamId));

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
