'use client';

import { useParams } from 'next/navigation';
import { matches, initialPlayers } from '@/lib/data';
import type { Player } from '@/lib/types';
import { useState } from 'react';
import PageHeader from '@/components/page-header';
import InteractiveField from './components/interactive-field';
import MatchNotes from './components/match-notes';
import PlayerList from './components/player-list';

export default function MatchPage() {
  const params = useParams();
  const matchId = typeof params.id === 'string' ? params.id : '';
  const match = matches.find((m) => m.id === matchId);

  const [players, setPlayers] = useState<Player[]>(initialPlayers);

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
  
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-8">
       <PageHeader
        title={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
        description={`Scouting Report for ${match.competition}`}
      />
      <div className="grid flex-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="flex flex-col gap-6 md:col-span-2 lg:col-span-3">
          <InteractiveField />
          <MatchNotes />
        </div>
        <div className="md:col-span-1 lg:col-span-1">
          <PlayerList players={players} onPlayerUpdate={handlePlayerUpdate} />
        </div>
      </div>
    </div>
  );
}
