import * as db from '$lib/server/database';
import type { WithStringId, RosterGame } from '$lib/types';
import type { InferRawDocType } from 'mongoose';
import * as models from '$lib/server/models';

export async function load() {
    const games = (await db.getRosterGames()).map((game) => {
        return {
            ...game,
            _id: game._id.toString(),
            teams: game.teams.map((team: any) => {
                return {
                    ...team,
                    _id: team._id.toString(),
                    members: team.members.map((member: any) => {
                        return {
                            ...member,
                            _id: member._id.toString(),
                        };
                    }),
                };
            }),
        };
    }) as WithStringId<RosterGame>[];
    return {
        games,
    }
}
