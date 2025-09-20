import type { Match, Player } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const matches: Match[] = [
  {
    id: '1',
    homeTeam: { name: 'Real Sporting', logoUrl: getImage('team-logo-1') },
    awayTeam: { name: 'Real Oviedo', logoUrl: getImage('team-logo-2') },
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Segunda División',
  },
  {
    id: '2',
    homeTeam: { name: 'UP Langreo', logoUrl: getImage('team-logo-3') },
    awayTeam: { name: 'Marino de Luanco', logoUrl: getImage('team-logo-4') },
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Segunda B',
  },
  {
    id: '3',
    homeTeam: { name: 'Caudal Deportivo', logoUrl: getImage('team-logo-5') },
    awayTeam: { name: 'CD Covadonga', logoUrl: getImage('team-logo-6') },
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Tercera División',
  },
];

export const initialPlayers: Player[] = [
    { id: 'p1', name: 'Alex Garcia', jerseyNumber: 10, age: 24, position: 'Midfielder (MID)', rating: 8, notes: 'Great vision and passing range.' },
    { id: 'p2', name: 'Bruno Fernandez', jerseyNumber: 7, age: 22, position: 'Forward (FWD)', rating: 7, notes: 'Fast, but needs to improve finishing.' },
    { id: 'p3', name: 'Carlos Soler', jerseyNumber: 4, age: 28, position: 'Defender (DEF)', rating: 9, notes: 'Solid defender, strong in the air.' },
];
