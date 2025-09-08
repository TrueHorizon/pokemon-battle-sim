export type SimplePokemon = { name: string; types: string[] };

export async function fetchPokemons(): Promise<SimplePokemon[]> {
  const r = await fetch('/api/pokemons');
  if (!r.ok) throw new Error('Failed to fetch pokemons');
  return r.json();
}

export async function battle(pokemonA: string, pokemonB: string) {
  const r = await fetch('/api/battle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pokemonA, pokemonB })
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error || 'Battle API failed');
  }
  return r.json();
}
