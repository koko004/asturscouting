'use client';

import type { Report } from "@/lib/admin-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PlayerReportsListProps {
    reports: Report[];
}

export default function PlayerReportsList({ reports }: PlayerReportsListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Historial de Informes</CardTitle>
                <CardDescription>Todos los informes de scouting para este jugador.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                        {reports.map((report: Report) => (
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
                        {reports.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">No hay informes para este jugador.</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
