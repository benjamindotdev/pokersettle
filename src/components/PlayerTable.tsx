import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";
import { formatCents, formatCentsSigned } from "@/lib/formatting";
import type { Player, PlayerNet } from "@/types/poker";

interface Props {
  players: Player[];
  nets: PlayerNet[];
  onChangeBuyIns: (id: string, buyIns: number) => void;
  onChangeFinalValue: (id: string, finalValue: number) => void;
}

export function PlayerTable({ players, nets, onChangeBuyIns, onChangeFinalValue }: Props) {
  const netById = new Map(nets.map((n) => [n.playerId, n]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardDescription>
          Enter how many buy-ins each player took and their final chip value.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {players.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add players to enter results.</p>
        ) : (
          <>
            {/* Mobile: stacked cards per player */}
            <ul className="grid gap-3 sm:hidden">
              {players.map((p) => {
                const n = netById.get(p.id);
                const net = n?.netCents ?? 0;
                return (
                  <li
                    key={p.id}
                    className="rounded-lg border border-border bg-muted/30 p-3 grid gap-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">{p.name || "—"}</span>
                      <span
                        className={cn(
                          "font-semibold tabular-nums text-base",
                          net > 0 && "text-success",
                          net < 0 && "text-destructive",
                          net === 0 && "text-muted-foreground",
                        )}
                      >
                        {formatCentsSigned(net)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1">
                        <Label htmlFor={`bi-${p.id}`} className="text-xs text-muted-foreground">
                          Buy-ins
                        </Label>
                        <Input
                          id={`bi-${p.id}`}
                          type="number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min={0}
                          step={1}
                          placeholder="0"
                          value={p.buyIns === 0 ? "" : p.buyIns}
                          onFocus={(e) => e.currentTarget.select()}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            onChangeBuyIns(p.id, Number.isFinite(v) && v >= 0 ? v : 0);
                          }}
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor={`fv-${p.id}`} className="text-xs text-muted-foreground">
                          Final chips
                        </Label>
                        <Input
                          id={`fv-${p.id}`}
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="0.01"
                          placeholder="0"
                          value={p.finalValue === 0 ? "" : p.finalValue}
                          onFocus={(e) => e.currentTarget.select()}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            onChangeFinalValue(p.id, Number.isFinite(v) && v >= 0 ? v : 0);
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Paid in:{" "}
                      <span className="tabular-nums">{formatCents(n?.paidInCents ?? 0)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Desktop: table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="py-2 pr-3 font-medium">Player</th>
                    <th className="py-2 px-3 font-medium w-28">Buy-ins</th>
                    <th className="py-2 px-3 font-medium w-28">Paid in</th>
                    <th className="py-2 px-3 font-medium w-36">Final chip value</th>
                    <th className="py-2 pl-3 font-medium w-32">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p) => {
                    const n = netById.get(p.id);
                    const net = n?.netCents ?? 0;
                    return (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className="py-2 pr-3 font-medium">{p.name || "—"}</td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            step={1}
                            placeholder="0"
                            value={p.buyIns === 0 ? "" : p.buyIns}
                            onFocus={(e) => e.currentTarget.select()}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10);
                              onChangeBuyIns(p.id, Number.isFinite(v) && v >= 0 ? v : 0);
                            }}
                            className="h-9"
                          />
                        </td>
                        <td className="py-2 px-3 text-muted-foreground tabular-nums">
                          {formatCents(n?.paidInCents ?? 0)}
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="0.01"
                            placeholder="0"
                            value={p.finalValue === 0 ? "" : p.finalValue}
                            onFocus={(e) => e.currentTarget.select()}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              onChangeFinalValue(p.id, Number.isFinite(v) && v >= 0 ? v : 0);
                            }}
                            className="h-9"
                          />
                        </td>
                        <td
                          className={cn(
                            "py-2 pl-3 font-semibold tabular-nums",
                            net > 0 && "text-success",
                            net < 0 && "text-destructive",
                            net === 0 && "text-muted-foreground",
                          )}
                          title={net > 0 ? "gets paid" : net < 0 ? "owes" : "settled"}
                        >
                          {formatCentsSigned(net)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
