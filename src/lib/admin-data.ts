import type { User, Match, PlayerReport, Player } from './admin-types';

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

export const players: Player[] = [
    {
        id: 'p1',
        firstName: 'David',
        lastName: 'Gold',
        nationality: 'Inglaterra',
        age: 22,
        teamName: 'UP Langreo',
        teamLogoUrl: 'https://picsum.photos/seed/3/100/100',
        position: 'Delantero (DEL)',
        jerseyNumber: 9,
        height: 185,
        weight: 80,
        preferredFoot: 'Right',
        strengths: ['Juego aéreo', 'Definición'],
        weaknesses: ['Velocidad'],
        attributes: { attacking: 85, technical: 75, tactical: 78, defending: 40, creativity: 70, physical: 88 },
        psychology: { leadership: 70, teamwork: 80, aggression: 75, determination: 85 },
        recommendation: 'Seleccionar',
        assignedScoutId: 'u3',
    },
    {
        id: 'p2',
        firstName: 'Juan',
        lastName: 'Pérez',
        nationality: 'España',
        age: 25,
        teamName: 'Marino de Luanco',
        teamLogoUrl: 'https://picsum.photos/seed/4/100/100',
        position: 'Centrocampista (CEN)',
        jerseyNumber: 8,
        height: 178,
        weight: 72,
        preferredFoot: 'Left',
        strengths: ['Visión de juego', 'Pase'],
        weaknesses: ['Fuerza física'],
        attributes: { attacking: 72, technical: 88, tactical: 85, defending: 65, creativity: 90, physical: 70 },
        psychology: { leadership: 60, teamwork: 90, aggression: 65, determination: 80 },
        recommendation: 'Seguir observando',
    },
    {
        id: 'p3',
        firstName: 'Borja',
        lastName: 'Sánchez',
        nationality: 'España',
        age: 28,
        teamName: 'Real Oviedo',
        teamLogoUrl: 'https://picsum.photos/seed/2/100/100',
        position: 'Centrocampista (CEN)',
        jerseyNumber: 10,
        height: 175,
        weight: 68,
        preferredFoot: 'Right',
        strengths: ['Regate', 'Tiro lejano'],
        weaknesses: ['Trabajo defensivo'],
        attributes: { attacking: 80, technical: 85, tactical: 75, defending: 50, creativity: 88, physical: 65 },
        psychology: { leadership: 75, teamwork: 70, aggression: 70, determination: 90 },
        recommendation: 'Seguimiento especial',
        assignedScoutId: 'u2',
    },
    {
        id: 'p4',
        firstName: 'Uros',
        lastName: 'Djurdjevic',
        nationality: 'Serbia',
        age: 30,
        teamName: 'Real Sporting',
        teamLogoUrl: 'https://picsum.photos/seed/1/100/100',
        position: 'Delantero (DEL)',
        jerseyNumber: 23,
        height: 181,
        weight: 79,
        preferredFoot: 'Both',
        strengths: ['Lucha', 'Remate'],
        weaknesses: [],
        attributes: { attacking: 90, technical: 80, tactical: 82, defending: 45, creativity: 75, physical: 85 },
        psychology: { leadership: 85, teamwork: 80, aggression: 90, determination: 95 },
        recommendation: 'Seleccionar',
        assignedScoutId: 'u2',
    }
];


export const playerReports: PlayerReport[] = [
    { 
        id: 'pr1',
        playerId: 'p1',
        matchId: 'm2',
        scoutId: 'u3',
        rating: 8,
        notes: 'Muy rápido y con gran definición. Buen juego aéreo.'
    },
    { 
        id: 'pr2',
        playerId: 'p2',
        matchId: 'm2',
        scoutId: 'u3',
        rating: 7,
        notes: 'Gran visión de juego y pases precisos. Le falta algo de físico.'
    },
    {
        id: 'pr3',
        playerId: 'p3',
        matchId: 'm1',
        scoutId: 'u2',
        rating: 9,
        notes: 'Jugador diferencial, con mucho talento y capacidad para desequilibrar. El mejor del partido.'
    },
    {
        id: 'pr4',
        playerId: 'p4',
        matchId: 'm1',
        scoutId: 'u2',
        rating: 8,
        notes: 'Delantero muy completo. Buen remate con ambas piernas y gran capacidad de lucha.'
    }
];
