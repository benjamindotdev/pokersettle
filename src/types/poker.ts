export type PlayerId = string;

export interface Player {
  id: PlayerId;
  name: string;
  buyIns: number;
  /** Final chip value in euros (display value). Stored as a number; converted to cents internally for math. */
  finalValue: number;
}

export interface GameSettings {
  /** Buy-in amount in euros. */
  buyInAmount: number;
  currency: "EUR";
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
