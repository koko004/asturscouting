import Link from 'next/link';
import Image from 'next/image';
import { matches, users } from '@/lib/admin-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Unlock, User, MapPin } from 'lucide-react';
import PageHeader from '@/components/page-header';

export default function MatchesPage() {

  const getScoutName = (scoutId: string | undefined) => {
    if (!scoutId) return 'Sin asignar';
    const scout = users.find(u => u.id === scoutId);
    return scout ? scout.name : 'Desconocido';
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Partidos Asignados"
        description="Revisa tus partidos asignados para el próximo fin de semana."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
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
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{match.stadium}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{new Date(match.date).toLocaleString('es-ES', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/matches/${match.id}`}>
                    {match.isClosed ? 'Ver Informe' : 'Iniciar Informe'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
