'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Player, User } from '@/lib/admin-types';
import { players as initialPlayers, users } from '@/lib/admin-data';
import PlayerManagementTable from './player-management-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PlayerManagementTab() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  
  const handleAssignScout = (playerId: string, scoutId: string | 'unassigned') => {
    setPlayers(players.map(p => p.id === playerId ? { ...p, assignedScoutId: scoutId === 'unassigned' ? undefined : scoutId } : p));
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Gestionar Jugadores</CardTitle>
            <CardDescription>Asigna jugadores a ojeadores para un seguimiento detallado.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <PlayerManagementTable
            players={players}
            users={users}
            onAssignScout={handleAssignScout}
        />
      </CardContent>
    </Card>
  );
}
