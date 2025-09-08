import React from 'react';

type Props = {
  pokemons: { name: string, types: string[] }[];
  value: string;
  onChange: (v: string) => void;
};

export default function PokemonSelector({ pokemons, value, onChange }: Props) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">-- choose --</option>
      {pokemons.map(p => (
        <option key={p.name} value={p.name}>{p.name} {p.types && `(${p.types.join(',')})`}</option>
      ))}
    </select>
  );
}
