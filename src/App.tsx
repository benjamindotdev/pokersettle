import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { GameSettingsPanel } from "@/components/GameSettings";
import { PlayerForm } from "@/components/PlayerForm";
import { PlayerTable } from "@/components/PlayerTable";
import { BalanceCheckBanner } from "@/components/BalanceCheck";
import { SettlementList } from "@/components/SettlementList";
import { SummaryCards } from "@/components/SummaryCards";
import { ShareSummary } from "@/components/ShareSummary";
import { createId, loadState, saveState } from "@/lib/storage";
import {
  calculateSettlement,
  computeBalance,
  computeNets,
  computeSummary,
} from "@/lib/settlement";
import type { Game, Player } from "@/types/poker";

function makeGame(name = "New game"): Game {
  const now = Date.now();
  return {
    id: createId(),
    name,
    createdAt: now,
    updatedAt: now,
    settings: { buyInAmount: 10 },
    players: [],
  };
}

export default function App() {
  const [games, setGames] = useState<Game[]>(() => {
    const persisted = loadState();
    if (persisted.games.length > 0) return persisted.games;
    return [makeGame("Friday night poker")];
  });
  const [activeGameId, setActiveGameId] = useState<string>(() => {
    const persisted = loadState();
    if (persisted.activeGameId && persisted.games.some((g) => g.id === persisted.activeGameId)) {
      return persisted.activeGameId;
    }
    if (persisted.games[0]) return persisted.games[0].id;
    return "";
  });

  // Persist on every change
  useEffect(() => {
    saveState({ games, activeGameId });
  }, [games, activeGameId]);

  // Make sure active id is always valid
  useEffect(() => {
    if (!games.some((g) => g.id === activeGameId) && games[0]) {
      setActiveGameId(games[0].id);
    }
  }, [games, activeGameId]);

  const activeGame = games.find((g) => g.id === activeGameId) ?? games[0];

  const updateActive = (updater: (g: Game) => Game) => {
    setGames((prev) =>
      prev.map((g) => (g.id === activeGameId ? { ...updater(g), updatedAt: Date.now() } : g)),
    );
  };

  // Game-level handlers
  const handleNewGame = () => {
    const g = makeGame(`Game ${games.length + 1}`);
    setGames((prev) => [...prev, g]);
    setActiveGameId(g.id);
  };
  const handleSelectGame = (id: string) => setActiveGameId(id);
  const handleResetGame = () => {
    if (!confirm("Reset this game? This will clear all players and results.")) return;
    updateActive((g) => ({ ...g, players: [] }));
  };
  const handleDeleteGame = () => {
    if (games.length <= 1) return;
    if (!confirm("Delete this game? This can't be undone.")) return;
    setGames((prev) => {
      const next = prev.filter((g) => g.id !== activeGameId);
      return next;
    });
  };
  const handleChangeBuyIn = (amount: number) =>
    updateActive((g) => ({ ...g, settings: { ...g.settings, buyInAmount: amount } }));

  // Player-level handlers
  const handleAddPlayer = (name: string) =>
    updateActive((g) => ({
      ...g,
      players: [
        ...g.players,
        { id: createId(), name, buyIns: 1, finalValue: 0 } satisfies Player,
      ],
    }));
  const handleRemovePlayer = (id: string) =>
    updateActive((g) => ({ ...g, players: g.players.filter((p) => p.id !== id) }));
  const handleRenamePlayer = (id: string, name: string) =>
    updateActive((g) => ({
      ...g,
      players: g.players.map((p) => (p.id === id ? { ...p, name } : p)),
    }));
  const handleChangeBuyIns = (id: string, buyIns: number) =>
    updateActive((g) => ({
      ...g,
      players: g.players.map((p) => (p.id === id ? { ...p, buyIns } : p)),
    }));
  const handleChangeFinalValue = (id: string, finalValue: number) =>
    updateActive((g) => ({
      ...g,
      players: g.players.map((p) => (p.id === id ? { ...p, finalValue } : p)),
    }));

  const players = activeGame?.players ?? [];
  const settings = activeGame?.settings ?? { buyInAmount: 10 };

  const nets = useMemo(
    () => computeNets(players, settings.buyInAmount),
    [players, settings.buyInAmount],
  );
  const balance = useMemo(() => computeBalance(nets), [nets]);
  const transfers = useMemo(() => calculateSettlement(nets), [nets]);
  const summary = useMemo(() => computeSummary(nets, transfers), [nets, transfers]);
  const nameById = useMemo(() => new Map(players.map((p) => [p.id, p.name])), [players]);

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-3xl px-3 py-5 sm:px-4 sm:py-8 grid gap-5 sm:gap-6">
        <Header />

        <SummaryCards summary={summary} />

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          <GameSettingsPanel
            games={games}
            activeGameId={activeGame?.id ?? ""}
            onSelectGame={handleSelectGame}
            onNewGame={handleNewGame}
            onResetGame={handleResetGame}
            onDeleteGame={handleDeleteGame}
          />
          <PlayerForm
            players={players}
            buyInAmount={settings.buyInAmount}
            onAdd={handleAddPlayer}
            onRemove={handleRemovePlayer}
            onRename={handleRenamePlayer}
            onChangeBuyIn={handleChangeBuyIn}
          />
        </div>

        <PlayerTable
          players={players}
          nets={nets}
          onChangeBuyIns={handleChangeBuyIns}
          onChangeFinalValue={handleChangeFinalValue}
        />

        <BalanceCheckBanner balance={balance} hasPlayers={players.length > 0} />

        <SettlementList
          transfers={transfers}
          nameById={nameById}
          unbalanced={!balance.isBalanced}
        />

        <ShareSummary
          transfers={transfers}
          nets={nets}
          unbalanced={!balance.isBalanced}
        />
        <footer className="flex flex-row gap-2 items-center justify-center">
            <span className="text-sm text-inherit opacity-80">Built by</span>
                <a
                    href="https://benjamin.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-100"
                    aria-label="Built by benjamin.dev"
                >
                    <img
                        src="/benjamin.jpeg"
                        alt="benjamin.dev"
                        className="h-5 w-5 rounded-full object-cover"
                    />
                </a>
        </footer>
      </div>
    </div>
  );
}
