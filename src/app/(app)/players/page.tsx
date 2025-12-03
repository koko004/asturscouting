
'use client';

import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { matches as allMatches, playerReports as allPlayerReports, users, players as allPlayers } from '@/lib/admin-data';
import PlayersTable from './components/players-table';

// For demo purposes, we'll hardcode the current user's ID.
// In a real app, this would come from an authentication context.
const CURRENT_USER_ID = 'u2'; 

export default function PlayersPage() {

    const currentUser = users.find(u => u.id === CURRENT_USER_ID);
    const isAdmin = currentUser?.role === 'admin';

    // Admins see all reports, scouts only see their own.
    const visibleReports = isAdmin 
        ? allPlayerReports 
        : allPlayerReports.filter(report => report.scoutId === CURRENT_USER_ID);

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Jugadores"
                description="Busca y filtra todos los jugadores que han sido evaluados."
            />
             <Card>
                <CardHeader>
                    <CardTitle>Base de Datos de Jugadores</CardTitle>
                    <CardDescription>
                        {isAdmin
                            ? 'Mostrando todos los jugadores evaluados por todos los ojeadores.'
                            : 'Mostrando todos los jugadores que has evaluado.'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PlayersTable 
                        reports={visibleReports} 
                        players={allPlayers}
                        matches={allMatches} 
                        users={users}
                        isAdmin={isAdmin}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
