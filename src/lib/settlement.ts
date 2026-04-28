import type { Player, PlayerNet, Transfer } from "@/types/poker";
import { eurosToCents } from "./formatting";

/**
 * Compute per-player net amounts (in cents).
 */
export function computeNets(players: Player[], buyInAmountEuros: number): PlayerNet[] {
  const buyInCents = eurosToCents(buyInAmountEuros);
  return players.map((p) => {
    const paidInCents = Math.max(0, Math.floor(p.buyIns)) * buyInCents;
    const finalValueCents = eurosToCents(p.finalValue);
    return {
      playerId: p.id,
      name: p.name,
      paidInCents,
      finalValueCents,
      netCents: finalValueCents - paidInCents,
    };
  });
}

export interface BalanceCheck {
  totalPaidInCents: number;
  totalFinalValueCents: number;
  /** finalValue - paidIn. Should be 0 for a balanced game. */
  differenceCents: number;
  isBalanced: boolean;
}

export function computeBalance(nets: PlayerNet[]): BalanceCheck {
  const totalPaidInCents = nets.reduce((s, n) => s + n.paidInCents, 0);
  const totalFinalValueCents = nets.reduce((s, n) => s + n.finalValueCents, 0);
  const differenceCents = totalFinalValueCents - totalPaidInCents;
  return {
    totalPaidInCents,
    totalFinalValueCents,
    differenceCents,
    isBalanced: differenceCents === 0,
  };
}

/**
 * Greedy minimum-transfers settlement.
 *
 * Sorts creditors and debtors by absolute amount descending, then repeatedly
 * matches the largest debtor with the largest creditor, transferring
 * min(debt, credit). All math is done in integer cents.
 */
export function calculateSettlement(nets: PlayerNet[]): Transfer[] {
  const creditors = nets
    .filter((n) => n.netCents > 0)
    .map((n) => ({ id: n.playerId, amount: n.netCents }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = nets
    .filter((n) => n.netCents < 0)
    .map((n) => ({ id: n.playerId, amount: -n.netCents })) // store as positive
    .sort((a, b) => b.amount - a.amount);

  const transfers: Transfer[] = [];

  let ci = 0;
  let di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci];
    const debtor = debtors[di];
    const amount = Math.min(creditor.amount, debtor.amount);

    if (amount > 0) {
      transfers.push({
        fromPlayerId: debtor.id,
        toPlayerId: creditor.id,
        amountCents: amount,
      });
    }

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount === 0) ci++;
    if (debtor.amount === 0) di++;
  }

  return transfers;
}

export interface SettlementSummary {
  totalPotCents: number;
  playerCount: number;
  transferCount: number;
  biggestWinner: PlayerNet | null;
  biggestLoser: PlayerNet | null;
}

export function computeSummary(nets: PlayerNet[], transfers: Transfer[]): SettlementSummary {
  const totalPotCents = nets.reduce((s, n) => s + n.paidInCents, 0);
  let biggestWinner: PlayerNet | null = null;
  let biggestLoser: PlayerNet | null = null;
  for (const n of nets) {
    if (n.netCents > 0 && (!biggestWinner || n.netCents > biggestWinner.netCents)) {
      biggestWinner = n;
    }
    if (n.netCents < 0 && (!biggestLoser || n.netCents < biggestLoser.netCents)) {
      biggestLoser = n;
    }
  }
  return {
    totalPotCents,
    playerCount: nets.length,
    transferCount: transfers.length,
    biggestWinner,
    biggestLoser,
  };
}
