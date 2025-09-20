'use client';

import { useState, useRef, MouseEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Plus, Trash2, Milestone } from 'lucide-react';
import type { TacticalElement } from '@/lib/types';
import { cn } from '@/lib/utils';
import { summarizeTacticalPositioning } from '@/ai/flows/summarize-tactical-positioning';
import SummaryModal from './summary-modal';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const initialElements: TacticalElement[] = [
  { id: 'p1', label: 'P1', position: { x: 50, y: 85 }, type: 'player', color: 'hsl(210, 80%, 55%)' },
  { id: 'p2', label: 'P2', position: { x: 25, y: 65 }, type: 'player', color: 'hsl(210, 80%, 55%)' },
  { id: 'p3', label: 'P3', position: { x: 75, y: 65 }, type: 'player', color: 'hsl(210, 80%, 55%)' },
  { id: 'p4', label: 'P4', position: { x: 50, y: 45 }, type: 'player', color: 'hsl(210, 80%, 55%)' },
  { id: 'o1', label: 'O1', position: { x: 50, y: 15 }, type: 'player', color: 'hsl(0, 80%, 55%)' },
];

const SoccerFieldSVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 680 1050" className="bg-green-600">
        <rect x="0" y="0" width="680" height="1050" stroke="white" strokeWidth="2" fill="#53A053" />
        <line x1="0" y1="525" x2="680" y2="525" stroke="white" strokeWidth="2" />
        <circle cx="340" cy="525" r="91.5" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="340" cy="525" r="3" fill="white" />
        <rect x="0" y="0" width="680" height="165" stroke="white" strokeWidth="2" fill="none" />
        <rect x="138.5" y="0" width="403" height="55" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="340" cy="110" r="3" fill="white" />
        <path d="M 248.5 165 A 91.5 91.5 0 0 1 431.5 165" stroke="white" strokeWidth="2" fill="none" />
        <rect x="0" y="885" width="680" height="165" stroke="white" strokeWidth="2" fill="none" />
        <rect x="138.5" y="995" width="403" height="55" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="340" cy="940" r="3" fill="white" />
        <path d="M 248.5 885 A 91.5 91.5 0 0 0 431.5 885" stroke="white" strokeWidth="2" fill="none" />
    </svg>
);


export default function InteractiveField() {
  const [elements, setElements] = useState<TacticalElement[]>(initialElements);
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPositionFromEvent = (e: MouseEvent) => {
    if (!fieldRef.current) return { x: 0, y: 0 };
    const rect = fieldRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  };

  const handleMouseDown = (e: MouseEvent, id: string) => {
    setDraggingElement(id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingElement) return;
    const { x, y } = getPositionFromEvent(e);
    setElements((prev) =>
      prev.map((el) => (el.id === draggingElement ? { ...el, position: { x, y } } : el))
    );
  };

  const handleMouseUp = () => {
    setDraggingElement(null);
  };

  const addElement = (type: 'player' | 'cone' | 'ball') => {
    const newId = `${type.charAt(0)}${elements.length + 1}`;
    const newElement: TacticalElement = {
      id: newId,
      label: newId.toUpperCase(),
      position: { x: 50, y: 50 },
      type,
      color: type === 'player' ? 'hsl(340, 80%, 55%)' : type === 'cone' ? 'hsl(45, 100%, 50%)' : 'white',
    };
    setElements([...elements, newElement]);
  };
  
  const handleSummarize = async () => {
    setIsSummarizing(true);
    const positioningDescription = elements
      .map(el => `${el.label} (${el.type}) is at position (${Math.round(el.position.x)}, ${Math.round(el.position.y)})`)
      .join('; ');
      
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


  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Interactive Field</CardTitle>
        <div className="flex items-center gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Element</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => addElement('player')}>
                <Plus className="mr-2 h-4 w-4" /> Player
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addElement('ball')}>
                <Milestone className="mr-2 h-4 w-4" /> Ball
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addElement('cone')}>
                <Trash2 className="mr-2 h-4 w-4" /> Cone
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" onClick={handleSummarize} disabled={isSummarizing}>
            <Wand2 className="mr-2 h-4 w-4" /> {isSummarizing ? 'Summarizing...' : 'Summarize Positioning'}
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setElements([])}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent
        ref={fieldRef}
        className="relative h-[500px] select-none touch-none overflow-hidden rounded-lg"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="absolute inset-0">
          <SoccerFieldSVG />
        </div>
        {elements.map((el) => (
          <div
            key={el.id}
            className={cn(
              "absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 text-white shadow-lg",
              { 'cursor-grabbing': draggingElement === el.id }
            )}
            style={{
              left: `${el.position.x}%`,
              top: `${el.position.y}%`,
              backgroundColor: el.color,
              borderColor: 'rgba(255, 255, 255, 0.7)',
            }}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
          >
             <span className="text-xs font-bold">{el.label}</span>
          </div>
        ))}
      </CardContent>
      <SummaryModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} summary={summary} />
    </Card>
  );
}
