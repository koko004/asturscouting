export type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    role: 'admin' | 'scout';
}

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

export const recommendations = ['Sin definir', 'Seguir observando', 'Seguimiento especial', 'Seleccionar', 'Descartar'] as const;
export type Recommendation = (typeof recommendations)[number];


export type Player = {
    id: string;
    firstName: string;
    lastName: string;
    nationality: string;
    age: number;
    teamName: string;
    teamLogoUrl?: string;
    position: PlayerPosition;
    secondaryPosition?: PlayerPosition;
    jerseyNumber: number;
    height: number; // in cm
    weight: number; // in kg
    preferredFoot: 'Left' | 'Right' | 'Both';
    strengths?: string[];
    weaknesses?: string[];
    attributes: {
        attacking: number;
        technical: number;
        tactical: number;
        defending: number;
        creativity: number;
        physical: number;
    };
    psychology?: {
        leadership: number;
        teamwork: number;
        aggression: number;
        determination: number;
    };
    recommendation?: Recommendation;
    assignedScoutId?: string;
    reportRequestedBy?: string; // admin user ID who requested the report
};

export type PlayerReport = {
    id: string;
    playerId: string;
    matchId?: string; // Optional now
    scoutId: string;
    rating: number; // 1-10
    notes: string;
    // Fields for when a match isn't pre-defined
    opponentTeam?: string;
    competition?: string;
    isClosed: boolean;
}

export type Report = PlayerReport & {
    matchDescription: string;
    scoutName: string;
    matchDate: string; 
    opponent: { name: string; logoUrl: string };
}
