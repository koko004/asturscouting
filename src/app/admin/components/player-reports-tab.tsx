'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { matches as allMatches, playerReports as allPlayerReports } from '@/lib/admin-data';
import PlayerReportsTable from './player-reports-table';


export default function PlayerReportsTab() {
  
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Informes de Jugadores</CardTitle>
          <CardDescription>
            Busca y filtra todos los informes de jugadores creados por los ojeadores.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <PlayerReportsTable reports={allPlayerReports} matches={allMatches} />
      </CardContent>
    </Card>
  );
}
