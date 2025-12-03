
'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Player } from '@/lib/admin-types';
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
import { PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres.'),
  nationality: z.string().min(2, 'La nacionalidad debe tener al menos 2 caracteres.'),
  age: z.coerce.number().int().min(14, 'La edad debe ser al menos 14.'),
  teamName: z.string().min(2, 'El nombre del equipo es obligatorio.'),
  position: z.enum(playerPositions),
  jerseyNumber: z.coerce.number().int().min(1, 'El dorsal debe ser al menos 1.'),
  height: z.coerce.number().int().min(100, 'La altura no es válida.'),
  weight: z.coerce.number().int().min(40, 'El peso no es válido.'),
  preferredFoot: z.enum(['Left', 'Right', 'Both']),
  strengths: z.array(z.object({ value: z.string().min(1, 'No puede estar vacío') })).optional(),
  weaknesses: z.array(z.object({ value: z.string().min(1, 'No puede estar vacío') })).optional(),
});

type PlayerFormValues = z.infer<typeof formSchema>;

interface PlayerProfileFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  player?: Player | null;
  onSave: (player: Player) => void;
}

export default function PlayerProfileForm({
  isOpen,
  onOpenChange,
  player,
  onSave,
}: PlayerProfileFormProps) {
  
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: player ? { 
      ...player,
      strengths: player.strengths?.map(s => ({ value: s })) || [],
      weaknesses: player.weaknesses?.map(w => ({ value: w })) || [],
    } : undefined,
  });

  const { fields: strengthsFields, append: appendStrength, remove: removeStrength } = useFieldArray({ control: form.control, name: "strengths" });
  const { fields: weaknessesFields, append: appendWeakness, remove: removeWeakness } = useFieldArray({ control: form.control, name: "weaknesses" });


  React.useEffect(() => {
    if (isOpen && player) {
      form.reset({ 
        ...player,
        strengths: player.strengths?.map(s => ({ value: s })) || [],
        weaknesses: player.weaknesses?.map(w => ({ value: w })) || [],
      });
    }
  }, [isOpen, player, form]);

  const onSubmit = (values: PlayerFormValues) => {
    if (player) {
      onSave({
        ...player,
        ...values,
        strengths: values.strengths?.map(s => s.value),
        weaknesses: values.weaknesses?.map(w => w.value),
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Perfil de Jugador</DialogTitle>
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
                    <FormItem><FormLabel>Equipo Actual</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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

            <Separator />
            
            <div>
              <FormLabel>Fortalezas</FormLabel>
              <div className="mt-2 space-y-2">
                {strengthsFields.map((field, index) => (
                  <FormField key={field.id} control={form.control} name={`strengths.${index}.value`} render={({ field }) => (
                    <FormItem className="flex items-center gap-2"><FormControl><Input {...field} placeholder={`Fortaleza ${index + 1}`} /></FormControl><Button type="button" variant="ghost" size="icon" onClick={() => removeStrength(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button><FormMessage /></FormItem>
                  )}/>
                ))}
              </div>
              <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => appendStrength({ value: "" })}><PlusCircle className="mr-2 h-4 w-4" /> Añadir Fortaleza</Button>
            </div>
            
            <div>
              <FormLabel>Debilidades</FormLabel>
              <div className="mt-2 space-y-2">
                {weaknessesFields.map((field, index) => (
                  <FormField key={field.id} control={form.control} name={`weaknesses.${index}.value`} render={({ field }) => (
                    <FormItem className="flex items-center gap-2"><FormControl><Input {...field} placeholder={`Debilidad ${index + 1}`} /></FormControl><Button type="button" variant="ghost" size="icon" onClick={() => removeWeakness(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button><FormMessage /></FormItem>
                  )}/>
                ))}
              </div>
              <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => appendWeakness({ value: "" })}><PlusCircle className="mr-2 h-4 w-4" /> Añadir Debilidad</Button>
            </div>


            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
