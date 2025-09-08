import React from 'react';

type Round = {
  round: number;
  attacker: string;
  defender: string;
  damage: number;
  attackerHP: number;
  defenderHP: number;
  note?: string;
};

export default function BattleResult({ rounds, winner, loser, finishedAtRound }: { rounds: Round[], winner: string, loser: string, finishedAtRound: number }) {
  return (
    <div>
      <h3>Winner: {winner} <small>vs {loser}</small></h3>
      <p>Finished at round {finishedAtRound}. Rounds: {rounds.length}</p>
      <div>
        {rounds.map((r, idx) => (
          <div key={idx} className="round">
            <strong>Round {r.round} — {r.attacker} → {r.defender}</strong>
            <div>Damage: {r.damage} {r.note ? `(${r.note})` : ''}</div>
            <div>Attacker HP after: {r.attackerHP} — Defender HP after: {r.defenderHP}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
