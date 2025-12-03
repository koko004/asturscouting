'use client';

import type { Player, User } from '@/lib/admin-types';
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
import { Button } from '@/components/ui/button';
import Image from 'next/image';
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


interface PlayerManagementTableProps {
  players: Player[];
  users: User[];
  onAssignScout: (playerId: string, scoutId: string) => void;
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
}

export default function PlayerManagementTable({ players, users, onAssignScout, onEdit, onDelete }: PlayerManagementTableProps) {
  
  const scouts = users.filter(u => u.role === 'scout');

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Jugador</TableHead>
          <TableHead>Club</TableHead>
          <TableHead>Posición</TableHead>
          <TableHead>Edad</TableHead>
          <TableHead className="w-[250px]">Ojeador Asignado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map(player => (
          <TableRow key={player.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                 <Image
                    src={`https://picsum.photos/seed/${player.id}/40`}
                    alt={`Foto de ${player.firstName}`}
                    width={40}
                    height={40}
                    className="h-9 w-9 rounded-full object-cover"
                    data-ai-hint="person face"
                />
                <div>
                  <Button variant="link" asChild className="p-0 h-auto font-medium">
                      <Link href={`/players/${player.id}`}>
                          {player.firstName} {player.lastName}
                      </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">{player.nationality}</p>
                </div>
              </div>
            </TableCell>
             <TableCell>{player.teamName}</TableCell>
            <TableCell>{player.position}</TableCell>
            <TableCell>{player.age}</TableCell>
            <TableCell>
              <Select 
                defaultValue={player.assignedScoutId || 'unassigned'} 
                onValueChange={(scoutId) => onAssignScout(player.id, scoutId)}
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
                    <DropdownMenuItem onClick={() => onEdit(player)}>Editar</DropdownMenuItem>
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
                        Esta acción no se puede deshacer. Esto eliminará permanentemente al jugador.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(player.id)}>Sí, eliminar</AlertDialogAction>
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
