import { describe, it, expect } from "vitest";
import {
  calculateSettlement,
  computeBalance,
  computeNets,
  computeSummary,
} from "./settlement";
import type { Player } from "@/types/poker";

const players = (data: Array<Partial<Player> & { name: string }>): Player[] =>
  data.map((p, i) => ({
    id: p.id ?? `p${i}`,
    name: p.name,
    buyIns: p.buyIns ?? 1,
    finalValue: p.finalValue ?? 0,
  }));

describe("computeNets", () => {
  it("computes paid-in and net in cents", () => {
    const nets = computeNets(
      players([
        { name: "Alice", buyIns: 1, finalValue: 0 },
        { name: "Bob", buyIns: 1, finalValue: 25 },
        { name: "Charlie", buyIns: 2, finalValue: 15 },
      ]),
      10,
    );

    expect(nets.find((n) => n.name === "Alice")).toMatchObject({
      paidInCents: 1000,
      finalValueCents: 0,
      netCents: -1000,
    });
    expect(nets.find((n) => n.name === "Bob")).toMatchObject({
      paidInCents: 1000,
      finalValueCents: 2500,
      netCents: 1500,
    });
    expect(nets.find((n) => n.name === "Charlie")).toMatchObject({
      paidInCents: 2000,
      finalValueCents: 1500,
      netCents: -500,
    });
  });
});

describe("computeBalance", () => {
  it("flags balanced game", () => {
    const nets = computeNets(
      players([
        { name: "A", buyIns: 1, finalValue: 0 },
        { name: "B", buyIns: 1, finalValue: 25 },
        { name: "C", buyIns: 2, finalValue: 15 },
      ]),
      10,
    );
    const b = computeBalance(nets);
    expect(b.isBalanced).toBe(true);
    expect(b.differenceCents).toBe(0);
    expect(b.totalPaidInCents).toBe(4000);
  });

  it("flags unbalanced game with positive difference", () => {
    const nets = computeNets(
      players([
        { name: "A", buyIns: 1, finalValue: 5 },
        { name: "B", buyIns: 1, finalValue: 20 },
      ]),
      10,
    );
    const b = computeBalance(nets);
    expect(b.isBalanced).toBe(false);
    expect(b.differenceCents).toBe(500);
  });
});

describe("calculateSettlement", () => {
  it("matches the example scenario", () => {
    const nets = computeNets(
      players([
        { id: "a", name: "Alice", buyIns: 1, finalValue: 0 },
        { id: "b", name: "Bob", buyIns: 1, finalValue: 25 },
        { id: "c", name: "Charlie", buyIns: 2, finalValue: 15 },
      ]),
      10,
    );
    const transfers = calculateSettlement(nets);
    // Expected: Alice -> Bob €10, Charlie -> Bob €5
    expect(transfers).toHaveLength(2);
    expect(transfers).toContainEqual({
      fromPlayerId: "a",
      toPlayerId: "b",
      amountCents: 1000,
    });
    expect(transfers).toContainEqual({
      fromPlayerId: "c",
      toPlayerId: "b",
      amountCents: 500,
    });
  });

  it("returns no transfers when everyone is settled", () => {
    const nets = computeNets(
      players([
        { name: "A", buyIns: 1, finalValue: 10 },
        { name: "B", buyIns: 1, finalValue: 10 },
      ]),
      10,
    );
    expect(calculateSettlement(nets)).toEqual([]);
  });

  it("handles fractional final values without floating point drift", () => {
    const nets = computeNets(
      players([
        { id: "a", name: "A", buyIns: 1, finalValue: 12.5 },
        { id: "b", name: "B", buyIns: 1, finalValue: 7.5 },
      ]),
      10,
    );
    const transfers = calculateSettlement(nets);
    expect(transfers).toHaveLength(1);
    expect(transfers[0]).toEqual({
      fromPlayerId: "b",
      toPlayerId: "a",
      amountCents: 250,
    });
  });

  it("uses greedy largest-first matching to minimize transfers", () => {
    // 3 debtors of -10/-10/-20, 2 creditors of +25/+15
    const nets = computeNets(
      players([
        { id: "d1", name: "D1", buyIns: 1, finalValue: 0 },
        { id: "d2", name: "D2", buyIns: 1, finalValue: 0 },
        { id: "d3", name: "D3", buyIns: 2, finalValue: 0 },
        { id: "c1", name: "C1", buyIns: 0, finalValue: 25 },
        { id: "c2", name: "C2", buyIns: 0, finalValue: 15 },
      ]),
      10,
    );
    const transfers = calculateSettlement(nets);
    // Greedy walks largest-first: D3(20)->C1(25), then D1(10)->C1(5), D1(5)->C2(10), D2(10)->C2(5)
    expect(transfers).toHaveLength(4);
    const total = transfers.reduce((s, t) => s + t.amountCents, 0);
    expect(total).toBe(4000);
    // Every transfer must reference a real debtor and creditor
    for (const t of transfers) {
      expect(["d1", "d2", "d3"]).toContain(t.fromPlayerId);
      expect(["c1", "c2"]).toContain(t.toPlayerId);
    }
  });
});

describe("computeSummary", () => {
  it("identifies biggest winner and loser", () => {
    const nets = computeNets(
      players([
        { name: "Alice", buyIns: 1, finalValue: 0 },
        { name: "Bob", buyIns: 1, finalValue: 25 },
        { name: "Charlie", buyIns: 2, finalValue: 15 },
      ]),
      10,
    );
    const transfers = calculateSettlement(nets);
    const s = computeSummary(nets, transfers);
    expect(s.playerCount).toBe(3);
    expect(s.totalPotCents).toBe(4000);
    expect(s.transferCount).toBe(2);
    expect(s.biggestWinner?.name).toBe("Bob");
    expect(s.biggestLoser?.name).toBe("Alice");
  });
});
