'use client';

import { useState, useMemo } from 'react';
import type { Report } from "@/lib/admin-types";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PlayerRatingHistoryProps {
  reports: (Report & { matchDate: string; opponent: { name: string; logoUrl: string } })[];
}

const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return 'bg-green-500';
    if (rating >= 7.5) return 'bg-green-400';
    if (rating >= 6.5) return 'bg-yellow-400';
    if (rating >= 5.5) return 'bg-orange-400';
    return 'bg-red-500';
}

const getSeason = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth();
    // Season runs from August to July
    if (month >= 7) {
        return `${year}/${(year + 1).toString().slice(-2)}`;
    }
    return `${year - 1}/${year.toString().slice(-2)}`;
}

export default function PlayerRatingHistory({ reports }: PlayerRatingHistoryProps) {

  const seasons = useMemo(() => {
    if (!reports || reports.length === 0) return [];
    const seasonSet = new Set(reports.map(r => getSeason(new Date(r.matchDate))));
    return Array.from(seasonSet).sort().reverse();
  }, [reports]);

  const [selectedSeason, setSelectedSeason] = useState<string>(seasons[0] || 'all');

  const filteredReports = useMemo(() => {
    if (selectedSeason === 'all') {
      return reports;
    }
    return reports.filter(r => getSeason(new Date(r.matchDate)) === selectedSeason);
  }, [reports, selectedSeason]);

  const displayedReports = filteredReports.slice(0, 5).reverse();

  const averageRating = useMemo(() => {
    if (filteredReports.length === 0) return 0;
    return parseFloat((filteredReports.reduce((sum, report) => sum + report.rating, 0) / filteredReports.length).toFixed(1));
  }, [filteredReports]);


  return (
    <div className="rounded-lg bg-muted/50 p-4 space-y-3">
        <div className="flex justify-start items-center">
            {seasons.length > 0 && (
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                    <SelectTrigger className="w-auto h-auto p-0 bg-transparent border-0 text-xs text-muted-foreground focus:ring-0">
                        <SelectValue placeholder="Temporada" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las temporadas</SelectItem>
                        {seasons.map(season => (
                            <SelectItem key={season} value={season}>{season}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
        {displayedReports.length > 0 ? (
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">MEDIA</span>
                    <Badge variant="default" className="text-lg">{averageRating.toFixed(1)}</Badge>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="flex-1">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        {displayedReports.map(report => (
                            <div key={report.id} className="flex-1 text-center">
                                {new Date(report.matchDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mb-1">
                        {displayedReports.map(report => (
                            <div key={report.id} className="flex-1 flex justify-center">
                                <Image 
                                    src={report.opponent.logoUrl} 
                                    alt={report.opponent.name}
                                    width={24} height={24}
                                    className="rounded-full h-6 w-6"
                                    data-ai-hint="team logo"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="relative w-full h-px bg-border my-2">
                        {displayedReports.map((report, index) => {
                           if (displayedReports.length === 1) {
                             return (
                                <div 
                                    key={report.id} 
                                    className="absolute top-1/2 -translate-y-1/2"
                                    style={{ left: `50%`}}
                                >
                                    <div className={cn(
                                        "w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white -translate-x-1/2",
                                        getRatingColor(report.rating)
                                    )}>
                                        {report.rating.toFixed(1)}
                                    </div>
                                </div>
                             )
                           }
                           return (
                            <div 
                                key={report.id} 
                                className="absolute top-1/2 -translate-y-1/2"
                                style={{ left: `${(100 / (displayedReports.length - 1)) * index}%`}}
                            >
                                <div className={cn(
                                    "w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white -translate-x-1/2",
                                    getRatingColor(report.rating)
                                )}>
                                    {report.rating.toFixed(1)}
                                </div>
                            </div>
                           )
                        })}
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-center text-sm text-muted-foreground py-4">
                No hay datos de valoración para la temporada seleccionada.
            </div>
        )}
    </div>
  );
}
