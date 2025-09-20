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
