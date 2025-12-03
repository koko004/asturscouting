'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  opponentTeam: z.string().min(2, 'El nombre del rival es obligatorio.'),
  competition: z.string().min(2, 'La competición es obligatoria.'),
  rating: z.number().min(1).max(10),
  notes: z.string().min(10, 'Las notas deben tener al menos 10 caracteres.'),
  isClosed: z.boolean().default(false),
});

type ReportFormValues = z.infer<typeof formSchema>;

interface PlayerReportFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (report: ReportFormValues) => void;
}

export default function PlayerReportForm({
  isOpen,
  onOpenChange,
  onSave,
}: PlayerReportFormProps) {
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opponentTeam: '',
      competition: '',
      rating: 5,
      notes: '',
      isClosed: false,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = (values: ReportFormValues) => {
    onSave(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Informe de Jugador</DialogTitle>
          <DialogDescription>
            Rellena los detalles del partido y tu evaluación del jugador.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="opponentTeam"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Equipo Rival</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej., Real Oviedo" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="competition"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Competición</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej., Segunda División" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valoración General: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={0.5}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Análisis del Rendimiento</FormLabel>
                  <FormControl>
                    <Textarea 
                        placeholder="Describe el rendimiento del jugador, sus acciones clave, fortalezas y debilidades observadas durante el partido..."
                        className="min-h-[150px]"
                        {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Guardar Informe</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
