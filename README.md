# PokerSettle

Settle up your home poker night in seconds. PokerSettle takes each player's buy-ins and final chip stack and tells you exactly who pays whom — using the minimum number of transfers.

No accounts, no backend. Everything runs in your browser and is saved to local storage.

## Features

- 🃏 **Multiple games** — track several poker nights in parallel and switch between them
- 💶 **Configurable buy-in** — set the buy-in amount per game (1 chip = 1 cent)
- 👥 **Player management** — add, rename, and remove players; track buy-ins and final stacks
- ⚖️ **Balance check** — instantly catch chip-count mismatches before settling
- 🔁 **Optimal settlement** — greedy algorithm that minimizes the number of transfers
- 📊 **Summary cards** — total pot, biggest winner, biggest loser, transfer count
- 📤 **Shareable summary** — copy a clean text recap to send to the group chat
- 💾 **Auto-save** — state is persisted in `localStorage`
- 📱 **Mobile-friendly** — responsive layout designed for phones at the table

## Tech stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for dev/build
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) for unit tests
- [lucide-react](https://lucide.dev/) icons

## Getting started

```bash
# install
npm install

# run dev server
npm run dev

# run tests
npm test

# production build
npm run build
npm run preview
```

## How it works

1. Set the buy-in amount for the game.
2. Add each player and the number of buy-ins they took.
3. Enter each player's final chip stack at the end of the night.
4. PokerSettle computes per-player nets in integer cents, verifies that final chips equal total chips paid in, and runs a greedy largest-debtor / largest-creditor match to produce the minimum-transfer settlement.
5. Share the result.

All math is done in integer cents to avoid floating-point rounding errors.

## Project structure

```
src/
  components/    UI components (table, forms, summary, share)
  lib/           settlement algorithm, formatting, storage
  types/         shared TypeScript types
  styles/        Tailwind globals
```

## License

MIT
