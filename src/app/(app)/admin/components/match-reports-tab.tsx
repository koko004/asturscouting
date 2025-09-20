'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { matches as allMatches, users } from '@/lib/admin-data';
import { Match } from '@/lib/admin-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


export default function MatchReportsTab() {

  const getScoutName = (scoutId: string | undefined) => {
    if (!scoutId) return 'Sin asignar';
    const scout = users.find(u => u.id === scoutId);
    return scout ? scout.name : 'Desconocido';
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Informes de Partidos</CardTitle>
          <CardDescription>
            Consulta todos los informes de partidos generados por los ojeadores.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Partido</TableHead>
                    <TableHead>Ojeador</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {allMatches.map(match => (
                    <TableRow key={match.id}>
                        <TableCell>
                            <div className="font-medium">{match.homeTeam.name} vs {match.awayTeam.name}</div>
                            <div className="text-sm text-muted-foreground">{match.competition}</div>
                        </TableCell>
                        <TableCell>{getScoutName(match.assignedScoutId)}</TableCell>
                        <TableCell>
                            <Badge
                                className={cn(
                                match.isClosed
                                    ? 'bg-red-600 text-white'
                                    : 'bg-green-600 text-white'
                                )}
                            >
                                {match.isClosed ? 'Cerrado' : 'Abierto'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                             <Button asChild variant="ghost" size="sm">
                                <Link href={`/matches/${match.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> Ver Informe
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
