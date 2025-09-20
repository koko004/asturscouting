'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import type { TacticalElement, Formation } from '@/lib/types';
import { formations } from '@/lib/types';
import { getPlayerPositions } from '@/lib/formations';
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

interface InteractiveFieldProps {
    onPlayerClick: (player: {id: string, name: string, team: 'home' | 'away'}) => void;
    isReadOnly?: boolean;
}

export default function InteractiveField({ onPlayerClick, isReadOnly = false }: InteractiveFieldProps) {
  const [homeFormation, setHomeFormation] = useState<Formation>('4-4-2');
  const [awayFormation, setAwayFormation] = useState<Formation>('4-3-3');
  const fieldRef = useRef<HTMLDivElement>(null);

  const [elements, setElements] = useState<TacticalElement[]>([]);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const homePlayers = getPlayerPositions(homeFormation, 'home');
    const awayPlayers = getPlayerPositions(awayFormation, 'away');
    setElements([...homePlayers, ...awayPlayers]);
  }, [homeFormation, awayFormation]);
  
  const handleSave = () => {
    setIsSaving(true);
    // Here you would typically save the 'elements' state to your backend
    console.log('Saving player positions:', elements.map(e => ({id: e.id, pos: e.position})));
    setTimeout(() => {
      toast({
        title: 'Posiciones Guardadas',
        description: 'Las posiciones actuales de los jugadores han sido guardadas.',
      });
      setIsSaving(false);
    }, 1000);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    if (isReadOnly) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggedElementId(id);
    setIsDragging(false);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isReadOnly || !draggedElementId || !fieldRef.current) return;

    const dx = Math.abs(e.clientX - dragStartRef.current.x);
    const dy = Math.abs(e.clientY - dragStartRef.current.y);

    if (!isDragging && (dx > 5 || dy > 5)) {
      setIsDragging(true);
    }
    
    if (isDragging) {
      const fieldRect = fieldRef.current.getBoundingClientRect();
      let x = ((e.clientX - fieldRect.left) / fieldRect.width) * 100;
      let y = ((e.clientY - fieldRect.top) / fieldRect.height) * 100;
      
      const isHomePlayer = draggedElementId.startsWith('H');

      if (isHomePlayer) {
          y = Math.max(50, y);
      } else {
          y = Math.min(50, y);
      }

      x = Math.max(0, Math.min(100, x));
      y = Math.max(0, Math.min(100, y));

      setElements((prev) =>
        prev.map((el) => (el.id === draggedElementId ? { ...el, position: { x, y } } : el))
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggedElementId) {
        e.currentTarget.releasePointerCapture(e.pointerId);
        
        if (!isDragging) {
            const el = elements.find(elem => elem.id === draggedElementId);
            if (el) {
                onPlayerClick({ id: el.id, name: el.label, team: el.id.startsWith('H') ? 'home' : 'away' });
            }
        }
        
        setDraggedElementId(null);
    }
    setIsDragging(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Campo Interactivo</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <Label htmlFor="home-formation">Equipo Local</Label>
                <Select onValueChange={(value: Formation) => setHomeFormation(value)} defaultValue={homeFormation} disabled={isReadOnly}>
                  <SelectTrigger id="home-formation" className="w-[120px]">
                    <SelectValue placeholder="Formación" />
                  </SelectTrigger>
                  <SelectContent>
                    {formations.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <Label htmlFor="away-formation">Equipo Visitante</Label>
                <Select onValueChange={(value: Formation) => setAwayFormation(value)} defaultValue={awayFormation} disabled={isReadOnly}>
                  <SelectTrigger id="away-formation" className="w-[120px]">
                    <SelectValue placeholder="Formación" />
                  </SelectTrigger>
                  <SelectContent>
                    {formations.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" onClick={handleSave} disabled={isSaving || isReadOnly} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Guardando...' : 'Guardar Posiciones'}
              </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-2">
        <div
            ref={fieldRef}
            onPointerMove={handlePointerMove}
            className={`relative w-full max-w-lg touch-none select-none overflow-hidden rounded-lg aspect-[680/1050] ${isReadOnly ? 'cursor-not-allowed' : ''}`}
        >
            <div className="absolute inset-0">
            <SoccerFieldSVG />
            </div>
            {elements.map((el) => (
            <div
                key={el.id}
                onPointerDown={(e) => handlePointerDown(e, el.id)}
                onPointerUp={handlePointerUp}
                onPointerLeave={(e) => { 
                    if (draggedElementId) {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggedElementId(null);
                        setIsDragging(false);
                    }
                }}
                className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-white shadow-lg ${isReadOnly ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}`}
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
    </Card>
  );
}
