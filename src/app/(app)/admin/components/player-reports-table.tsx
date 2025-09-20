'use client';

import { useState, useMemo } from 'react';
import type { PlayerReport, Match, User } from '@/lib/admin-types';
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

interface PlayerReportsTableProps {
  reports: PlayerReport[];
  matches: Match[];
  users: User[];
}

export default function PlayerReportsTable({ reports, matches, users }: PlayerReportsTableProps) {
  const [filterMatch, setFilterMatch] = useState('all');
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
    return users.filter(u => scoutIds.has(u.id));
  }, [reports, users]);

  const filteredReports = reports.filter(report => {
    const matchFilterPassed = filterMatch === 'all' || report.matchId === filterMatch;
    const teamFilterPassed = !filterTeam || report.teamName.toLowerCase().includes(filterTeam.toLowerCase());
    const playerFilterPassed = !filterPlayer || report.playerName.toLowerCase().includes(filterPlayer.toLowerCase());
    const scoutFilterPassed = filterScout === 'all' || report.scoutId === filterScout;
    return matchFilterPassed && teamFilterPassed && playerFilterPassed && scoutFilterPassed;
  });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <Select value={filterMatch} onValueChange={setFilterMatch}>
          <SelectTrigger className="sm:w-[250px]">
            <SelectValue placeholder="Filtrar por partido" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los partidos</SelectItem>
            {matches.map(match => (
              <SelectItem key={match.id} value={match.id}>
                {match.homeTeam.name} vs {match.awayTeam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Input
          placeholder="Filtrar por equipo..."
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
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jugador</TableHead>
            <TableHead>Partido</TableHead>
            <TableHead>Ojeador</TableHead>
            <TableHead>Valoración</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.map(report => (
            <TableRow key={report.id}>
              <TableCell>
                <div className="font-medium">{report.playerName}</div>
                <div className="text-sm text-muted-foreground">{report.teamName}</div>
              </TableCell>
              <TableCell>{getMatchDescription(report.matchId)}</TableCell>
              <TableCell>{getScoutName(report.scoutId)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Badge variant="default" className="flex items-center gap-1">
                    {report.rating} <Star className="h-3 w-3" />
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-2 h-4 w-4" /> Ver Notas
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Notas de: {report.playerName}</DialogTitle>
                      <DialogDescription>
                        <div>
                          <span>Ojeador: {getScoutName(report.scoutId)}</span>
                          <br />
                          <span>Posición: {report.position}</span>
                          <br />
                          <span>Partido: {getMatchDescription(report.matchId)}</span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 rounded-md border bg-muted p-4">
                      <p className="text-sm italic">"{report.notes}"</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
          {filteredReports.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No se encontraron informes con los filtros actuales.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
