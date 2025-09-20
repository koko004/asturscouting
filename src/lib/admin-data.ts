import type { User, Match, PlayerReport } from './admin-types';

export const users: User[] = [
    {
        id: 'u1',
        name: 'Carlos R.',
        email: 'carlos@asturscouting.com',
        avatarUrl: 'https://picsum.photos/seed/u1/100/100',
        role: 'admin',
    },
    {
        id: 'u2',
        name: 'Laura G.',
        email: 'laura@asturscouting.com',
        avatarUrl: 'https://picsum.photos/seed/u2/100/100',
        role: 'scout',
    },
    {
        id: 'u3',
        name: 'David F.',
        email: 'david@asturscouting.com',
        avatarUrl: 'https://picsum.photos/seed/u3/100/100',
        role: 'scout',
    }
];

export const matches: Match[] = [
  {
    id: 'm1',
    homeTeam: { name: 'Real Sporting', logoUrl: 'https://picsum.photos/seed/1/100/100' },
    awayTeam: { name: 'Real Oviedo', logoUrl: 'https://picsum.photos/seed/2/100/100' },
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Segunda División',
    stadium: 'El Molinón',
    isClosed: false,
    assignedScoutId: 'u2',
  },
  {
    id: 'm2',
    homeTeam: { name: 'UP Langreo', logoUrl: 'https://picsum.photos/seed/3/100/100' },
    awayTeam: { name: 'Marino de Luanco', logoUrl: 'https://picsum.photos/seed/4/100/100' },
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Segunda B',
    stadium: 'Estadio Ganzábal',
    isClosed: true,
    assignedScoutId: 'u3',
  },
  {
    id: 'm3',
    homeTeam: { name: 'Caudal Deportivo', logoUrl: 'https://picsum.photos/seed/5/100/100' },
    awayTeam: { name: 'CD Covadonga', logoUrl: 'https://picsum.photos/seed/6/100/100' },
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Tercera División',
    stadium: 'Hermanos Antuña',
    isClosed: false,
  },
];

export const playerReports: PlayerReport[] = [
    { 
        id: 'pr1',
        playerId: 'p1',
        matchId: 'm2',
        scoutId: 'u3',
        teamName: 'UP Langreo',
        playerName: 'David Gold',
        position: 'Delantero (DEL)',
        rating: 8,
        notes: 'Muy rápido y con gran definición. Buen juego aéreo.'
    },
    { 
        id: 'pr2',
        playerId: 'p2',
        matchId: 'm2',
        scoutId: 'u3',
        teamName: 'Marino de Luanco',
        playerName: 'Juan Pérez',
        position: 'Centrocampista (CEN)',
        rating: 7,
        notes: 'Gran visión de juego y pases precisos. Le falta algo de físico.'
    },
    {
        id: 'pr3',
        playerId: 'p3',
        matchId: 'm1',
        scoutId: 'u2',
        teamName: 'Real Oviedo',
        playerName: 'Borja Sánchez',
        position: 'Centrocampista (CEN)',
        rating: 9,
        notes: 'Jugador diferencial, con mucho talento y capacidad para desequilibrar. El mejor del partido.'
    },
    {
        id: 'pr4',
        playerId: 'p4',
        matchId: 'm1',
        scoutId: 'u2',
        teamName: 'Real Sporting',
        playerName: 'Uros Djurdjevic',
        position: 'Delantero (DEL)',
        rating: 8,
        notes: 'Delantero muy completo. Buen remate con ambas piernas y gran capacidad de lucha.'
    }
];
