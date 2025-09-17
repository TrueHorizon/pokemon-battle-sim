import express from 'express';
import { simulateBattle, BattleRequest, BattleResult } from './battle';
import { loadPokemons, getPokemonByName } from './pokemon';

const app = express();
app.use(express.json());

const pokemons = loadPokemons();

// Returns the list of pokemons and their information
app.get('/api/pokemons', (_req, res) => {
  res.json(pokemons.map(p => ({ 
    id: p.id,
    name: p.name,
    img: p.img,
    types: Array.isArray(p.types) ? p.types : [String(p.types)],
    height: p.height,
    weight: p.weight,
    multipliers: p.multipliers,
    weaknesses: p.weaknesses
   })));
});

app.post('/api/battle', (req, res) => {
  try {
    const body: BattleRequest = req.body;
    if (!body?.pokemonA || !body?.pokemonB) {
      return res.status(400).json({ error: 'Request must include pokemonA and pokemonB names.' });
    }

    const a = getPokemonByName(pokemons, body.pokemonA);
    const b = getPokemonByName(pokemons, body.pokemonB);

    if (!a || !b) {
      return res.status(404).json({
        error: 'One or both Pokémon not found.',
        knownExamples: pokemons.slice(0, 5).map(p => p.name)
      });
    }

    const result: BattleResult = simulateBattle(a, b);
    return res.json(result);
  } catch (err: any) {
    console.error('Battle error:', err);
    return res.status(500).json({ error: 'Internal Server Error', detail: err?.message ?? String(err) });
  }
});

export default app;

