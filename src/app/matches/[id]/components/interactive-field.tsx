'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import type { TacticalElement, Formation } from '@/lib/types';
import { formations } from '@/lib/types';
import { getPlayerPositions } from '@/lib/formations';
import { summarizeTacticalPositioning } from '@/ai/flows/summarize-tactical-positioning';
import SummaryModal from './summary-modal';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const SoccerFieldSVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 680 1050" preserveAspectRatio="none">
        <rect x="0" y="0" width="680" height="1050" stroke="white" strokeWidth="2" fill="#53A053" />
        <line x1="0" y1="525" x2="680" y2="525" stroke="white" strokeWidth="2" />
        <circle cx="340" cy="525" r="91.5" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="340" cy="525" r="3" fill="white" />
        
        {/* Top penalty area */}
        <rect x="138.5" y="0" width="403" height="165" stroke="white" strokeWidth="2" fill="none" />
        <rect x="248.5" y="0" width="183" height="55" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="340" cy="115" r="3" fill="white" />
        <path d="M 248.5 165 A 91.5 91.5 0 0 1 431.5 165" stroke="white" strokeWidth="2" fill="none" />

        {/* Bottom penalty area */}
        <rect x="138.5" y="885" width="403" height="165" stroke="white" strokeWidth="2" fill="none" />
        <rect x="248.5" y="995" width="183" height="55" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="340" cy="935" r="3" fill="white" />
        <path d="M 248.5 885 A 91.5 91.5 0 0 0 431.5 885" stroke="white" strokeWidth="2" fill="none" />
    </svg>
);


export default function InteractiveField() {
  const [homeFormation, setHomeFormation] = useState<Formation>('4-4-2');
  const [awayFormation, setAwayFormation] = useState<Formation>('4-3-3');
  const fieldRef = useRef<HTMLDivElement>(null);

  const [elements, setElements] = useState<TacticalElement[]>([]);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);

  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const homePlayers = getPlayerPositions(homeFormation, 'home');
    const awayPlayers = getPlayerPositions(awayFormation, 'away');
    setElements([...homePlayers, ...awayPlayers]);
  }, [homeFormation, awayFormation]);
  
  const handleSummarize = async () => {
    setIsSummarizing(true);
    
    const positioningDescription = `Home team is playing ${homeFormation}. Away team is playing ${awayFormation}. Player positions: ${JSON.stringify(elements.map(e => ({id: e.id, pos: e.position})))}`;
      
    try {
      const result = await summarizeTacticalPositioning({ positioningDescription });
      setSummary(result.summary);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error summarizing positioning:', error);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: 'Could not generate a summary. Please try again.',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggedElementId(id);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedElementId || !fieldRef.current) return;

    const fieldRect = fieldRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - fieldRect.left) / fieldRect.width) * 100));
    let y = Math.max(0, Math.min(100, ((e.clientY - fieldRect.top) / fieldRect.height) * 100));

    const isHomePlayer = draggedElementId.startsWith('H');
    if (isHomePlayer) {
        y = Math.max(50, y);
    } else {
        y = Math.min(50, y);
    }

    setElements((prev) =>
      prev.map((el) => (el.id === draggedElementId ? { ...el, position: { x, y } } : el))
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if(draggedElementId){
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDraggedElementId(null);
    }
  };


  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Interactive Field</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="home-formation">Home Team</Label>
            <Select onValueChange={(value: Formation) => setHomeFormation(value)} defaultValue={homeFormation}>
              <SelectTrigger id="home-formation" className="w-[120px]">
                <SelectValue placeholder="Formation" />
              </SelectTrigger>
              <SelectContent>
                {formations.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="away-formation">Away Team</Label>
            <Select onValueChange={(value: Formation) => setAwayFormation(value)} defaultValue={awayFormation}>
              <SelectTrigger id="away-formation" className="w-[120px]">
                <SelectValue placeholder="Formation" />
              </SelectTrigger>
              <SelectContent>
                {formations.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button size="sm" onClick={handleSummarize} disabled={isSummarizing}>
            <Wand2 className="mr-2 h-4 w-4" /> {isSummarizing ? 'Summarizing...' : 'Summarize Positioning'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-2">
        <div
            ref={fieldRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative aspect-[680/1050] w-full max-w-lg touch-none select-none overflow-hidden rounded-lg"
        >
            <div className="absolute inset-0">
            <SoccerFieldSVG />
            </div>
            {elements.map((el) => (
            <div
                key={el.id}
                onPointerDown={(e) => handlePointerDown(e, el.id)}
                className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 text-white shadow-lg active:cursor-grabbing"
                style={{
                left: `${el.position.x}%`,
                top: `${el.position.y}%`,
                backgroundColor: el.color,
                borderColor: 'rgba(255, 255, 255, 0.7)',
                touchAction: 'none',
                }}
            >
                <span className="text-[10px] font-bold">{el.label}</span>
            </div>
            ))}
        </div>
      </CardContent>
      <SummaryModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} summary={summary} />
    </Card>
  );
}
