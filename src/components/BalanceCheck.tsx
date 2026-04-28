import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatCents } from "@/lib/formatting";
import type { BalanceCheck } from "@/lib/settlement";

interface Props {
  balance: BalanceCheck;
  hasPlayers: boolean;
}

export function BalanceCheckBanner({ balance, hasPlayers }: Props) {
  if (!hasPlayers) return null;

  if (balance.isBalanced) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm">
        <CheckCircle2 className="size-4 text-success" />
        <span>
          Totals match. Total pot:{" "}
          <strong>{formatCents(balance.totalPaidInCents)}</strong>.
        </span>
      </div>
    );
  }

  const diff = balance.differenceCents;
  const sign = diff > 0 ? "+" : "";
  return (
    <div className="flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
      <AlertTriangle className="size-4 text-warning" />
      <span>
        Final chip values should add up to the total buy-ins. Difference:{" "}
        <strong>
          {sign}
          {formatCents(diff)}
        </strong>
        . Settlement will still be calculated, but it will be marked as
        unbalanced.
      </span>
    </div>
  );
}
