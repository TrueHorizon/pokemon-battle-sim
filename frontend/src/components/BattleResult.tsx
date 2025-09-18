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
      <div>
        {rounds.map((r, idx) => (
          <div key={idx} className="round">
            <strong>Round {r.round} — {r.attacker} → {r.defender}</strong>
            <div>{r.attacker} attacks {r.defender} for {r.damage} damage.</div>
            <div>{r.note ? `${r.note}` : ''}</div>
            <div>{r.attacker}&apos;s HP after: {r.attackerHP} — {r.defender}&apos;s HP after: {r.defenderHP}</div>
          </div>
        ))}
      </div>
      <p>Finished at round {finishedAtRound}. Number of Attacks: {rounds.length}</p>
      <h3>Winner: {winner}</h3>
    </div>
  );
}
