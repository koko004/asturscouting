'use client';

import type { Match, User } from '@/lib/admin-types';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
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
import { cn } from '@/lib/utils';


interface MatchTableProps {
  matches: Match[];
  users: User[];
  scouts: User[];
  onEdit: (match: Match) => void;
  onDelete: (matchId: string) => void;
  onToggleStatus: (matchId: string) => void;
  onAssignScout: (matchId: string, scoutId: string) => void;
}

export default function MatchTable({ matches, users, scouts, onEdit, onDelete, onToggleStatus, onAssignScout }: MatchTableProps) {
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Partido</TableHead>
          <TableHead>Competición</TableHead>
          <TableHead className="w-[200px]">Ojeador Asignado</TableHead>
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
            <TableCell>
              {match.competition}
            </TableCell>
            <TableCell>
                 <Select
                    defaultValue={match.assignedScoutId || 'unassigned'}
                    onValueChange={(scoutId) => onAssignScout(match.id, scoutId)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Asignar ojeador..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="unassigned">Sin asignar</SelectItem>
                        {scouts.map(scout => (
                            <SelectItem key={scout.id} value={scout.id}>{scout.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
            <Badge
                onClick={() => onToggleStatus(match.id)}
                className={cn(
                  'cursor-pointer',
                  match.isClosed
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                )}
              >
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
