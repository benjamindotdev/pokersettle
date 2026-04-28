export type PlayerId = string;

export interface Player {
  id: PlayerId;
  name: string;
  buyIns: number;
  /** Final value in CHIPS (not euros). Converted to cents using chipsPerBuyIn + buyInAmount. */
  finalValue: number;
}

export interface GameSettings {
  /** Buy-in amount in euros. */
  buyInAmount: number;
  /** How many chips one buy-in is worth. Default 1000. */
  chipsPerBuyIn: number;
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
