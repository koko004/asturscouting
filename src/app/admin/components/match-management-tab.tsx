'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Match, Team } from '@/lib/admin-types';
import { matches as initialMatches, users } from '@/lib/admin-data';
import MatchTable from './match-table';
import MatchForm from './match-form';


export default function MatchManagementTab() {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [isMatchFormOpen, setMatchFormOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const handleSaveMatch = (matchData: Omit<Match, 'id'>) => {
    if (selectedMatch) {
      // Update existing match
      setMatches(matches.map(m => m.id === selectedMatch.id ? { ...m, ...matchData, id: m.id } : m));
    } else {
      // Add new match
      const newMatch: Match = {
        ...matchData,
        id: `m${Date.now()}`,
      };
      setMatches([...matches, newMatch]);
    }
  };

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
    setMatchFormOpen(true);
  };
  
  const handleAddNewMatch = () => {
    setSelectedMatch(null);
    setMatchFormOpen(true);
  };

  const handleDeleteMatch = (matchId: string) => {
    setMatches(matches.filter(m => m.id !== matchId));
  };
  
  const handleToggleMatchStatus = (matchId: string) => {
    setMatches(matches.map(m => m.id === matchId ? { ...m, isClosed: !m.isClosed } : m));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Partidos</CardTitle>
              <CardDescription>Añade, edita y asigna partidos a los ojeadores.</CardDescription>
            </div>
            <Button onClick={handleAddNewMatch}>
              <PlusCircle />
              Añadir Partido
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <MatchTable
            matches={matches}
            users={users}
            onEdit={handleEditMatch}
            onDelete={handleDeleteMatch}
            onToggleStatus={handleToggleMatchStatus}
          />
        </CardContent>
      </Card>
      <MatchForm
        isOpen={isMatchFormOpen}
        onOpenChange={setMatchFormOpen}
        onSave={handleSaveMatch}
        match={selectedMatch}
        users={users}
      />
    </>
  );
}
