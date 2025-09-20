
'use client';

import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { matches as allMatches, playerReports as allPlayerReports, users } from '@/lib/admin-data';
import MyReportsTable from './components/my-reports-table';

// For demo purposes, we'll hardcode the current user's ID.
// In a real app, this would come from an authentication context.
const CURRENT_USER_ID = 'u2'; 

export default function MyReportsPage() {

    const currentUser = users.find(u => u.id === CURRENT_USER_ID);

    const myReports = allPlayerReports.filter(report => report.scoutId === CURRENT_USER_ID);

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Mis Informes"
                description={`Hola ${currentUser?.name}, aquí puedes consultar todos los informes de jugadores que has creado.`}
            />
             <Card>
                <CardHeader>
                    <CardTitle>Mis Informes de Jugadores</CardTitle>
                    <CardDescription>
                        Busca y filtra todos los informes que has generado.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MyReportsTable reports={myReports} matches={allMatches} />
                </CardContent>
            </Card>
        </div>
    );
}
