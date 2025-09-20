'use client';

import { useParams } from 'next/navigation';
import { matches, initialPlayers } from '@/lib/data';
import type { Player } from '@/lib/types';
import { useState } from 'react';
import PageHeader from '@/components/page-header';
import InteractiveField from './components/interactive-field';
import MatchNotes from './components/match-notes';
import PlayerList from './components/player-list';
import PlayerForm from './components/player-form';

export default function MatchPage() {
  const params = useParams();
  const matchId = typeof params.id === 'string' ? params.id : '';
  const match = matches.find((m) => m.id === matchId);

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  if (!match) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Match not found.</p>
      </div>
    );
  }

  const handlePlayerUpdate = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
  };
  
  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setIsFormOpen(true);
  };

  const handleAddNewPlayer = () => {
    setSelectedPlayer(null);
    setIsFormOpen(true);
  };
  
  const handleSelectPlayerFromField = (tacticalPlayer: { id: string, name: string, team: 'home' | 'away' }) => {
    const existingPlayer = players.find((p) => p.id === tacticalPlayer.id);
    if (existingPlayer) {
      setSelectedPlayer(existingPlayer);
    } else {
      const newPlayer: Player = {
        id: tacticalPlayer.id,
        name: tacticalPlayer.name,
        jerseyNumber: parseInt(tacticalPlayer.name.replace(/[^0-9]/g, ''), 10),
        age: 20, // Default age
        position: 'Midfielder (MID)', // Default position
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

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-8">
       <PageHeader
        title={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
        description={`Scouting Report for ${match.competition}`}
      />
      <div className="grid flex-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="flex flex-col gap-6 md:col-span-2 lg:col-span-3">
          <InteractiveField onPlayerClick={handleSelectPlayerFromField} />
          <MatchNotes />
        </div>
        <div className="md:col-span-1 lg:col-span-1">
          <PlayerList 
            players={players} 
            onPlayerUpdate={handlePlayerUpdate}
            onEditPlayer={handleEditPlayer}
            onAddNewPlayer={handleAddNewPlayer} 
          />
        </div>
      </div>
      <PlayerForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        player={selectedPlayer}
        onSave={handleSavePlayer}
      />
    </div>
  );
}
