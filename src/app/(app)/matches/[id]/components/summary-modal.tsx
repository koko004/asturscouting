'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Wand2 } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  summary: string;
}

export default function SummaryModal({
  isOpen,
  setIsOpen,
  summary,
}: SummaryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Resumen Táctico
          </DialogTitle>
          <DialogDescription>
            Análisis de la configuración táctica actual en el campo, generado por IA.
          </DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm max-w-none rounded-md border bg-accent/50 p-4 text-accent-foreground">
            <p>{summary}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
