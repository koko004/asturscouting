'use client';

import type { Player, PlayerInDB } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface PlayerListProps {
  players: Player[];
  playersInDb: string[];
  onPlayerUpdate: (players: Player[]) => void;
  onEditPlayer: (player: Player) => void;
  onAddNewPlayer: () => void;
  onAddToDatabase: (player: Player) => void;
  isReadOnly?: boolean;
  isAdmin?: boolean;
}

export default function PlayerList({
  players,
  playersInDb,
  onPlayerUpdate,
  onEditPlayer,
  onAddToDatabase,
  isReadOnly = false,
  isAdmin = false,
}: PlayerListProps) {
  
  const handleDelete = (playerId: string) => {
    onPlayerUpdate(players.filter((p) => p.id !== playerId));
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Evaluación de Jugadores</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4 pr-4">
              {players.map((player) => {
                const isPlayerInDb = playersInDb.includes(player.id);
                return (
                  <Card key={player.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold">{player.name} <span className="text-muted-foreground font-normal">#{player.jerseyNumber}</span></h4>
                        <p className="text-sm text-muted-foreground">{player.position}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="secondary">Edad: {player.age}</Badge>
                          <Badge variant="default">Valoración: {player.rating}/10</Badge>
                        </div>
                      </div>
                     
                        <div className="flex gap-1">
                          {isAdmin && !isPlayerInDb && (
                             <Button variant="outline" size="sm" className="h-8" onClick={() => onAddToDatabase(player)}>
                                <Database className="h-4 w-4" />
                              </Button>
                          )}
                          {!isReadOnly && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditPlayer(player)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente los datos del jugador.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(player.id)}>Eliminar</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      
                    </div>
                    {player.notes && <p className="mt-3 border-t pt-3 text-sm text-muted-foreground italic">"{player.notes}"</p>}
                  </Card>
                );
              })}
              {players.length === 0 && (
                <div className="flex h-80 flex-col items-center justify-center text-center text-sm text-muted-foreground">
                    <Users className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 font-semibold">Aún no hay jugadores evaluados.</p>
                    <p className="mt-1">Toca un jugador en el campo para iniciar un informe.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
