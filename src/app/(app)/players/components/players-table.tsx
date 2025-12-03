
'use client';

import { useState, useMemo } from 'react';
import type { PlayerReport, Match, User, Player, Recommendation, PlayerPosition } from '@/lib/admin-types';
import { playerPositions } from '@/lib/admin-types';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, Star, ArrowUpDown, CheckCircle2, XCircle, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type SortKey = 'player' | 'team' | 'rating' | 'scout' | 'recommendation' | 'age' | 'position';


const RecommendationBadge = ({ recommendation }: { recommendation?: Recommendation }) => {
    if (!recommendation || recommendation === 'Sin definir') {
        return <Badge variant="outline">Sin definir</Badge>;
    }

    const config = {
        'Seleccionar': { icon: CheckCircle2, className: 'bg-green-600 text-white' },
        'Descartar': { icon: XCircle, className: 'bg-red-600 text-white' },
        'Seguimiento especial': { icon: Target, className: 'bg-yellow-500 text-white' },
        'Seguir observando': { icon: Eye, className: 'bg-blue-500 text-white' },
    };

    const { icon: Icon, className } = config[recommendation] || {};

    if (!Icon) {
        return <Badge variant="secondary">{recommendation}</Badge>;
    }

    return (
        <Badge className={cn("text-center flex items-center justify-center gap-1.5", className)}>
            <Icon className="h-3 w-3" />
            {recommendation}
        </Badge>
    );
};


interface PlayersTableProps {
  reports: PlayerReport[];
  players: Player[];
  matches: Match[];
  users: User[];
  isAdmin: boolean;
}

export default function PlayersTable({ reports, players, matches, users, isAdmin }: PlayersTableProps) {
  const [filterTeam, setFilterTeam] = useState('');
  const [filterPlayer, setFilterPlayer] = useState('');
  const [filterScout, setFilterScout] = useState('all');
  const [filterAge, setFilterAge] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('player');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


  const getMatchDescription = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return 'Partido Desconocido';
    return `${match.homeTeam.name} vs ${match.awayTeam.name}`;
  };

  const getScoutName = (scoutId: string) => {
      const scout = users.find(u => u.id === scoutId);
      return scout?.name || 'Desconocido';
  }

  const scouts = useMemo(() => {
    const scoutIds = new Set(reports.map(r => r.scoutId));
    return users.filter(u => u.role === 'scout' && scoutIds.has(u.id));
  }, [reports, users]);

  const processedPlayers = useMemo(() => {
    const reportMap = new Map<string, PlayerReport>();
    reports.forEach(report => {
        if (!reportMap.has(report.playerId) || new Date(report.id) > new Date(reportMap.get(report.playerId)!.id)) {
            reportMap.set(report.playerId, report);
        }
    });

    return players.map(player => {
        const latestReport = reportMap.get(player.id);
        return {
            ...player,
            latestReport,
        };
    });
  }, [players, reports]);

  
  const filteredPlayers = useMemo(() => {
    let playersToFilter = processedPlayers.filter(player => {
        const teamFilterPassed = !filterTeam || player.teamName.toLowerCase().includes(filterTeam.toLowerCase());
        const playerFilterPassed = !filterPlayer || `${player.firstName} ${player.lastName}`.toLowerCase().includes(filterPlayer.toLowerCase());
        const scoutFilterPassed = !isAdmin || filterScout === 'all' || (player.latestReport && player.latestReport.scoutId === filterScout);
        const ageFilterPassed = !filterAge || player.age.toString() === filterAge;
        const positionFilterPassed = filterPosition === 'all' || player.position === filterPosition;

        return teamFilterPassed && playerFilterPassed && scoutFilterPassed && ageFilterPassed && positionFilterPassed;
    });

    return playersToFilter.sort((a, b) => {
        let compareA, compareB;

        switch (sortKey) {
            case 'team':
                compareA = a.teamName;
                compareB = b.teamName;
                break;
            case 'rating':
                compareA = a.latestReport?.rating ?? 0;
                compareB = b.latestReport?.rating ?? 0;
                break;
            case 'scout':
                compareA = a.latestReport ? getScoutName(a.latestReport.scoutId) : '';
                compareB = b.latestReport ? getScoutName(b.latestReport.scoutId) : '';
                break;
            case 'recommendation':
                compareA = a.recommendation || '';
                compareB = b.recommendation || '';
                break;
            case 'age':
                compareA = a.age;
                compareB = b.age;
                break;
            case 'position':
                compareA = a.position;
                compareB = b.position;
                break;
            case 'player':
            default:
                compareA = `${a.firstName} ${a.lastName}`;
                compareB = `${b.firstName} ${b.lastName}`;
                break;
        }

        if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
  }, [processedPlayers, filterTeam, filterPlayer, filterScout, filterAge, filterPosition, isAdmin, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
        setSortKey(key);
        setSortDirection('asc');
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <Input
          placeholder="Filtrar por club..."
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="sm:w-[180px]"
        />
        <Input
          placeholder="Filtrar por jugador..."
          value={filterPlayer}
          onChange={(e) => setFilterPlayer(e.target.value)}
          className="sm:w-[180px]"
        />
        <Input
            type="number"
            placeholder="Filtrar por edad..."
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
            className="sm:w-[150px]"
        />
        <Select value={filterPosition} onValueChange={setFilterPosition}>
            <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Filtrar por posición" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todas las posiciones</SelectItem>
                {playerPositions.map(pos => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        {isAdmin && (
            <Select value={filterScout} onValueChange={setFilterScout}>
                <SelectTrigger className="sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por ojeador" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los ojeadores</SelectItem>
                    {scouts.map(scout => (
                    <SelectItem key={scout.id} value={scout.id}>
                        {scout.name}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
                <Button variant="ghost" onClick={() => handleSort('player')}>
                    Jugador <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>
             <TableHead className="text-center">
                <Button variant="ghost" onClick={() => handleSort('age')}>
                    Edad <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>
             <TableHead>
                <Button variant="ghost" onClick={() => handleSort('position')}>
                    Posición <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>
            <TableHead>
                <Button variant="ghost" onClick={() => handleSort('team')}>
                    Club <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>
            <TableHead>
                <Button variant="ghost" onClick={() => handleSort('recommendation')}>
                    Valoración <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>
            <TableHead className="text-center">
                <Button variant="ghost" onClick={() => handleSort('rating')}>
                    Última Nota <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>
            {isAdmin && <TableHead>
                <Button variant="ghost" onClick={() => handleSort('scout')}>
                    Ojeador <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>}
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlayers.map(player => {
            const report = player.latestReport;
            return (
                <TableRow key={player.id}>
                <TableCell className="font-medium">
                   <Button variant="link" asChild className="p-0 h-auto">
                        <Link href={`/players/${player.id}`}>
                            {player.firstName} {player.lastName}
                        </Link>
                    </Button>
                </TableCell>
                <TableCell className="text-center">{player.age}</TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>{player.teamName}</TableCell>
                <TableCell>
                    <RecommendationBadge recommendation={player.recommendation} />
                </TableCell>
                <TableCell className="text-center">
                    {report ? (
                        <Badge variant="default">{report.rating}</Badge>
                    ) : (
                        <Badge variant="outline">N/A</Badge>
                    )}
                </TableCell>
                {isAdmin && (
                    <TableCell>{report ? getScoutName(report.scoutId) : 'N/A'}</TableCell>
                )}
                <TableCell className="text-right">
                    {report ? (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                <Eye className="mr-2 h-4 w-4" /> Ver Último Informe
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Último informe de: {player.firstName} {player.lastName}</DialogTitle>
                                <DialogDescription>
                                    <span>Ojeador: {getScoutName(report.scoutId)}</span>
                                    <br />
                                    <span>Posición: {player.position}</span>
                                    <br />
                                    <span>Partido: {getMatchDescription(report.matchId)}</span>
                                </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 rounded-md border bg-muted p-4">
                                <p className="text-sm italic">"{report.notes}"</p>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <Button variant="ghost" size="sm" disabled>
                            <Eye className="mr-2 h-4 w-4" /> Sin informes
                        </Button>
                    )}
                </TableCell>
                </TableRow>
            );
          })}
          {filteredPlayers.length === 0 && (
            <TableRow>
              <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center">
                No se encontraron jugadores con los filtros actuales.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
