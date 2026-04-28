import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { formatCents, formatCentsSigned } from "@/lib/formatting";
import type { PlayerNet, Transfer } from "@/types/poker";

interface Props {
  transfers: Transfer[];
  nets: PlayerNet[];
  unbalanced: boolean;
}

function buildSummary(transfers: Transfer[], nets: PlayerNet[], unbalanced: boolean): string {
  const nameById = new Map(nets.map((n) => [n.playerId, n.name]));
  const lines: string[] = [];
  lines.push("Poker settlement:");
  if (transfers.length === 0) {
    lines.push("- (no transfers needed)");
  } else {
    for (const t of transfers) {
      lines.push(
        `- ${nameById.get(t.fromPlayerId) ?? "?"} pays ${nameById.get(t.toPlayerId) ?? "?"} ${formatCents(t.amountCents)}`,
      );
    }
  }
  lines.push("");
  lines.push("Results:");
  const sorted = [...nets].sort((a, b) => b.netCents - a.netCents);
  for (const n of sorted) {
    lines.push(`- ${n.name}: ${formatCentsSigned(n.netCents)}`);
  }
  if (unbalanced) {
    lines.push("");
    lines.push("(Note: totals were unbalanced.)");
  }
  return lines.join("\n");
}

export function ShareSummary({ transfers, nets, unbalanced }: Props) {
  const [copied, setCopied] = useState(false);
  const text = useMemo(
    () => buildSummary(transfers, nets, unbalanced),
    [transfers, nets, unbalanced],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: select-and-copy via a temporary textarea
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // ignore
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="relative">
          <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 pr-12 text-xs leading-relaxed">
{text}
          </pre>
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="icon"
            className="absolute bottom-2 right-2"
            aria-label={copied ? "Copied" : "Copy summary"}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
