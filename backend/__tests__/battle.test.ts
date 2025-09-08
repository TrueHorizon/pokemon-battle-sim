import { simulateBattle, deriveStats } from '../src/battle';
import { PokemonData } from '../src/pokemon';

const charmander: PokemonData = { name: 'charmander', types: ['fire'], height: 6, weight: 85, base_experience: 62 };
const squirtle: PokemonData = { name: 'squirtle', types: ['water'], height: 5, weight: 90, base_experience: 63 };

test('deriveStats produces positive stats', () => {
  const s = deriveStats(charmander);
  expect(s.hp).toBeGreaterThan(0);
  expect(s.attack).toBeGreaterThan(0);
  expect(s.defense).toBeGreaterThan(0);
});

test('simulateBattle returns a winner and rounds', () => {
  const res = simulateBattle(charmander, squirtle);
  expect(res.winner).toBeDefined();
  expect(res.rounds.length).toBeGreaterThan(0);
  expect(res.finishedAtRound).toBeGreaterThan(0);
});
