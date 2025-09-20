'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

export default function MatchNotes() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast({
                title: 'Notas Guardadas',
                description: 'Tus notas del partido han sido guardadas con éxito.',
            });
            setIsLoading(false);
        }, 1000);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Notas Generales del Partido</CardTitle>
                <Button size="sm" onClick={handleSave} disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Guardando...' : 'Guardar Notas'}
                </Button>
            </CardHeader>
            <CardContent>
                <Textarea 
                    placeholder="Anota aquí tus observaciones generales sobre el partido, formaciones del equipo y rendimiento general..."
                    className="min-h-[120px] resize-y"
                />
            </CardContent>
        </Card>
    );
}
