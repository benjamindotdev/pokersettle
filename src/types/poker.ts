export type PlayerId = string;

export interface Player {
  id: PlayerId;
  name: string;
  buyIns: number;
  /** Final value in CHIPS. 1 buy-in always equals 100 × the buy-in amount in chips, so 1 chip = 1 cent. */
  finalValue: number;
}

export interface GameSettings {
  /** Buy-in amount in euros. */
  buyInAmount: number;
}

export interface Game {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  settings: GameSettings;
  players: Player[];
}

export interface Transfer {
  fromPlayerId: PlayerId;
  toPlayerId: PlayerId;
  /** Amount in cents. */
  amountCents: number;
}

export interface PlayerNet {
  playerId: PlayerId;
  name: string;
  paidInCents: number;
  finalValueCents: number;
  netCents: number;
}
