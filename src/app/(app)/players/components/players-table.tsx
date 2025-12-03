
'use client';

import { useState, useMemo } from 'react';
import type { PlayerReport, Match, User, Player } from '@/lib/admin-types';
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
import { Eye, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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

  const latestReports = useMemo(() => {
    const reportMap = new Map<string, PlayerReport>();
    reports.forEach(report => {
        if (!reportMap.has(report.playerId) || new Date(report.id) > new Date(reportMap.get(report.playerId)!.id)) {
            reportMap.set(report.playerId, report);
        }
    });
    return Array.from(reportMap.values());
  }, [reports]);

  const filteredReports = latestReports.filter(report => {
    const player = players.find(p => p.id === report.playerId);
    if (!player) return false;

    const teamFilterPassed = !filterTeam || player.teamName.toLowerCase().includes(filterTeam.toLowerCase());
    const playerFilterPassed = !filterPlayer || `${player.firstName} ${player.lastName}`.toLowerCase().includes(filterPlayer.toLowerCase());
    const scoutFilterPassed = !isAdmin || filterScout === 'all' || report.scoutId === filterScout;
    return teamFilterPassed && playerFilterPassed && scoutFilterPassed;
  });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <Input
          placeholder="Filtrar por club..."
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="sm:w-[200px]"
        />
        <Input
          placeholder="Filtrar por jugador..."
          value={filterPlayer}
          onChange={(e) => setFilterPlayer(e.target.value)}
          className="sm:w-[200px]"
        />
        {isAdmin && (
            <Select value={filterScout} onValueChange={setFilterScout}>
                <SelectTrigger className="sm:w-[200px]">
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
            <TableHead>Jugador</TableHead>
            <TableHead>Club</TableHead>
            <TableHead>Última Valoración</TableHead>
            {isAdmin && <TableHead>Ojeador</TableHead>}
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.map(report => {
            const player = players.find(p => p.id === report.playerId);
            if (!player) return null;

            return (
                <TableRow key={report.id}>
                <TableCell className="font-medium">
                   <Button variant="link" asChild className="p-0 h-auto">
                        <Link href={`/players/${player.id}`}>
                            {player.firstName} {player.lastName}
                        </Link>
                    </Button>
                </TableCell>
                <TableCell>{player.teamName}</TableCell>
                <TableCell>
                    <div className="flex items-center">
                    <Badge variant="default" className="flex items-center gap-1">
                        {report.rating} <Star className="h-3 w-3" />
                    </Badge>
                    </div>
                </TableCell>
                {isAdmin && (
                    <TableCell>{getScoutName(report.scoutId)}</TableCell>
                )}
                <TableCell className="text-right">
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
                </TableCell>
                </TableRow>
            );
          })}
          {filteredReports.length === 0 && (
            <TableRow>
              <TableCell colSpan={isAdmin ? 5 : 4} className="h-24 text-center">
                No se encontraron jugadores con los filtros actuales.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
