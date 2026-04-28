import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Users, ArrowLeftRight, TrendingUp, TrendingDown } from "lucide-react";
import { formatCents, formatCentsSigned } from "@/lib/formatting";
import type { SettlementSummary } from "@/lib/settlement";

interface Props {
  summary: SettlementSummary;
}

export function SummaryCards({ summary }: Props) {
  const items = [
    {
      label: "Total pot",
      value: formatCents(summary.totalPotCents),
      icon: <Coins className="size-4 text-primary" />,
    },
    {
      label: "Players",
      value: String(summary.playerCount),
      icon: <Users className="size-4 text-primary" />,
    },
    {
      label: "Transfers needed",
      value: String(summary.transferCount),
      icon: <ArrowLeftRight className="size-4 text-primary" />,
    },
    {
      label: "Biggest winner",
      value: summary.biggestWinner
        ? `${summary.biggestWinner.name} ${formatCentsSigned(summary.biggestWinner.netCents)}`
        : "—",
      icon: <TrendingUp className="size-4 text-success" />,
    },
    {
      label: "Biggest loser",
      value: summary.biggestLoser
        ? `${summary.biggestLoser.name} ${formatCentsSigned(summary.biggestLoser.netCents)}`
        : "—",
      icon: <TrendingDown className="size-4 text-destructive" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {items.map((it) => (
        <Card key={it.label}>
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {it.icon}
              {it.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-semibold truncate" title={it.value}>
              {it.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
