import type { User, Match } from './admin-types';

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
    id: '1',
    homeTeam: { name: 'Real Sporting', logoUrl: 'https://picsum.photos/seed/1/100/100' },
    awayTeam: { name: 'Real Oviedo', logoUrl: 'https://picsum.photos/seed/2/100/100' },
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Segunda División',
    isClosed: false,
    assignedScoutId: 'u2',
  },
  {
    id: '2',
    homeTeam: { name: 'UP Langreo', logoUrl: 'https://picsum.photos/seed/3/100/100' },
    awayTeam: { name: 'Marino de Luanco', logoUrl: 'https://picsum.photos/seed/4/100/100' },
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Segunda B',
    isClosed: true,
    assignedScoutId: 'u3',
  },
  {
    id: '3',
    homeTeam: { name: 'Caudal Deportivo', logoUrl: 'https://picsum.photos/seed/5/100/100' },
    awayTeam: { name: 'CD Covadonga', logoUrl: 'https://picsum.photos/seed/6/100/100' },
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Tercera División',
    isClosed: false,
  },
];
