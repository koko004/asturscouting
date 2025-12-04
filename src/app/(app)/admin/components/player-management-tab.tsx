'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Player, User } from '@/lib/admin-types';
import { players as initialPlayers, users } from '@/lib/admin-data';
import PlayerManagementTable from './player-management-table';
import PlayerForm from './player-form';
import RequestReportForm from './request-report-form';
import { useToast } from '@/hooks/use-toast';

export default function PlayerManagementTab() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [isPlayerFormOpen, setPlayerFormOpen] = useState(false);
  const [isRequestReportFormOpen, setRequestReportFormOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { toast } = useToast();

  const handleSavePlayer = (playerData: Omit<Player, 'id'>) => {
    if (selectedPlayer) {
      // Update existing player
      setPlayers(players.map(p => p.id === selectedPlayer.id ? { ...p, ...playerData, id: p.id } : p));
    } else {
      // Add new player
      const newPlayer: Player = {
        ...(playerData as Player),
        id: `p${Date.now()}`,
        teamLogoUrl: `https://picsum.photos/seed/team-${Math.random()}/40`,
        attributes: { attacking: 50, technical: 50, tactical: 50, defending: 50, creativity: 50, physical: 50 },
      };
      setPlayers([...players, newPlayer]);
    }
  };
  
  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setPlayerFormOpen(true);
  };

  const handleAddNewPlayer = () => {
    setSelectedPlayer(null);
    setPlayerFormOpen(true);
  };

  const handleDeletePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const handleAssignScout = (playerId: string, scoutId: string | 'unassigned') => {
    setPlayers(players.map(p => p.id === playerId ? { ...p, assignedScoutId: scoutId === 'unassigned' ? undefined : scoutId } : p));
  };

  const handleRequestReport = (player: Player) => {
    setSelectedPlayer(player);
    setRequestReportFormOpen(true);
  };

  const handleSaveReportRequest = (scoutId: string, notify: boolean) => {
    if (!selectedPlayer) return;

    setPlayers(players.map(p => p.id === selectedPlayer.id ? { ...p, assignedScoutId: scoutId, reportRequestedBy: 'u1' } : p));
    
    toast({
        title: 'Informe Solicitado',
        description: `Se ha solicitado un informe de ${selectedPlayer.firstName} ${selectedPlayer.lastName}. ${notify ? 'El ojeador será notificado.' : ''}`
    });

    setRequestReportFormOpen(false);
    setSelectedPlayer(null);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Gestionar Jugadores</CardTitle>
              <CardDescription>Añade, edita, elimina y asigna jugadores a ojeadores.</CardDescription>
            </div>
             <Button onClick={handleAddNewPlayer}>
              <PlusCircle />
              Añadir Jugador
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PlayerManagementTable
              players={players}
              users={users}
              onAssignScout={handleAssignScout}
              onEdit={handleEditPlayer}
              onDelete={handleDeletePlayer}
              onRequestReport={handleRequestReport}
          />
        </CardContent>
      </Card>
      <PlayerForm
        isOpen={isPlayerFormOpen}
        onOpenChange={setPlayerFormOpen}
        onSave={handleSavePlayer}
        player={selectedPlayer}
      />
      <RequestReportForm
        isOpen={isRequestReportFormOpen}
        onOpenChange={setRequestReportFormOpen}
        onSave={handleSaveReportRequest}
        player={selectedPlayer}
        scouts={users.filter(u => u.role === 'scout')}
      />
    </>
  );
}
