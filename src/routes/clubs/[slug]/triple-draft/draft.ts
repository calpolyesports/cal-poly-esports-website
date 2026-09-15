import { pool, purePool, type Hero, type HeroArchetype, type HeroRole } from './heroes';

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

/** The tank triple is always one dive hero and two different brawl heroes. */
function tankOptions(used: Set<string>): Hero[] {
	const free = (candidates: Hero[]) => candidates.filter((hero) => !used.has(hero.key));

	const dive = pickRandom(free(purePool('tank', 'dive')));
	const brawlPool = free(purePool('tank', 'brawl'));
	const firstBrawl = pickRandom(brawlPool);
	const secondBrawl = pickRandom(brawlPool.filter((hero) => hero !== firstBrawl));

	return [dive, firstBrawl, secondBrawl];
}

/**
 * The damage and support triples are two pure heroes from the slot's own pool
 * plus one more drawn from what is left of that pool together with the role's
 * hybrids. So a triple never has more than one hybrid in it, and the third
 * option is a hybrid roughly in proportion to how many hybrids the role has.
 */
function slotOptions(slot: DraftSlot, used: Set<string>): Hero[] {
	const free = (candidates: Hero[]) => candidates.filter((hero) => !used.has(hero.key));

	const pure = free(purePool(slot.role, slot.archetype));
	const first = pickRandom(pure);
	const second = pickRandom(pure.filter((hero) => hero !== first));
	const third = pickRandom(
		free(pool(slot.role, slot.archetype)).filter((hero) => hero !== first && hero !== second)
	);

	return [first, second, third];
}

/**
 * Draws the triple for a round. `used` is updated with what was offered, so a
 * hero is only ever offered once per draft, which matters because hybrids sit
 * in both the main and flex pool of a role.
 */
export function drawRound(slot: DraftSlot, used: Set<string>): DraftRound {
	const options = slot.id === 'tank' ? tankOptions(used) : slotOptions(slot, used);

	for (const hero of options) used.add(hero.key);
	return { slot, options };
}
