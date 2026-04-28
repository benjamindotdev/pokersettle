import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Game, GameSettings } from "@/types/poker";

interface Props {
  games: Game[];
  activeGameId: string;
  settings: GameSettings;
  onChangeBuyIn: (amount: number) => void;
  onSelectGame: (id: string) => void;
  onNewGame: () => void;
  onRenameGame: (name: string) => void;
  onResetGame: () => void;
  onDeleteGame: () => void;
  activeGameName: string;
}

export function GameSettingsPanel({
  games,
  activeGameId,
  settings,
  onChangeBuyIn,
  onSelectGame,
  onNewGame,
  onRenameGame,
  onResetGame,
  onDeleteGame,
  activeGameName,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game settings</CardTitle>
        <CardDescription>Set the buy-in amount and manage saved games.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="game-name">Game name</Label>
          <Input
            id="game-name"
            value={activeGameName}
            onChange={(e) => onRenameGame(e.target.value)}
            placeholder="Friday night poker"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="active-game">Active game</Label>
          <select
            id="active-game"
            value={activeGameId}
            onChange={(e) => onSelectGame(e.target.value)}
            className="h-11 w-full rounded-md border border-border bg-input px-3 text-base sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name || "Untitled game"}
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
              value={Number.isFinite(settings.buyInAmount) ? settings.buyInAmount : 0}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                onChangeBuyIn(Number.isFinite(v) ? v : 0);
              }}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Currency</Label>
          <Input value={settings.currency} disabled readOnly />
        </div>
        <div className="sm:col-span-2 flex flex-wrap gap-2 pt-2">
          <Button variant="secondary" onClick={onNewGame}>
            New game
          </Button>
          <Button variant="outline" onClick={onResetGame}>
            Reset current game
          </Button>
          <Button
            variant="destructive"
            onClick={onDeleteGame}
            disabled={games.length <= 1}
            title={games.length <= 1 ? "Can't delete the only game" : "Delete this game"}
          >
            Delete game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
