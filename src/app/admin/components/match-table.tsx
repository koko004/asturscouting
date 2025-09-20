'use client';

import type { Match, User } from '@/lib/admin-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Lock, Unlock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


interface MatchTableProps {
  matches: Match[];
  users: User[];
  onEdit: (match: Match) => void;
  onDelete: (matchId: string) => void;
  onToggleStatus: (matchId: string) => void;
}

export default function MatchTable({ matches, users, onEdit, onDelete, onToggleStatus }: MatchTableProps) {
  
  const getScoutName = (scoutId: string | undefined) => {
    if (!scoutId) return <Badge variant="outline">Sin asignar</Badge>;
    const scout = users.find(u => u.id === scoutId);
    return scout ? scout.name : <Badge variant="outline">Desconocido</Badge>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Partido</TableHead>
          <TableHead>Competición</TableHead>
          <TableHead>Ojeador Asignado</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map(match => (
          <TableRow key={match.id}>
            <TableCell>
              <div className="font-medium">{match.homeTeam.name} vs {match.awayTeam.name}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(match.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </TableCell>
            <TableCell>
              {match.competition}
            </TableCell>
            <TableCell>
                {getScoutName(match.assignedScoutId)}
            </TableCell>
            <TableCell>
              <Badge variant={match.isClosed ? 'secondary' : 'default'}>
                {match.isClosed ? 'Cerrado' : 'Abierto'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
             <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Acciones</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(match)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(match.id)}>
                      {match.isClosed ? <><Unlock className="mr-2 h-4 w-4" /> Reabrir Informe</> : <><Lock className="mr-2 h-4 w-4" /> Cerrar Informe</>}
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        Eliminar
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el partido.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(match.id)}>Sí, eliminar partido</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
