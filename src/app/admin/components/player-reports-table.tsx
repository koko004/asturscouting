'use client';

import { useState } from 'react';
import type { PlayerReport, Match } from '@/lib/admin-types';
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
}

export default function PlayerReportsTable({ reports, matches }: PlayerReportsTableProps) {
  const [filterMatch, setFilterMatch] = useState('all');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterPlayer, setFilterPlayer] = useState('');

  const getMatchDescription = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return 'Partido Desconocido';
    return `${match.homeTeam.name} vs ${match.awayTeam.name}`;
  };

  const filteredReports = reports.filter(report => {
    const match = matches.find(m => m.id === report.matchId);
    const matchFilterPassed = filterMatch === 'all' || report.matchId === filterMatch;
    const teamFilterPassed = !filterTeam || report.teamName.toLowerCase().includes(filterTeam.toLowerCase());
    const playerFilterPassed = !filterPlayer || report.playerName.toLowerCase().includes(filterPlayer.toLowerCase());
    return matchFilterPassed && teamFilterPassed && playerFilterPassed;
  });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
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
                        Posición: {report.position} <br />
                        Partido: {getMatchDescription(report.matchId)}
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
              <TableCell colSpan={4} className="text-center">
                No se encontraron informes con los filtros actuales.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}