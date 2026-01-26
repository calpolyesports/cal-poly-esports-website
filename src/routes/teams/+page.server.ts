import * as db from '$lib/server/database';
import type { WithStringId, RosterGame } from '$lib/types';

export async function load() {
	const games = (await db.getRosterGames()).map((game) => {
		return {
			...game,
			_id: game._id.toString()
		};
	}) as WithStringId<RosterGame>[];
	return {
		subtitle: 'Teams',
		games
	};
}
