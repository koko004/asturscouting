
'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { players as allPlayers, playerReports as allReports, matches as allMatches, users } from '@/lib/admin-data';
import { Edit } from 'lucide-react';
import PlayerProfileForm from './components/player-profile-form';
import type { Player } from '@/lib/admin-types';


export default function PlayerProfilePage() {
    const params = useParams();
    const playerId = typeof params.id === 'string' ? params.id : '';

    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // In a real app, you'd fetch this data, but for now we'll filter the mock data.
    const [player, setPlayer] = useState(allPlayers.find(p => p.id === playerId));
    
    const playerReports = useMemo(() => {
        return allReports
            .filter(r => r.playerId === playerId)
            .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    }, [playerId]);

    if (!player) {
        return <div>Jugador no encontrado</div>;
    }

    const handleSavePlayer = (updatedPlayer: Player) => {
        setPlayer(updatedPlayer);
        // Here you would also update the allPlayers array or send to a backend
    };
    
    const getMatchDescription = (matchId: string) => {
        const match = allMatches.find(m => m.id === matchId);
        return match ? `${match.homeTeam.name} vs ${match.awayTeam.name}` : 'Partido Desconocido';
    }

    const getScoutName = (scoutId: string) => {
        return users.find(u => u.id === scoutId)?.name || 'Desconocido';
    }

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title={`${player.firstName} ${player.lastName}`}>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Perfil
                </Button>
            </PageHeader>

            <Tabs defaultValue="summary">
                <TabsList>
                    <TabsTrigger value="summary">Resumen</TabsTrigger>
                    <TabsTrigger value="reports">Informes</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Perfil del Jugador</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={`https://picsum.photos/seed/${player.id}/200`} data-ai-hint="person face" />
                                    <AvatarFallback>{player.firstName[0]}{player.lastName[0]}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="space-y-2 text-sm">
                                <p><strong>Nombre:</strong> {player.firstName} {player.lastName}</p>
                                <p><strong>Nacionalidad:</strong> {player.nationality}</p>
                                <p><strong>Edad:</strong> {player.age}</p>
                                <p><strong>Equipo:</strong> {player.teamName}</p>
                                <p><strong>Posición:</strong> {player.position}</p>
                                <p><strong>Dorsal:</strong> #{player.jerseyNumber}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="reports" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Informes</CardTitle>
                            <CardDescription>Todos los informes de scouting para este jugador.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {playerReports.map(report => (
                                <Card key={report.id}>
                                    <CardHeader>
                                        <CardTitle className="text-base">{getMatchDescription(report.matchId)}</CardTitle>
                                        <CardDescription>
                                            Ojeador: {getScoutName(report.scoutId)} | Valoración: {report.rating}/10
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="italic">"{report.notes}"</p>
                                    </CardContent>
                                </Card>
                            ))}
                            {playerReports.length === 0 && (
                                <p className="text-center text-muted-foreground">No hay informes para este jugador.</p>
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
