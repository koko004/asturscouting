
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Player } from '@/lib/admin-types';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PlayerStrengthsWeaknessesProps {
  player: Player;
}

export default function PlayerStrengthsWeaknesses({ player }: PlayerStrengthsWeaknessesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis Rápido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="h-5 w-5 text-green-500" />
                <h4 className="font-semibold">Fortalezas</h4>
            </div>
            <div className="flex flex-wrap gap-2">
                {(player.strengths && player.strengths.length > 0) ? (
                    player.strengths.map((strength, index) => (
                        <Badge key={index} variant="secondary">{strength}</Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No definidas</p>
                )}
            </div>
        </div>
         <div>
            <div className="flex items-center gap-2 mb-2">
                <ThumbsDown className="h-5 w-5 text-red-500" />
                <h4 className="font-semibold">Debilidades</h4>
            </div>
            <div className="flex flex-wrap gap-2">
                {(player.weaknesses && player.weaknesses.length > 0) ? (
                    player.weaknesses.map((weakness, index) => (
                        <Badge key={index} variant="secondary">{weakness}</Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No definidas</p>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
