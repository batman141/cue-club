export type ScreenView =
  | "menu"
  | "start_setup"
  | "history"
  | "music"
  | "playing";

export type GameType = "eight_ball" | "nine_ball" | "snooker";

export interface Player {
  id: 1 | 2;
  name: string;
}

export interface Track {
  id: string;
  title: string;
  url: string;
}

export interface EightBallDetails {
  gameType: "eight_ball";
  player1Group: "solids" | "stripes" | null;
  player2Group: "solids" | "stripes" | null;
}

export interface BaseMatchRecord {
  id: string;
  date: string;
  winner: Player;
  loser: Player;
}

export type MatchRecord = BaseMatchRecord & {
  details: EightBallDetails; // Add SnookerDetails here later
};
