'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Report } from "@/lib/admin-types";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface PlayerRatingHistoryProps {
  reports: (Report & { matchDate: string; opponent: { name: string; logoUrl: string } })[];
  averageRating: number;
}

const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return 'bg-green-500';
    if (rating >= 7.5) return 'bg-green-400';
    if (rating >= 6.5) return 'bg-yellow-400';
    if (rating >= 5.5) return 'bg-orange-400';
    return 'bg-red-500';
}

const RatingScale = () => (
    <div className="flex flex-col justify-between h-10 w-2 rounded-full overflow-hidden">
        <div className="h-1/4 bg-green-500"></div>
        <div className="h-1/4 bg-yellow-400"></div>
        <div className="h-1/4 bg-orange-400"></div>
        <div className="h-1/4 bg-red-500"></div>
    </div>
);


export default function PlayerRatingHistory({ reports, averageRating }: PlayerRatingHistoryProps) {

  // We only want to show the last 5 reports for this chart
  const lastFiveReports = reports.slice(0, 5).reverse();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Valoración Media</CardTitle>
            <CardDescription>Rendimiento en los últimos partidos.</CardDescription>
          </div>
          <Badge variant="default" className="text-lg">{averageRating.toFixed(2)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {lastFiveReports.length > 0 ? (
            <div className="flex items-end gap-2">
                <div className="flex-1">
                    <div className="flex justify-between text-xs text-muted-foreground mb-3">
                        {lastFiveReports.map(report => (
                            <div key={report.id} className="flex-1 text-center">
                                {new Date(report.matchDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        {lastFiveReports.map(report => (
                            <div key={report.id} className="flex-1 flex justify-center">
                                <Image 
                                    src={report.opponent.logoUrl} 
                                    alt={report.opponent.name}
                                    width={28} height={28}
                                    className="rounded-full h-7 w-7"
                                    data-ai-hint="team logo"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="relative w-full h-px bg-border my-4">
                        {lastFiveReports.map((report, index) => (
                            <div 
                                key={report.id} 
                                className="absolute top-1/2 -translate-y-1/2"
                                style={{ left: `${(100 / (lastFiveReports.length -1 || 1)) * index}%`}}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold text-white -translate-x-1/2",
                                    getRatingColor(report.rating)
                                )}>
                                    {report.rating.toFixed(1)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <RatingScale />
            </div>
        ) : (
            <div className="text-center text-muted-foreground py-8">
                No hay suficientes datos de valoración para mostrar un historial.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
