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


export type PlayerPosition = 'Portero (POR)' | 'Defensa (DEF)' | 'Centrocampista (CEN)' | 'Delantero (DEL)';

export type Player = {
    id: string;
    firstName: string;
    lastName: string;
    nationality: string;
    age: number;
    teamName: string;
    position: PlayerPosition;
    jerseyNumber: number;
};

export type PlayerReport = {
    id: string;
    playerId: string;
    matchId: string;
    scoutId: string;
    rating: number; // 1-10
    notes: string;
}
