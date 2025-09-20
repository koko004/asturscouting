'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Player, PlayerPosition } from '@/lib/types';
import { playerPositions } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  jerseyNumber: z.coerce.number().int().min(1, 'El dorsal debe ser al menos 1.'),
  age: z.coerce.number().int().min(14, 'La edad debe ser al menos 14.'),
  position: z.enum(playerPositions),
  rating: z.number().min(1).max(10),
  notes: z.string().optional(),
});

type PlayerFormValues = z.infer<typeof formSchema>;

interface PlayerFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  player?: Player | null;
  onSave: (player: Player) => void;
  isReadOnly?: boolean;
}

export default function PlayerForm({
  isOpen,
  onOpenChange,
  player,
  onSave,
  isReadOnly = false,
}: PlayerFormProps) {
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: player
      ? { ...player, rating: player.rating || 5 }
      : {
          name: '',
          jerseyNumber: '' as unknown as number, // Prevent uncontrolled to controlled error
          age: '' as unknown as number, // Prevent uncontrolled to controlled error
          position: 'Centrocampista (CEN)',
          rating: 5,
          notes: '',
        },
  });

  const onSubmit = (values: PlayerFormValues) => {
    onSave({
      id: player?.id || `p${Date.now()}`,
      ...values,
    });
    onOpenChange(false);
    form.reset();
  };
  
  // We need to re-initialize the form when the player prop changes.
  React.useEffect(() => {
    if (isOpen) {
      form.reset(
        player
          ? { ...player, rating: player.rating || 5, notes: player.notes || '' }
          : {
              name: '',
              jerseyNumber: '' as unknown as number,
              age: '' as unknown as number,
              position: 'Centrocampista (CEN)',
              rating: 5,
              notes: '',
            }
      );
    }
  }, [isOpen, player, form]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{player?.name ? `Editar Jugador: ${player.name}` : 'Añadir Nuevo Jugador'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <fieldset disabled={isReadOnly} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Jugador</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej., Lionel Messi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="jerseyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dorsal</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edad</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="24" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posición</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una posición" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {playerPositions.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valoración: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
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
                    <FormLabel>Notas del Jugador</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Fortalezas, debilidades, etc." {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {isReadOnly ? 'Cerrar' : 'Cancelar'}
                </Button>
              </DialogClose>
              {!isReadOnly && <Button type="submit">Guardar Jugador</Button>}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
