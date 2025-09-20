'use client';

import type { Player } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
  onPlayerUpdate: (players: Player[]) => void;
  onEditPlayer: (player: Player) => void;
  onAddNewPlayer: () => void;
}

export default function PlayerList({ players, onPlayerUpdate, onEditPlayer, onAddNewPlayer }: PlayerListProps) {
  
  const handleDelete = (playerId: string) => {
    onPlayerUpdate(players.filter((p) => p.id !== playerId));
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Player Evaluation</CardTitle>
          <Button size="sm" onClick={onAddNewPlayer}>
            <Plus className="mr-2 h-4 w-4" /> Add Player
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-4">
              {players.map((player) => (
                <Card key={player.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold">{player.name} <span className="text-muted-foreground font-normal">#{player.jerseyNumber}</span></h4>
                      <p className="text-sm text-muted-foreground">{player.position}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary">Age: {player.age}</Badge>
                        <Badge variant="default">Rating: {player.rating}/10</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
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
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the player data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(player.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {player.notes && <p className="mt-3 border-t pt-3 text-sm text-muted-foreground italic">"{player.notes}"</p>}
                </Card>
              ))}
              {players.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                    <p>No players added yet.</p>
                    <p>Click "Add Player" to start evaluating.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
