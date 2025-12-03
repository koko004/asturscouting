'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Player } from '@/lib/admin-types';
import { playerPositions } from '@/lib/admin-types';
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

const formSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres.'),
  nationality: z.string().min(2, 'La nacionalidad debe tener al menos 2 caracteres.'),
  age: z.coerce.number().int().min(14, 'La edad debe ser al menos 14.'),
  teamName: z.string().min(2, 'El nombre del club es obligatorio.'),
  position: z.enum(playerPositions),
  jerseyNumber: z.coerce.number().int().min(1, 'El dorsal debe ser al menos 1.'),
  height: z.coerce.number().int().min(100, 'La altura no es válida.'),
  weight: z.coerce.number().int().min(40, 'El peso no es válido.'),
  preferredFoot: z.enum(['Left', 'Right', 'Both']),
});

type PlayerFormValues = z.infer<typeof formSchema>;

interface PlayerFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  player?: Player | null;
  onSave: (player: Omit<Player, 'id' | 'attributes' | 'teamLogoUrl'>) => void;
}

export default function PlayerForm({
  isOpen,
  onOpenChange,
  player,
  onSave,
}: PlayerFormProps) {
  
  const defaultValues = {
    firstName: '',
    lastName: '',
    nationality: '',
    age: 18,
    teamName: '',
    position: 'Centrocampista (CEN)' as const,
    jerseyNumber: 1,
    height: 180,
    weight: 75,
    preferredFoot: 'Right' as const,
  };

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: player ? player : defaultValues,
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(player ? player : defaultValues);
    }
  }, [isOpen, player, form]);

  const onSubmit = (values: PlayerFormValues) => {
    onSave(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{player ? 'Editar Jugador' : 'Añadir Nuevo Jugador'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem><FormLabel>Apellidos</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="nationality" render={({ field }) => (
                <FormItem><FormLabel>Nacionalidad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="age" render={({ field }) => (
                  <FormItem><FormLabel>Edad</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="height" render={({ field }) => (
                  <FormItem><FormLabel>Altura (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="weight" render={({ field }) => (
                  <FormItem><FormLabel>Peso (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="teamName" render={({ field }) => (
                    <FormItem><FormLabel>Club Actual</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="jerseyNumber" render={({ field }) => (
                    <FormItem><FormLabel>Dorsal</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="position" render={({ field }) => (
                    <FormItem><FormLabel>Posición Principal</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{playerPositions.map(pos => <SelectItem key={pos} value={pos}>{pos}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="preferredFoot" render={({ field }) => (
                    <FormItem><FormLabel>Pie Preferido</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Left">Izquierdo</SelectItem><SelectItem value="Right">Derecho</SelectItem><SelectItem value="Both">Ambos</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
