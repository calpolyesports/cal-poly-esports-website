import { heroes, pool, purePool, type Hero, type HeroArchetype, type HeroRole } from './heroes';

export interface DraftSlot {
	id: string;
	label: string;
	shortLabel: string;
	role: HeroRole;
	archetype: HeroArchetype;
}

/** The five picks that make up a full 5v5 composition, in draft order. */
export const SLOTS: DraftSlot[] = [
	{ id: 'tank', label: 'Tank', shortLabel: 'Tank', role: 'tank', archetype: 'brawl' },
	{ id: 'main-dps', label: 'Main DPS', shortLabel: 'Main', role: 'damage', archetype: 'main' },
	{ id: 'flex-dps', label: 'Flex DPS', shortLabel: 'Flex', role: 'damage', archetype: 'flex' },
	{
		id: 'main-support',
		label: 'Main Support',
		shortLabel: 'Main',
		role: 'support',
		archetype: 'main'
	},
	{
		id: 'flex-support',
		label: 'Flex Support',
		shortLabel: 'Flex',
		role: 'support',
		archetype: 'flex'
	}
];

export interface DraftRound {
	slot: DraftSlot;
	options: Hero[];
}

function pickRandom<T>(items: T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Tank is always drafted first; the other four roles come up in a random order. */
export function draftOrder(): DraftSlot[] {
	const [tank, ...rest] = SLOTS;
	return [tank, ...shuffle(rest)];
}

/**
 * The tank triple is always one pure dive hero, one pure brawl hero, and one
 * wildcard drawn from whatever tanks are left (which is where hybrids and the
 * unused dive/brawl heroes come from).
 */
function tankOptions(used: Set<string>): Hero[] {
	const free = (candidates: Hero[]) => candidates.filter((hero) => !used.has(hero.key));

	const dive = pickRandom(free(purePool('tank', 'dive')));
	const brawl = pickRandom(free(purePool('tank', 'brawl')));
	const wildcard = pickRandom(
		free(heroes.filter((hero) => hero.role === 'tank')).filter(
			(hero) => hero !== dive && hero !== brawl
		)
	);

	return [dive, brawl, wildcard];
}

/** Three distinct heroes from the slot's pool, skipping anything already drawn. */
function slotOptions(slot: DraftSlot, used: Set<string>, allowHybrids: boolean): Hero[] {
	const available = (allowHybrids ? pool : purePool)(slot.role, slot.archetype).filter(
		(hero) => !used.has(hero.key)
	);
	const options: Hero[] = [];

	while (options.length < 3 && options.length < available.length) {
		const chosen = pickRandom(available.filter((hero) => !options.includes(hero)));
		options.push(chosen);
	}

	return options;
}

/**
 * Draws the triple for a round. Rounds are drawn as they are reached rather
 * than all up front, because what a round can offer depends on earlier picks:
 *
 * - A hero is only ever offered once per draft (`used` is updated here), which
 *   matters because hybrids sit in both the main and flex pool of a role.
 * - A team may only pick one hybrid per role, so once a hybrid has been taken
 *   for a role, that role's remaining round is drawn from pure heroes only.
 */
export function drawRound(
	slot: DraftSlot,
	used: Set<string>,
	picks: Record<string, Hero | null>
): DraftRound {
	const hybridTaken = SLOTS.some(
		(other) => other.role === slot.role && picks[other.id]?.archetype === 'hybrid'
	);
	const options = slot.id === 'tank' ? tankOptions(used) : slotOptions(slot, used, !hybridTaken);

	for (const hero of options) used.add(hero.key);
	return { slot, options };
}
