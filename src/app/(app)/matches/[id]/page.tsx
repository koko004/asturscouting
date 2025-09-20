'use client';

import { useParams } from 'next/navigation';
import { matches } from '@/lib/data';
import type { Player } from '@/lib/types';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/page-header';
import InteractiveField from './components/interactive-field';
import MatchNotes from './components/match-notes';
import PlayerList from './components/player-list';
import PlayerForm from './components/player-form';
import { Button } from '@/components/ui/button';
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
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MatchPage() {
  const params = useParams();
  const matchId = typeof params.id === 'string' ? params.id : '';
  const initialMatch = useMemo(() => matches.find((m) => m.id === matchId), [matchId]);

  const [match, setMatch] = useState(initialMatch);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const { toast } = useToast();

  if (!match) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Partido no encontrado.</p>
      </div>
    );
  }

  const handlePlayerUpdate = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
  };
  
  const handleEditPlayer = (player: Player) => {
    if (match.isClosed) return;
    setSelectedPlayer(player);
    setIsFormOpen(true);
  };

  const handleAddNewPlayer = () => {
    if (match.isClosed) return;
    setSelectedPlayer(null);
    setIsFormOpen(true);
  };
  
  const handleSelectPlayerFromField = (tacticalPlayer: { id: string, name: string, team: 'home' | 'away' }) => {
    if (match.isClosed) return;
    const existingPlayer = players.find((p) => p.id === tacticalPlayer.id);
    if (existingPlayer) {
      setSelectedPlayer(existingPlayer);
    } else {
      const newPlayer: Player = {
        id: tacticalPlayer.id,
        name: tacticalPlayer.name,
        jerseyNumber: parseInt(tacticalPlayer.name.replace(/[^0-9]/g, ''), 10) || 0,
        age: 20, // Default age
        position: 'Centrocampista (CEN)', // Default position
        rating: 5,
        notes: '',
      };
      setPlayers([...players, newPlayer]);
      setSelectedPlayer(newPlayer);
    }
    setIsFormOpen(true);
  };

  const handleSavePlayer = (player: Player) => {
    const playerExists = players.some((p) => p.id === player.id);
    if (playerExists) {
      setPlayers(players.map((p) => (p.id === player.id ? player : p)));
    } else {
      setPlayers([...players, player]);
    }
  };
  
  const handleCloseReport = () => {
    setMatch(prevMatch => prevMatch ? { ...prevMatch, isClosed: true } : undefined);
    // Here you would also make an API call to save this state to your backend
    toast({
      title: "Informe Cerrado",
      description: "El informe del partido ha sido cerrado y guardado.",
    });
  };

  return (
    <div className="flex flex-col gap-8">
       <PageHeader
        title={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
        description={`Informe de Scouting para ${match.competition}`}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <InteractiveField onPlayerClick={handleSelectPlayerFromField} isReadOnly={match.isClosed} />
        </div>
        <div className="lg:col-span-1">
            <PlayerList 
            players={players} 
            onPlayerUpdate={handlePlayerUpdate}
            onEditPlayer={handleEditPlayer}
            onAddNewPlayer={handleAddNewPlayer} 
            isReadOnly={match.isClosed}
            />
        </div>
        <div className="lg:col-span-3">
            <MatchNotes isReadOnly={match.isClosed} />
        </div>
        
        {!match.isClosed && (
            <div className="mt-4 flex justify-end lg:col-span-3">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <Lock className="mr-2 h-4 w-4" />
                            Cerrar Informe
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de que quieres cerrar el informe?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción es permanente. Una vez que cierres el informe, no podrás volver a editarlo. Solo un administrador podrá reabrirlo.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleCloseReport}>Sí, cerrar informe</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )}

      </div>
      <PlayerForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        player={selectedPlayer}
        onSave={handleSavePlayer}
        isReadOnly={match.isClosed}
      />
    </div>
  );
}
