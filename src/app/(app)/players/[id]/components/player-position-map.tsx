
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PlayerPosition } from '@/lib/admin-types';

const SoccerFieldSVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 150 220" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="0" width="150" height="220" stroke="hsl(var(--border))" strokeWidth="2" fill="hsl(var(--muted))" />
        <line x1="0" y1="110" x2="150" y2="110" stroke="hsl(var(--border))" strokeWidth="2" />
        <circle cx="75" cy="110" r="20" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
        <circle cx="75" cy="110" r="1.5" fill="hsl(var(--border))" />
        <rect x="30" y="0" width="90" height="40" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
        <rect x="30" y="180" width="90" height="40" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
    </svg>
);

const positionCoordinates: Record<PlayerPosition, { top: string; left: string; short: string }> = {
    'Portero (POR)': { top: '88%', left: '50%', short: 'POR' },
    'Defensa (DEF)': { top: '75%', left: '50%', short: 'DEF' },
    'Centrocampista (CEN)': { top: '50%', left: '50%', short: 'CEN' },
    'Delantero (DEL)': { top: '25%', left: '50%', short: 'DEL' },
};

interface PlayerPositionMapProps {
  position: PlayerPosition;
}

export default function PlayerPositionMap({ position }: PlayerPositionMapProps) {
  const pos = positionCoordinates[position] || positionCoordinates['Centrocampista (CEN)'];

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Posición Principal</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <div className="relative w-[150px] h-[220px]">
          <SoccerFieldSVG />
          <Badge 
            variant="default"
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: pos.top, left: pos.left }}
          >
            {pos.short}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
