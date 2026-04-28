import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import type { Game, GameSettings } from "@/types/poker";

interface Props {
  games: Game[];
  activeGameId: string;
  settings: GameSettings;
  onChangeBuyIn: (amount: number) => void;
  onChangeChipsPerBuyIn: (chips: number) => void;
  onSelectGame: (id: string) => void;
  onNewGame: () => void;
  onResetGame: () => void;
  onDeleteGame: () => void;
}

function formatGameDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function GameSettingsPanel({
  games,
  activeGameId,
  settings,
  onChangeBuyIn,
  onChangeChipsPerBuyIn,
  onSelectGame,
  onNewGame,
  onResetGame,
  onDeleteGame,
}: Props) {
  // Compute "(N)" suffixes against chronological order so the earliest game on
  // a given date has no suffix and later ones get (2), (3), ...
  const chronological = [...games].sort((a, b) => a.createdAt - b.createdAt);
  const labelById = new Map<string, string>();
  const counts = new Map<string, number>();
  for (const g of chronological) {
    const date = formatGameDate(g.createdAt);
    const next = (counts.get(date) ?? 0) + 1;
    counts.set(date, next);
    labelById.set(g.id, next === 1 ? date : `${date} (${next})`);
  }
  const sortedGames = [...games].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Card>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="active-game">Active game</Label>
          <select
            id="active-game"
            value={activeGameId}
            onChange={(e) => onSelectGame(e.target.value)}
            className="h-11 w-full rounded-md border border-border bg-input px-3 text-base sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {sortedGames.map((g) => (
              <option key={g.id} value={g.id}>
                {labelById.get(g.id) ?? formatGameDate(g.createdAt)}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="buy-in">Buy-in amount</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              €
            </span>
            <Input
              id="buy-in"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              className="pl-7"
              placeholder="0"
              value={!Number.isFinite(settings.buyInAmount) || settings.buyInAmount === 0 ? "" : settings.buyInAmount}
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                onChangeBuyIn(Number.isFinite(v) ? v : 0);
              }}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="chips-per-buyin">Chips per buy-in</Label>
          <Input
            id="chips-per-buyin"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="1000"
            value={
              !Number.isFinite(settings.chipsPerBuyIn) || settings.chipsPerBuyIn === 0
                ? ""
                : settings.chipsPerBuyIn
            }
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              onChangeChipsPerBuyIn(Number.isFinite(v) && v > 0 ? v : 0);
            }}
          />
        </div>
        <div className="sm:col-span-2 flex flex-wrap gap-2 pt-2">
          <Button variant="secondary" onClick={onNewGame} aria-label="New game" title="New game">
            <Plus className="size-4" />
            <span className="sr-only sm:not-sr-only">New game</span>
          </Button>
          <Button
            variant="outline"
            onClick={onResetGame}
            aria-label="Reset current game"
            title="Reset current game"
          >
            <RotateCcw className="size-4" />
            <span className="sr-only sm:not-sr-only">Reset</span>
          </Button>
          <Button
            variant="destructive"
            onClick={onDeleteGame}
            disabled={games.length <= 1}
            aria-label={games.length <= 1 ? "Can't delete the only game" : "Delete this game"}
            title={games.length <= 1 ? "Can't delete the only game" : "Delete this game"}
          >
            <Trash2 className="size-4" />
            <span className="sr-only sm:not-sr-only">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
