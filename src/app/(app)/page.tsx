
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { matches, users, players as initialPlayers, playerReports as allReports } from '@/lib/admin-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Unlock, User, MapPin, Target, Mail, ShieldCheck, PlusCircle, FileText } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import PlayerReportForm from './players/[id]/components/player-report-form';
import type { PlayerReport, Player } from '@/lib/admin-types';

const ClientFormattedDate = ({ date }: { date: string }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(
      new Date(date).toLocaleString('es-ES', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    );
  }, [date]);

  // Render a placeholder or nothing until the client-side formatting is done
  if (!formattedDate) {
    return null; // Or a loading skeleton
  }

  return <span>{formattedDate}</span>;
};


export default function DashboardPage() {
  // In a real app, this would come from an auth context
  const currentUserId = 'u2'; 
  const currentUser = users.find(u => u.id === currentUserId);
  const assignedMatches = matches.filter(m => m.assignedScoutId === currentUserId);
  const assignedPlayers = initialPlayers.filter(p => p.assignedScoutId === currentUserId);

  const [isReportFormOpen, setReportFormOpen] = useState(false);
  const [selectedPlayerForReport, setSelectedPlayerForReport] = useState<Player | null>(null);
  const [playerReports, setPlayerReports] = useState(allReports);
  
  const requestedPlayerReports = assignedPlayers.filter(p => p.reportRequestedBy);


  const getScoutName = (scoutId: string | undefined) => {
    if (!scoutId) return 'Sin asignar';
    const scout = users.find(u => u.id === scoutId);
    return scout ? scout.name : 'Desconocido';
  }

  const handleOpenReportForm = (player: Player) => {
    setSelectedPlayerForReport(player);
    setReportFormOpen(true);
  };

  const handleSaveReport = (report: Omit<PlayerReport, 'id' | 'playerId' | 'scoutId'>) => {
      if (!selectedPlayerForReport) return;
        const newReport: PlayerReport = {
            id: `pr${Date.now()}`,
            playerId: selectedPlayerForReport.id,
            scoutId: currentUserId, 
            ...report,
        };
        setPlayerReports(prev => [...prev, newReport]);
    };

  return (
    <>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Dashboard"
          description="Revisa tus partidos y jugadores asignados."
        />
        
        {currentUser && (
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <h2 className="text-xl font-bold">{currentUser.name}</h2>
                <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      {currentUser.email}
                  </div>
                   <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      <Badge variant={currentUser.role === 'admin' ? 'destructive' : 'secondary'}>
                          {currentUser.role === 'admin' ? 'Administrador' : 'Ojeador'}
                      </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {requestedPlayerReports.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Informes de Jugadores Solicitados</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {requestedPlayerReports.map((player) => (
                <Card key={player.id} className="flex flex-col transition-all hover:shadow-lg border-primary">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="text-primary" />
                        {player.firstName} {player.lastName}
                      </CardTitle>
                      <CardDescription>{player.teamName}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-4">
                    <Image
                        src={`https://picsum.photos/seed/${player.id}/200/280`}
                        alt={`Foto de ${player.firstName} ${player.lastName}`}
                        width={200}
                        height={280}
                        className="w-full h-auto rounded-md object-cover"
                        data-ai-hint="person face"
                    />
                    <div className="space-y-2 text-sm text-muted-foreground">
                       <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span>Posición: {player.position}</span>
                        </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Solicitado por: {getScoutName(player.reportRequestedBy)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => handleOpenReportForm(player)} >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear Informe
                      </Button>
                      <Button asChild className="w-full" variant="outline">
                        <Link href={`/players/${player.id}`}>
                          Ver Perfil Completo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Partidos Asignados</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignedMatches.length > 0 ? assignedMatches.map((match) => (
              <Card key={match.id} className="flex flex-col transition-all hover:shadow-lg">
                <CardHeader className="relative">
                  {match.isClosed ? (
                    <Lock className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Unlock className="absolute right-4 top-4 h-5 w-5 text-primary" />
                  )}
                  <CardTitle className="text-base font-medium text-muted-foreground">
                    {match.competition}
                  </CardTitle>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      <Image
                        src={match.homeTeam.logoUrl}
                        alt={`${match.homeTeam.name} logo`}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                        data-ai-hint="team logo"
                      />
                      <span className="text-xl font-bold">{match.homeTeam.name}</span>
                    </div>
                    <span className="text-xl font-bold">vs</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold">{match.awayTeam.name}</span>
                      <Image
                        src={match.awayTeam.logoUrl}
                        alt={`${match.awayTeam.name} logo`}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                        data-ai-hint="team logo"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-end gap-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{getScoutName(match.assignedScoutId)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <ClientFormattedDate date={match.date} />
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/matches/${match.id}`}>
                        {match.isClosed ? 'Ver Informe' : 'Iniciar Informe'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <p className="text-muted-foreground col-span-3">No tienes partidos asignados para esta semana.</p>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Seguimiento de Jugadores</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {assignedPlayers.filter(p => !p.reportRequestedBy).length > 0 ? assignedPlayers.filter(p => !p.reportRequestedBy).map((player) => (
              <Card key={player.id} className="flex flex-col transition-all hover:shadow-lg">
                <CardHeader>
                    <CardTitle>{player.firstName} {player.lastName}</CardTitle>
                    <CardDescription>{player.teamName}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <Image
                      src={`https://picsum.photos/seed/${player.id}/200/280`}
                      alt={`Foto de ${player.firstName} ${player.lastName}`}
                      width={200}
                      height={280}
                      className="w-full h-auto rounded-md object-cover"
                      data-ai-hint="person face"
                  />
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span>Posición: {player.position}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Scout: {getScoutName(player.assignedScoutId)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => handleOpenReportForm(player)} variant="outline">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Crear Informe
                    </Button>
                    <Button asChild className="w-full">
                      <Link href={`/players/${player.id}`}>
                        Ver Perfil Completo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <p className="text-muted-foreground col-span-4">No tienes jugadores asignados para seguimiento.</p>
            )}
          </div>
        </div>
      </div>
       <PlayerReportForm
        isOpen={isReportFormOpen}
        onOpenChange={setReportFormOpen}
        onSave={handleSaveReport}
      />
    </>
  );
}
