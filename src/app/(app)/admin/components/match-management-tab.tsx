'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Match, Team, User } from '@/lib/admin-types';
import { matches as initialMatches, users } from '@/lib/admin-data';
import MatchTable from './match-table';
import MatchForm from './match-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MatchManagementTab() {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [isMatchFormOpen, setMatchFormOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [competitionFilter, setCompetitionFilter] = useState('all');
  
  const competitions = useMemo(() => {
    const allCompetitions = initialMatches.map(m => m.competition);
    return ['all', ...Array.from(new Set(allCompetitions))];
  }, [initialMatches]);

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

  const handleAssignScout = (matchId: string, scoutId: string | 'unassigned') => {
    setMatches(matches.map(m => m.id === matchId ? { ...m, assignedScoutId: scoutId === 'unassigned' ? undefined : scoutId } : m));
  };

  const filteredMatches = useMemo(() => {
    if (competitionFilter === 'all') {
      return matches;
    }
    return matches.filter(m => m.competition === competitionFilter);
  }, [matches, competitionFilter]);

  const scouts = users.filter((u: User) => u.role === 'scout');

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Partidos</CardTitle>
              <CardDescription>Añade, edita y asigna partidos a los ojeadores.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrar por competición" />
                  </SelectTrigger>
                  <SelectContent>
                    {competitions.map(comp => (
                      <SelectItem key={comp} value={comp}>
                        {comp === 'all' ? 'Todas las competiciones' : comp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddNewMatch} className="w-full">
                  <PlusCircle />
                  Añadir Partido
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MatchTable
            matches={filteredMatches}
            users={users}
            scouts={scouts}
            onEdit={handleEditMatch}
            onDelete={handleDeleteMatch}
            onToggleStatus={handleToggleMatchStatus}
            onAssignScout={handleAssignScout}
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
