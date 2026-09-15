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
 * Builds the five triples for a draft. A hero can only ever be offered once,
 * which matters because hybrids sit in both the main and flex pool of a role.
 */
export function buildDraft(): DraftRound[] {
	const used = new Set<string>();

	return SLOTS.map((slot) => {
		const options = slot.id === 'tank' ? tankOptions(used) : slotOptions(slot, used);
		for (const hero of options) used.add(hero.key);
		return { slot, options };
	});
}

/** Clash Royale style: the picker takes one, the opponent is handed one of the rest at random. */
export function awardLeftover(options: Hero[], picked: Hero): { given: Hero; discarded: Hero } {
	const rest = options.filter((hero) => hero.key !== picked.key);
	const given = pickRandom(rest);
	return { given, discarded: rest.find((hero) => hero.key !== given.key)! };
}
