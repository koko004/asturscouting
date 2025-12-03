'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { players as allPlayers, playerReports as allReports, matches as allMatches, users } from '@/lib/admin-data';
import { Edit } from 'lucide-react';
import PlayerProfileForm from './components/player-profile-form';
import type { Player, Report, Match } from '@/lib/admin-types';
import PlayerAttributesChart from './components/player-attributes-chart';
import PlayerStatsSummary from './components/player-stats-summary';
import PlayerStrengthsWeaknesses from './components/player-strengths-weaknesses';
import PlayerPositionMap from './components/player-position-map';
import PlayerInfoCard from './components/player-info-card';
import PlayerRatingHistory from './components/player-rating-history';
import PlayerReportsList from './components/player-reports-list';
import PlayerAttributesForm from './components/player-attributes-form';


export default function PlayerProfilePage() {
    const params = useParams();
    const playerId = typeof params.id === 'string' ? params.id : '';

    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // In a real app, you'd fetch this data, but for now we'll filter the mock data.
    const [player, setPlayer] = useState(allPlayers.find(p => p.id === playerId));
    
    const playerReports = useMemo(() => {
        if (!player) return [];
        return allReports
            .filter(r => r.playerId === playerId)
            .map(report => {
                const match = allMatches.find(m => m.id === report.matchId);
                const scout = users.find(u => u.id === report.scoutId);
                const opponent = match?.homeTeam.name === player.teamName ? match?.awayTeam : match?.homeTeam;
                
                return {
                    ...report,
                    matchDescription: match ? `${match.homeTeam.name} vs ${match.awayTeam.name}` : 'Partido Desconocido',
                    matchDate: match?.date || new Date().toISOString(),
                    scoutName: scout?.name || 'Desconocido',
                    opponent: opponent || { name: 'Desconocido', logoUrl: '' },
                };
            })
            .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());
    }, [playerId, player]);


    if (!player) {
        return <div className="flex h-full items-center justify-center">Jugador no encontrado</div>;
    }

    const handleSavePlayer = (updatedPlayer: Partial<Player>) => {
        setPlayer(prev => prev ? { ...prev, ...updatedPlayer } : undefined);
        // Here you would also update the allPlayers array or send to a backend
    };
    
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardContent className="relative p-4 md:p-6">
                     <Button onClick={() => setIsFormOpen(true)} size="icon" variant="ghost" className="absolute top-2 right-2 h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar Perfil</span>
                    </Button>
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                        <Image
                            src={`https://picsum.photos/seed/${player.id}/200/280`}
                            alt={`Foto de ${player.firstName} ${player.lastName}`}
                            width={140}
                            height={200}
                            className="h-auto w-24 md:w-36 rounded-md object-cover shadow-md"
                            data-ai-hint="person face"
                        />
                        <div className="flex-1 space-y-3 w-full">
                            <PageHeader title={`${player.firstName} ${player.lastName}`} />
                            <PlayerInfoCard player={player} />
                            <PlayerRatingHistory reports={playerReports} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="summary">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="summary">Resumen</TabsTrigger>
                    <TabsTrigger value="attributes">Atributos</TabsTrigger>
                    <TabsTrigger value="reports">Informes ({playerReports.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                             <div className="flex flex-col sm:flex-row gap-6">
                                <PlayerAttributesChart attributes={player.attributes} />
                                <PlayerPositionMap position={player.position} />
                            </div>
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <PlayerStatsSummary player={player} />
                            <PlayerStrengthsWeaknesses player={player} />
                        </div>
                    </div>
                </TabsContent>
                 <TabsContent value="attributes" className="mt-6">
                    <PlayerAttributesForm player={player} onSave={handleSavePlayer} />
                </TabsContent>
                <TabsContent value="reports" className="mt-6">
                    <PlayerReportsList reports={playerReports} />
                </TabsContent>
            </Tabs>
            
            <PlayerProfileForm
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                player={player}
                onSave={handleSavePlayer}
            />
        </div>
    );
}
