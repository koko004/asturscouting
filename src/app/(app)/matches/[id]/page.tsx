'use client';

import { useParams } from 'next/navigation';
import { matches, users, players as allPlayers } from '@/lib/admin-data';
import type { Player } from '@/lib/types';
import type { Player as PlayerInDB } from '@/lib/admin-types';
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

const CURRENT_USER_ID = 'u1'; // Assume admin 'u1' for testing this feature

export default function MatchPage() {
  const params = useParams();
  const matchId = typeof params.id === 'string' ? params.id : '';
  const initialMatch = useMemo(() => matches.find((m) => m.id === matchId), [matchId]);

  const [match, setMatch] = useState(initialMatch);
  const [evaluatedPlayers, setEvaluatedPlayers] = useState<Player[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // This state would in a real app be managed by a global state or fetched from a DB
  const [globalPlayers, setGlobalPlayers] = useState<PlayerInDB[]>(allPlayers);

  const { toast } = useToast();
  
  const currentUser = useMemo(() => users.find(u => u.id === CURRENT_USER_ID), []);
  const isAdmin = currentUser?.role === 'admin';
  const playersInDb = useMemo(() => globalPlayers.map(p => p.id), [globalPlayers]);


  if (!match) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Partido no encontrado.</p>
      </div>
    );
  }

  const handlePlayerUpdate = (updatedPlayers: Player[]) => {
    setEvaluatedPlayers(updatedPlayers);
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
    const existingPlayer = evaluatedPlayers.find((p) => p.id === tacticalPlayer.id);
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
      setEvaluatedPlayers([...evaluatedPlayers, newPlayer]);
      setSelectedPlayer(newPlayer);
    }
    setIsFormOpen(true);
  };

  const handleSavePlayer = (player: Player) => {
    const playerExists = evaluatedPlayers.some((p) => p.id === player.id);
    if (playerExists) {
      setEvaluatedPlayers(evaluatedPlayers.map((p) => (p.id === player.id ? player : p)));
    } else {
      setEvaluatedPlayers([...evaluatedPlayers, player]);
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

  const handleAddToDatabase = (player: Player) => {
    // This is a simplified transformation. A real app might have more complex logic.
    const [firstName, ...lastNameParts] = player.name.split(' ');
    const newDbPlayer: PlayerInDB = {
        id: player.id,
        firstName: firstName || 'Nuevo',
        lastName: lastNameParts.join(' ') || 'Jugador',
        nationality: 'Desconocida',
        age: player.age,
        teamName: 'Desconocido', // The team should be derived from the match context
        position: player.position,
        jerseyNumber: player.jerseyNumber,
        height: 180,
        weight: 75,
        preferredFoot: 'Right',
        attributes: { attacking: 50, technical: 50, tactical: 50, defending: 50, creativity: 50, physical: 50 },
    };
    
    setGlobalPlayers(prev => [...prev, newDbPlayer]);
    
    toast({
      title: 'Jugador Añadido',
      description: `${player.name} ha sido añadido a la base de datos principal.`,
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
            <InteractiveField 
              onPlayerClick={handleSelectPlayerFromField} 
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              isReadOnly={match.isClosed} 
            />
        </div>
        <div className="lg:col-span-1">
            <PlayerList 
              players={evaluatedPlayers}
              playersInDb={playersInDb}
              onPlayerUpdate={handlePlayerUpdate}
              onEditPlayer={handleEditPlayer}
              onAddNewPlayer={handleAddNewPlayer} 
              onAddToDatabase={handleAddToDatabase}
              isReadOnly={match.isClosed}
              isAdmin={isAdmin}
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
