import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus } from "lucide-react";
import type { Player } from "@/types/poker";

interface Props {
  players: Player[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function PlayerForm({ players, onAdd, onRemove, onRename }: Props) {
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
      </CardContent>
    </Card>
  );
}
