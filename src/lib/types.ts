export type Team = {
  name: string;
  logoUrl: string;
};

export type Match = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
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

// Represents a player in the main database, with more details.
export type PlayerInDB = {
    id: string;
    firstName: string;
    lastName: string;
    nationality: string;
    age: number;
    teamName: string;
    teamLogoUrl?: string;
    position: PlayerPosition;
    jerseyNumber: number;
    height: number;
    weight: number;
    preferredFoot: 'Left' | 'Right' | 'Both';
    attributes: {
        attacking: number;
        technical: number;
        tactical: number;
        defending: number;
        creativity: number;
        physical: number;
    };
    assignedScoutId?: string;
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
