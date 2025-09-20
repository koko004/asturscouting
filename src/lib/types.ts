export type Match = {
  id: string;
  homeTeam: { name: string; logoUrl: string };
  awayTeam: { name: string; logoUrl: string };
  date: string;
  competition: string;
};

export const playerPositions = ['Goalkeeper (GK)', 'Defender (DEF)', 'Midfielder (MID)', 'Forward (FWD)'] as const;
export type PlayerPosition = (typeof playerPositions)[number];

export type Player = {
  id: string;
  name: string;
  jerseyNumber: number;
  age: number;
  position: PlayerPosition;
  rating: number; // 1-10
  notes: string;
};

export type TacticalElement = {
  id: string;
  label: string;
  position: { x: number; y: number };
  type: 'player' | 'cone' | 'ball';
  color: string;
};
