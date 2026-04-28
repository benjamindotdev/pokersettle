import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { formatCents } from "@/lib/formatting";
import type { Transfer } from "@/types/poker";

interface Props {
  transfers: Transfer[];
  nameById: Map<string, string>;
  unbalanced: boolean;
}

export function SettlementList({ transfers, nameById, unbalanced }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settlement</CardTitle>
        <CardDescription>
          The simplest set of transfers to settle the game.
          {unbalanced && (
            <span className="block text-warning mt-1">
              Note: totals are unbalanced — these transfers may not perfectly cancel out.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transfers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing to settle yet.
          </p>
        ) : (
          <ul className="grid gap-2">
            {transfers.map((t, i) => (
              <li
                key={`${t.fromPlayerId}-${t.toPlayerId}-${i}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
              >
                <span className="font-medium">{nameById.get(t.fromPlayerId) ?? "?"}</span>
                <ArrowRight className="size-4 text-muted-foreground" />
                <span className="font-medium">{nameById.get(t.toPlayerId) ?? "?"}</span>
                <span className="ml-auto font-semibold tabular-nums text-primary">
                  {formatCents(t.amountCents)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
