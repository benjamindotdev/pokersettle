import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Users, ArrowLeftRight } from "lucide-react";
import { formatCents } from "@/lib/formatting";
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
      label: "Transfers",
      value: String(summary.transferCount),
      icon: <ArrowLeftRight className="size-4 text-primary" />,
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 lg:grid-cols-5">
      {items.map((it) => (
        <Card key={it.label}>
          <CardHeader className="pb-1">
            <CardTitle title={it.value} className="text-2xl font-semibold truncate">
                {it.value}
             
              
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide" >
              {it.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
