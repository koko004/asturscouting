'use client';

import { useState, useMemo } from 'react';
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
import { ArrowRight, ArrowUpDown, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type SortKey = 'match' | 'scout' | 'status';

export default function MatchReportsTab() {
  const [sortKey, setSortKey] = useState<SortKey>('match');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const getScoutName = (scoutId: string | undefined) => {
    if (!scoutId) return 'Sin asignar';
    const scout = users.find(u => u.id === scoutId);
    return scout ? scout.name : 'Desconocido';
  };
  
  const sortedMatches = useMemo(() => {
    return [...allMatches].sort((a, b) => {
      let compareA, compareB;

      switch (sortKey) {
        case 'scout':
          compareA = getScoutName(a.assignedScoutId);
          compareB = getScoutName(b.assignedScoutId);
          break;
        case 'status':
          compareA = a.isClosed.toString();
          compareB = b.isClosed.toString();
          break;
        case 'match':
        default:
          compareA = `${a.homeTeam.name} vs ${a.awayTeam.name}`;
          compareB = `${b.homeTeam.name} vs ${b.awayTeam.name}`;
          break;
      }

      if (compareA < compareB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (compareA > compareB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [allMatches, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const renderSortArrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDirection === 'asc' ? '▲' : '▼';
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
                    <TableHead>
                         <Button variant="ghost" onClick={() => handleSort('match')}>
                            Partido <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                         <Button variant="ghost" onClick={() => handleSort('scout')}>
                            Ojeador <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                         <Button variant="ghost" onClick={() => handleSort('status')}>
                            Estado <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedMatches.map(match => (
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
