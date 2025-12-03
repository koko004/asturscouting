
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Player } from '@/lib/admin-types';
import { PersonStanding, Weight, Footprints, Shirt } from 'lucide-react';

interface PlayerStatsSummaryProps {
  player: Player;
}

const StatItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-3 text-center">
        <Icon className="h-6 w-6 text-muted-foreground mb-1" />
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold text-sm">{value}</p>
    </div>
);


export default function PlayerStatsSummary({ player }: PlayerStatsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos Físicos y de Juego</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <StatItem icon={PersonStanding} label="Altura" value={`${player.height} cm`} />
        <StatItem icon={Weight} label="Peso" value={`${player.weight} kg`} />
        <StatItem icon={Footprints} label="Pie Preferido" value={player.preferredFoot} />
        <StatItem icon={Shirt} label="Dorsal" value={`#${player.jerseyNumber}`} />
      </CardContent>
    </Card>
  );
}
