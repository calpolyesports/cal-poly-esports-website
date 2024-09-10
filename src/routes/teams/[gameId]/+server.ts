import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import * as db from "$lib/server/database";
import * as models from "$lib/server/models";
import { ObjectId } from "mongodb";
import type { RosterTeam } from "$lib/types";

export const POST: RequestHandler = async (event) => {
    const gameId = event.params.gameId;

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
            message: "You do not have permission to add teams for this game"
        }, { status: 403 });
    }

    const newDoc = {
        name,
        members: []
    } as RosterTeam;

    const newId = await db.addRosterTeam(new ObjectId(gameId), newDoc);

    if (!newId) {
        return json({
            message: "Failed to add team"
        }, { status: 500 });
    }

    const newTeam = await db.getRosterTeamById(newId);

    return json({
        team: newTeam
    }, { status: 200 });
};
