import React, { useEffect, useState } from 'react';
import { fetchPokemons, battle } from './api';
import PokemonSelector from './components/PokemonSelector';
import BattleResult from './components/BattleResult';

export default function App() {
  const [pokemons, setPokemons] = useState<{ name: string, types: string[] }[]>([]);
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPokemons().then(setPokemons).catch(err => setError(err.message));
  }, []);

  async function handleBattle() {
    setError(null);
    setResult(null);
    if (!a || !b) {
      setError('Select both Pokémon');
      return;
    }
    setLoading(true);
    try {
      const res = await battle(a, b);
      setResult(res);
    } catch (e: any) {
      setError(e.message || 'Battle failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Pokémon Battle Simulator</h1>
        <small>Demo frontend</small>
      </div>

      <div className="controls">
        <div>
          <label>Pokémon A</label><br/>
          <PokemonSelector pokemons={pokemons} value={a} onChange={setA} />
        </div>
        <div>
          <label>Pokémon B</label><br/>
          <PokemonSelector pokemons={pokemons} value={b} onChange={setB} />
        </div>
        <div style={{alignSelf: 'end'}}>
          <button onClick={handleBattle} disabled={loading}>Battle!</button>
        </div>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {loading && <div>Fighting…</div>}

      {result && <BattleResult rounds={result.rounds} winner={result.winner} loser={result.loser} finishedAtRound={result.finishedAtRound} />}
    </div>
  );
}
