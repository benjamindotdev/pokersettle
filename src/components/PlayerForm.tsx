import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, UserPlus } from "lucide-react";
import type { Player } from "@/types/poker";

interface Props {
  players: Player[];
  buyInAmount: number;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onChangeBuyIn: (amount: number) => void;
}

export function PlayerForm({
  players,
  buyInAmount,
  onAdd,
  onRemove,
  onRename,
  onChangeBuyIn,
}: Props) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    onAdd(trimmed.length > 0 ? trimmed : `Player ${players.length + 1}`);
    setName("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <Input
            placeholder={`Player ${players.length + 1}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit">
            <UserPlus className="size-4" />
          </Button>
        </form>

          <ul className="grid gap-2">
            {players.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <Input
                  value={p.name}
                  onChange={(e) => onRename(p.id, e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${p.name}`}
                  onClick={() => onRemove(p.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>

        <div className="grid gap-2">
          <Label htmlFor="buy-in">Buy-in</Label>
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
              value={!Number.isFinite(buyInAmount) || buyInAmount === 0 ? "" : buyInAmount}
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                onChangeBuyIn(Number.isFinite(v) ? v : 0);
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
