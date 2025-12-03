'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Move, ArrowUpRight, Eraser, Undo2 } from 'lucide-react';
import type { TacticalElement, Formation, Team } from '@/lib/types';
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
import { cn } from '@/lib/utils';

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
        <path d="M 248.5 165 A 91.5 91.5 0 0 0 431.5 165" stroke="white" strokeWidth="2" fill="none" />

        {/* Bottom penalty area */}
        <rect x="138.5" y="885" width="403" height="165" stroke="white" strokeWidth="2" fill="none" />
        <rect x="248.5" y="995" width="183" height="55" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="340" cy="935" r="3" fill="white" />
        <path d="M 248.5 885 A 91.5 91.5 0 0 1 431.5 885" stroke="white" strokeWidth="2" fill="none" />
    </svg>
);

interface Arrow {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
}

interface InteractiveFieldProps {
    onPlayerClick: (player: {id: string, name: string, team: 'home' | 'away'}) => void;
    homeTeam: Team;
    awayTeam: Team;
    isReadOnly?: boolean;
}

type Tool = 'move' | 'arrow';

export default function InteractiveField({ onPlayerClick, homeTeam, awayTeam, isReadOnly = false }: InteractiveFieldProps) {
  const [homeFormation, setHomeFormation] = useState<Formation>('4-4-2');
  const [awayFormation, setAwayFormation] = useState<Formation>('4-3-3');
  const fieldRef = useRef<HTMLDivElement>(null);

  const [elements, setElements] = useState<TacticalElement[]>([]);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [currentArrow, setCurrentArrow] = useState<Arrow | null>(null);

  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const [activeTool, setActiveTool] = useState<Tool>('move');
  
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const homePlayers = getPlayerPositions(homeFormation, 'home', homeTeam.name);
    const awayPlayers = getPlayerPositions(awayFormation, 'away', awayTeam.name);
    setElements([...homePlayers, ...awayPlayers]);
  }, [homeFormation, awayFormation, homeTeam, awayTeam]);
  
  const handleSave = () => {
    setIsSaving(true);
    // Here you would typically save the 'elements' and 'arrows' state to your backend
    console.log('Saving player positions:', elements.map(e => ({id: e.id, pos: e.position})));
    console.log('Saving arrows:', arrows);
    setTimeout(() => {
      toast({
        title: 'Táctica Guardada',
        description: 'Las posiciones y los dibujos han sido guardados.',
      });
      setIsSaving(false);
    }, 1000);
  };
  
  const getCoords = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!fieldRef.current) return { x: 0, y: 0 };
    const fieldRect = fieldRef.current.getBoundingClientRect();
    const x = ((e.clientX - fieldRect.left) / fieldRect.width) * 100;
    const y = ((e.clientY - fieldRect.top) / fieldRect.height) * 100;
    return { x, y };
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, id?: string) => {
    if (isReadOnly) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    if (activeTool === 'move' && id) {
      setDraggedElementId(id);
      setIsDragging(false);
    } else if (activeTool === 'arrow') {
      const start = getCoords(e);
      const newArrow = { id: `arrow-${Date.now()}`, start, end: start };
      setCurrentArrow(newArrow);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isReadOnly) return;

    if (activeTool === 'move' && draggedElementId && fieldRef.current) {
      const dx = Math.abs(e.clientX - dragStartRef.current.x);
      const dy = Math.abs(e.clientY - dragStartRef.current.y);

      if (!isDragging && (dx > 5 || dy > 5)) {
        setIsDragging(true);
      }
      
      if (isDragging) {
        const { x, y } = getCoords(e);
        const isHomePlayer = draggedElementId.startsWith('H');
        const clampedY = isHomePlayer ? Math.max(50, y) : Math.min(50, y);
        const clampedX = Math.max(0, Math.min(100, x));

        setElements((prev) =>
          prev.map((el) => (el.id === draggedElementId ? { ...el, position: { x: clampedX, y: clampedY } } : el))
        );
      }
    } else if (activeTool === 'arrow' && currentArrow) {
      const end = getCoords(e);
      setCurrentArrow({ ...currentArrow, end });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (activeTool === 'move' && draggedElementId) {
        if (!isDragging) {
            const el = elements.find(elem => elem.id === draggedElementId);
            if (el) {
                onPlayerClick({ id: el.id, name: el.label, team: el.id.startsWith('H') ? 'home' : 'away' });
            }
        }
        setDraggedElementId(null);
        setIsDragging(false);
    } else if (activeTool === 'arrow' && currentArrow) {
        if (Math.hypot(currentArrow.end.x - currentArrow.start.x, currentArrow.end.y - currentArrow.start.y) > 2) {
             setArrows(prev => [...prev, currentArrow]);
        }
        setCurrentArrow(null);
    }
  };
  
  const clearDrawings = () => {
    setArrows([]);
  };

  const undoLastArrow = () => {
    setArrows(prev => prev.slice(0, -1));
  };

  return (
    <>
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Campo Interactivo</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <Label htmlFor="home-formation">{homeTeam.name}</Label>
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
                <Label htmlFor="away-formation">{awayTeam.name}</Label>
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
                <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Guardando...' : 'Guardar Táctica'}
              </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-2 relative">
        <div
            ref={fieldRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={cn(
              'relative w-full max-w-lg touch-none select-none overflow-hidden rounded-lg aspect-[680/1050]',
              isReadOnly ? 'cursor-not-allowed' : (activeTool === 'arrow' ? 'cursor-crosshair' : '')
            )}
        >
            <div className="absolute inset-0">
              <SoccerFieldSVG />
            </div>
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                <defs>
                    <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="5" refY="1.75" orient="auto">
                        <polygon points="0 0, 5 1.75, 0 3.5" fill="yellow" />
                    </marker>
                </defs>
                {arrows.map(arrow => (
                    <line key={arrow.id} x1={`${arrow.start.x}%`} y1={`${arrow.start.y}%`} x2={`${arrow.end.x}%`} y2={`${arrow.end.y}%`} stroke="yellow" strokeWidth="3" markerEnd="url(#arrowhead)" />
                ))}
                {currentArrow && (
                    <line x1={`${currentArrow.start.x}%`} y1={`${currentArrow.start.y}%`} x2={`${currentArrow.end.x}%`} y2={`${currentArrow.end.y}%`} stroke="yellow" strokeWidth="3" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
                )}
            </svg>
            {elements.map((el) => (
            <div
                key={el.id}
                onPointerDown={(e) => handlePointerDown(e, el.id)}
                className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-white shadow-lg ${isReadOnly ? 'cursor-not-allowed' : (activeTool === 'move' ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none')}`}
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
        {!isReadOnly && (
            <div className="absolute top-4 left-4 flex flex-col gap-2 rounded-lg bg-background/80 p-2 border">
                <Button variant={activeTool === 'move' ? 'secondary' : 'ghost'} size="icon" onClick={() => setActiveTool('move')} title="Mover Jugador">
                    <Move />
                </Button>
                <Button variant={activeTool === 'arrow' ? 'secondary' : 'ghost'} size="icon" onClick={() => setActiveTool('arrow')} title="Dibujar Flecha">
                    <ArrowUpRight />
                </Button>
                <Button variant="ghost" size="icon" onClick={undoLastArrow} title="Deshacer último dibujo" disabled={arrows.length === 0}>
                    <Undo2 />
                </Button>
                 <Button variant="ghost" size="icon" onClick={clearDrawings} title="Limpiar Dibujos">
                    <Eraser className="text-destructive" />
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
    </>
  );
}
