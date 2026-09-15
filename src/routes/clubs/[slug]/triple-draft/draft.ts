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

/**
 * Randomises which role is drafted when. Tank is pinned to either end, so a
 * team never commits to its damage and support picks around a tank slot that
 * is still up in the air mid-draft.
 */
function draftOrder(): DraftSlot[] {
	const [tank, ...rest] = SLOTS;
	const others = shuffle(rest);
	return Math.random() < 0.5 ? [tank, ...others] : [...others, tank];
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
function slotOptions(slot: DraftSlot, used: Set<string>): Hero[] {
	const available = pool(slot.role, slot.archetype).filter((hero) => !used.has(hero.key));
	const options: Hero[] = [];

	while (options.length < 3 && options.length < available.length) {
		const chosen = pickRandom(available.filter((hero) => !options.includes(hero)));
		options.push(chosen);
	}

	return options;
}

/**
 * Builds the five triples for a draft, in a randomised role order. A hero can
 * only ever be offered once, which matters because hybrids sit in both the main
 * and flex pool of a role.
 */
export function buildDraft(): DraftRound[] {
	const used = new Set<string>();

	return draftOrder().map((slot) => {
		const options = slot.id === 'tank' ? tankOptions(used) : slotOptions(slot, used);
		for (const hero of options) used.add(hero.key);
		return { slot, options };
	});
}
