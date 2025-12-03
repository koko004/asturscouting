'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { players as allPlayers, playerReports as allReports, matches as allMatches, users } from '@/lib/admin-data';
import { Edit } from 'lucide-react';
import PlayerProfileForm from './components/player-profile-form';
import type { Player, Report } from '@/lib/admin-types';
import PlayerAttributesChart from './components/player-attributes-chart';
import PlayerStatsSummary from './components/player-stats-summary';
import PlayerStrengthsWeaknesses from './components/player-strengths-weaknesses';
import PlayerPositionMap from './components/player-position-map';
import PlayerInfoCard from './components/player-info-card';


export default function PlayerProfilePage() {
    const params = useParams();
    const playerId = typeof params.id === 'string' ? params.id : '';

    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // In a real app, you'd fetch this data, but for now we'll filter the mock data.
    const [player, setPlayer] = useState(allPlayers.find(p => p.id === playerId));
    
    const playerReports = useMemo(() => {
        return allReports
            .filter(r => r.playerId === playerId)
            .map(report => {
                const match = allMatches.find(m => m.id === report.matchId);
                const scout = users.find(u => u.id === report.scoutId);
                return {
                    ...report,
                    matchDescription: match ? `${match.homeTeam.name} vs ${match.awayTeam.name}` : 'Partido Desconocido',
                    scoutName: scout?.name || 'Desconocido',
                };
            })
            .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    }, [playerId]);

    const averageRating = useMemo(() => {
        if (playerReports.length === 0) return 0;
        const total = playerReports.reduce((sum, report) => sum + report.rating, 0);
        return parseFloat((total / playerReports.length).toFixed(1));
    }, [playerReports]);


    if (!player) {
        return <div className="flex h-full items-center justify-center">Jugador no encontrado</div>;
    }

    const handleSavePlayer = (updatedPlayer: Player) => {
        setPlayer(updatedPlayer);
        // Here you would also update the allPlayers array or send to a backend
    };
    
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Image
                            src={`https://picsum.photos/seed/${player.id}/200/280`}
                            alt={`Foto de ${player.firstName} ${player.lastName}`}
                            width={140}
                            height={200}
                            className="h-auto w-36 rounded-md object-cover shadow-md"
                            data-ai-hint="person face"
                        />
                        <div className="flex-1 text-center md:text-left">
                            <PageHeader title={`${player.firstName} ${player.lastName}`} />
                            <PlayerInfoCard player={player} averageRating={averageRating} />
                        </div>
                        <Button onClick={() => setIsFormOpen(true)} size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Perfil
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="summary">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">Resumen</TabsTrigger>
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
                <TabsContent value="reports" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Informes</CardTitle>
                            <CardDescription>Todos los informes de scouting para este jugador.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {playerReports.map((report: Report) => (
                                <Card key={report.id}>
                                    <CardHeader>
                                        <CardTitle className="text-base">{report.matchDescription}</CardTitle>
                                        <CardDescription>
                                            Ojeador: {report.scoutName} | Valoración: {report.rating}/10
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="italic">"{report.notes}"</p>
                                    </CardContent>
                                </Card>
                            ))}
                            {playerReports.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">No hay informes para este jugador.</p>
                            )}
                        </CardContent>
                    </Card>
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
