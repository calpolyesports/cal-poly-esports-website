import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import * as models from "$lib/server/models";
import type { RosterMember } from "$lib/types";
import { ObjectId } from "mongodb";

export const PUT: RequestHandler = async (event) => {
    const gameId = event.params.gameId;
    const teamId = event.params.teamId;
    const memberId = event.params.memberId;

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
            message: "You do not have permission to update members for this game"
        }, { status: 403 });
    }

    const newDoc = {
        name,
        username,
        role,
        picture
    } as RosterMember;

    await db.updateRosterMember(new ObjectId(memberId), newDoc);

    const newMember = await db.getRosterMemberById(new ObjectId(memberId));

    return json({
        member: newMember
    }, { status: 200 });
};

export const DELETE: RequestHandler = async (event) => {
    const gameId = event.params.gameId;
    const teamId = event.params.teamId;
    const memberId = event.params.memberId;

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
            message: "You do not have permission to delete members for this game"
        }, { status: 403 });
    }

    await db.deleteRosterMember(team._id, new ObjectId(memberId));

    return new Response(null, { status: 204 });
};
