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
                title: 'Notes Saved',
                description: 'Your match notes have been successfully saved.',
            });
            setIsLoading(false);
        }, 1000);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>General Match Notes</CardTitle>
                <Button size="sm" onClick={handleSave} disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Notes'}
                </Button>
            </CardHeader>
            <CardContent>
                <Textarea 
                    placeholder="Record your general observations about the match, team formations, and overall performance here..."
                    className="min-h-[120px] resize-y"
                />
            </CardContent>
        </Card>
    );
}
