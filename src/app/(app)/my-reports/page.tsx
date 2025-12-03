'use client';

import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { matches as allMatches, playerReports as allPlayerReports, users, players as allPlayers } from '@/lib/admin-data';
import MyReportsTable from './components/my-reports-table';
import MyMatchReportsTable from './components/my-match-reports-table';

// For demo purposes, we'll hardcode the current user's ID.
// In a real app, this would come from an authentication context.
const CURRENT_USER_ID = 'u2'; 

export default function MyReportsPage() {

    const currentUser = users.find(u => u.id === CURRENT_USER_ID);

    const myPlayerReports = allPlayerReports.filter(report => report.scoutId === CURRENT_USER_ID);
    const myAssignedMatches = allMatches.filter(match => match.assignedScoutId === CURRENT_USER_ID);

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Mis Informes"
                description={`Hola ${currentUser?.name}, aquí puedes consultar todos los informes que has creado y los partidos que tienes asignados.`}
            />
             <Card>
                <CardHeader>
                    <CardTitle>Mis Informes de Jugadores</CardTitle>
                    <CardDescription>
                        Busca y filtra todos los informes de jugadores que has generado.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MyReportsTable reports={myPlayerReports} matches={allMatches} players={allPlayers} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Mis Informes de Partidos</CardTitle>
                    <CardDescription>
                        Consulta todos los partidos que tienes asignados para realizar un informe.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MyMatchReportsTable matches={myAssignedMatches} />
                </CardContent>
            </Card>
        </div>
    );
}
