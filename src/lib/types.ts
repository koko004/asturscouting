export type Match = {
  id: string;
  homeTeam: { name: string; logoUrl: string };
  awayTeam: { name: string; logoUrl: string };
  date: string;
  competition: string;
  stadium: string;
  isClosed: boolean;
  assignedScoutId?: string;
};

export const playerPositions = ['Portero (POR)', 'Defensa (DEF)', 'Centrocampista (CEN)', 'Delantero (DEL)'] as const;
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
  playerId?: string;
};

export const formations = ['4-4-2', '4-3-3', '3-5-2', '4-5-1', '5-3-2'] as const;
export type Formation = (typeof formations)[number];
