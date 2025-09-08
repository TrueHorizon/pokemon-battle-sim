# Pokémon Battle Simulator — Fullstack (Node.js + TypeScript backend, React frontend)

## Overview
This project implements a simple Pokémon battle simulator:
- Backend: Node.js + TypeScript + Express
  - Loads Pokémon from a JSON file (`backend/src/data/pokemons.json`)
  - POST `/api/battle` accepts `{ pokemonA, pokemonB }` and returns a round-by-round battle result
  - GET `/api/pokemons` returns list of Pokémon (name + types)
- Frontend: React + TypeScript (Vite)
  - Select two Pokémon and run a battle; displays round logs & winner

## Design choices / battle logic
- The dataset doesn't provide full battle stats, so stats are derived heuristically:
  - `hp = 50 + (height + weight) / 10` (rounded)
  - `attack = max(5, round(base_experience/3 + types*6 + nameLen%7))`
  - `defense = max(3, round(base_experience/4 + weight/50 + nameLen%5))`
- Round flow:
  - Each round, attacker order is decided randomly to add unpredictability.
  - Damage = max(1, round((attack - defense*0.5) * typeMultiplier * randomFactor))
  - `randomFactor` is between 0.85 and 1.15.
- Type effectiveness:
  - A small lookup table is implemented (fire > grass, water > fire, etc.). Unknown interactions default to `1.0`.

## How to run

### Backend
1. `cd backend`
2. `npm install`
3. Dev server: `npm run dev` (requires Node)
4. Build & run: `npm run build` && `npm start`
5. API:
   - `GET /api/pokemons` - lists available pokémon
   - `POST /api/battle` body `{ "pokemonA": "charmander", "pokemonB": "squirtle" }`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. The Vite dev server proxies `/api` to `http://localhost:4000` (configured in `vite.config.ts`). Make sure backend runs on port `4000`.

## Tests
- `cd backend`
- `npm test` (runs the simple Jest tests for `deriveStats` and `simulateBattle`)

## Notes & possible improvements
- Extend type-effectiveness chart to cover all types.
- Add "speed" stat to decide turn order deterministically.
- Use real PokéAPI dataset (or the provided `pokemons.json`) for richer stats.
- Add more comprehensive tests and CI.
