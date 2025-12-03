'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Match } from '@/lib/admin-types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowRight, Eye } from 'lucide-react';

interface MyMatchReportsTableProps {
  matches: Match[];
}

export default function MyMatchReportsTable({ matches }: MyMatchReportsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Partido</TableHead>
          <TableHead>Competición</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map(match => (
          <TableRow key={match.id}>
            <TableCell>
              <Button variant="link" asChild className="p-0 h-auto font-medium -translate-x-4">
                <Link href={`/matches/${match.id}`}>
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </Link>
              </Button>
               <div className="text-sm text-muted-foreground">
                {new Date(match.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </TableCell>
            <TableCell>{match.competition}</TableCell>
            <TableCell>
              <Badge
                className={cn(
                  match.isClosed ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                )}
              >
                {match.isClosed ? 'Cerrado' : 'Abierto'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/matches/${match.id}`}>
                    {match.isClosed ? <Eye className="mr-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                    {match.isClosed ? 'Ver Informe' : 'Ir al Informe'}
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
         {matches.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No tienes informes de partidos asignados.
              </TableCell>
            </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
