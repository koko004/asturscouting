import type { Match, Player } from './types';

export const matches: Match[] = [
  {
    id: '1',
    homeTeam: { name: 'Real Sporting', logoUrl: 'https://picsum.photos/seed/1/100/100' },
    awayTeam: { name: 'Real Oviedo', logoUrl: 'https://picsum.photos/seed/2/100/100' },
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Segunda División',
    stadium: 'El Molinón',
    isClosed: false,
    assignedScoutId: 'u2',
  },
  {
    id: '2',
    homeTeam: { name: 'UP Langreo', logoUrl: 'https://picsum.photos/seed/3/100/100' },
    awayTeam: { name: 'Marino de Luanco', logoUrl: 'https://picsum.photos/seed/4/100/100' },
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Segunda B',
    stadium: 'Estadio Ganzábal',
    isClosed: true,
    assignedScoutId: 'u3',
  },
  {
    id: '3',
    homeTeam: { name: 'Caudal Deportivo', logoUrl: 'https://picsum.photos/seed/5/100/100' },
    awayTeam: { name: 'CD Covadonga', logoUrl: 'https://picsum.photos/seed/6/100/100' },
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Tercera División',
    stadium: 'Hermanos Antuña',
    isClosed: false,
  },
];

export const initialPlayers: Player[] = [];
