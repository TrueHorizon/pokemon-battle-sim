import { PokemonData } from './pokemon';

export type StatSet = {
  hp: number;
  attack: number;
  defense: number;
  types: string[];
  name: string;
};

// Request shape
export type BattleRequest = {
  pokemonA: string;
  pokemonB: string;
};

// Response shape
export type RoundLog = {
  round: number;
  attacker: string;
  defender: string;
  damage: number;
  attackerHP: number;
  defenderHP: number;
  note?: string;
};

export type BattleResult = {
  winner: string;
  loser: string;
  rounds: RoundLog[];
  finishedAtRound: number;
};

const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  // attacker -> defender -> multiplier
  fire: { grass: 2.0, water: 0.5, fire: 0.5, rock: 0.5, bug: 2.0, steel: 2.0 },
  water: { fire: 2.0, grass: 0.5, water: 0.5, ground: 2.0, rock: 2.0 },
  grass: { water: 2.0, fire: 0.5, grass: 0.5, rock: 2.0, ground: 2.0, flying: 0.5 },
  electric: { water: 2.0, electric: 0.5, ground: 0.0, flying: 2.0 },
  rock: { fire: 2.0, ice: 2.0, flying: 2.0, bug: 2.0 },
  // fallback mapping — others default to 1.0
};

function typeMultiplier(attackerTypes: string[], defenderTypes: string[]): number {
  let mult = 1;
  attackerTypes.forEach(at => {
    defenderTypes.forEach(dt => {
      const map = TYPE_EFFECTIVENESS[at.toLowerCase()];
      if (map && typeof map[dt.toLowerCase()] === 'number') {
        mult *= map[dt.toLowerCase()];
      } else {
        mult *= 1;
      }
    });
  });
  return mult;
}

/**
 * Heuristic to derive stats from available fields.
 * - HP base: 50 + (height + weight)/10 rounded
 * - Attack: base_experience/3 + number-of-types * 5 + name length modifier
 * - Defense: base_experience/4 + weight/50, etc.
 *
 * These formulas are intentionally simple and deterministic given the PokemonData.
 */
export function deriveStats(p: PokemonData): StatSet {
  const height = typeof p.height === 'number' ? p.height : 10;
  const weight = typeof p.weight === 'number' ? p.weight : 100;
  const baseExp = typeof p.base_experience === 'number' ? p.base_experience : 100;

  const hp = Math.max(20, Math.round(50 + (height + weight) / 10));
  const attack = Math.max(5, Math.round(baseExp / 3 + (p.types?.length ?? 1) * 6 + (p.name.length % 7)));
  const defense = Math.max(3, Math.round(baseExp / 4 + weight / 50 + (p.name.length % 5)));

  return {
    hp,
    attack,
    defense,
    types: p.types.map(t => t.toLowerCase()),
    name: p.name
  };
}

/**
 * Simulate a battle round by round.
 * Turn order: higher speed would normally go first, but since we don't have speed,
 * we'll decide randomly each round who attacks first to add variety.
 *
 * Damage formula: raw = attack - defense * 0.5; final = Math.max(1, raw) * typeMultiplier * randomFactor
 */
export function simulateBattle(a: PokemonData, b: PokemonData): BattleResult {
  const A = deriveStats(a);
  const B = deriveStats(b);

  let hpA = A.hp;
  let hpB = B.hp;

  const rounds: RoundLog[] = [];
  let round = 0;
  const MAX_ROUNDS = 200;

  while (hpA > 0 && hpB > 0 && round < MAX_ROUNDS) {
    round++;
    // Randomly decide order this round (adds unpredictability)
    const firstIsA = Math.random() < 0.5;

    const seq = firstIsA ? [{att: A, def: B, hpAtt: () => hpA, hpDef: () => hpB}, {att: B, def: A, hpAtt: () => hpB, hpDef: () => hpA}]
                         : [{att: B, def: A, hpAtt: () => hpB, hpDef: () => hpA}, {att: A, def: B, hpAtt: () => hpA, hpDef: () => hpB}];

    for (const turn of seq) {
      if (hpA <= 0 || hpB <= 0) break;

      const attacker = turn.att;
      const defender = turn.def;

      const baseRaw = Math.max(1, attacker.attack - defender.defense * 0.5);
      const tMult = typeMultiplier(attacker.types, defender.types); // e.g., 2.0, 0.5, 1.0
      const rand = 0.85 + Math.random() * 0.3; // 0.85 - 1.15
      const damage = Math.max(1, Math.round(baseRaw * tMult * rand));

      let note: string | undefined;
      if (tMult > 1.5) note = 'It\'s super effective!';
      else if (tMult < 0.75) note = 'It\'s not very effective...';

      if (attacker === A) {
        hpB -= damage;
        if (hpB < 0) hpB = 0;
        rounds.push({
          round,
          attacker: attacker.name,
          defender: defender.name,
          damage,
          attackerHP: hpA,
          defenderHP: hpB,
          note,
        });
      } else {
        hpA -= damage;
        if (hpA < 0) hpA = 0;
        rounds.push({
          round,
          attacker: attacker.name,
          defender: defender.name,
          damage,
          attackerHP: hpB,
          defenderHP: hpA,
          note,
        });
      }
    }
  }

  const winner = hpA > hpB ? A.name : (hpB > hpA ? B.name : (Math.random() < 0.5 ? A.name : B.name));
  const loser = winner === A.name ? B.name : A.name;

  return {
    winner,
    loser,
    rounds,
    finishedAtRound: round
  };
}
