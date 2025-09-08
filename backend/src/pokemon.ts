import path from 'path';
import fs from 'fs';

export type PokemonData = {
  id?: number;
  name: string;
  types: string[] | string;   // tolerate string or array
  height?: number;
  weight?: number;
  base_experience?: number;
};

// normalize any types shape → array of lowercase strings
export function normalizeTypes(value: PokemonData['types']): string[] {
  if (Array.isArray(value)) return value.map(t => String(t).toLowerCase());
  if (typeof value === 'string') {
    return value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  }
  return ['normal']; // fallback
}

export function loadPokemons(): PokemonData[] {
  const p = path.join(__dirname, 'data', 'pokemons.json');
  const raw = fs.readFileSync(p, 'utf-8');
  const data = JSON.parse(raw);

  // Accept array, {results: [...]}, or {pokemon: [...]}
  const list: any[] =
    Array.isArray(data) ? data :
    Array.isArray((data || {}).results) ? data.results :
    Array.isArray((data || {}).pokemon) ? data.pokemon :
    [];

  if (!Array.isArray(list) || list.length === 0) {
    console.error('Could not find an array of Pokémon in pokemons.json');
    throw new Error('Unexpected Pokémon JSON format');
  }

  // Ensure every item has a normalized types array
  return list.map((p) => ({
    ...p,
    types: normalizeTypes(p.types),
    name: String(p.name),
  }));
}

export function getPokemonByName(pokemons: PokemonData[], name: string): PokemonData | undefined {
  const n = name.trim().toLowerCase();
  return pokemons.find(p => p.name.toLowerCase() === n);
}
