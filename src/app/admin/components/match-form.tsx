'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Match, User } from '@/lib/admin-types';


const teamSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
});

const formSchema = z.object({
  homeTeam: teamSchema,
  awayTeam: teamSchema,
  competition: z.string().min(3, 'La competición debe tener al menos 3 caracteres.'),
  date: z.date({ required_error: 'La fecha del partido es obligatoria.' }),
  assignedScoutId: z.string().optional(),
  isClosed: z.boolean().default(false),
});

type MatchFormValues = z.infer<typeof formSchema>;

interface MatchFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  match?: Match | null;
  onSave: (match: Omit<Match, 'id'>) => void;
  users: User[];
}

export default function MatchForm({
  isOpen,
  onOpenChange,
  match,
  onSave,
  users,
}: MatchFormProps) {

  const scouts = users.filter(u => u.role === 'scout');

  const defaultValues = {
    homeTeam: { name: '' },
    awayTeam: { name: '' },
    competition: '',
    date: new Date(),
    assignedScoutId: undefined,
    isClosed: false,
  };

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: match ? { ...match, date: new Date(match.date) } : defaultValues,
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(match ? { ...match, date: new Date(match.date) } : defaultValues);
    }
  }, [isOpen, match, form]);

  const onSubmit = (values: MatchFormValues) => {
    onSave({
        ...values,
        date: values.date.toISOString(),
        // These are just for the UI, a real implementation would use a proper image upload/selection
        homeTeam: { ...values.homeTeam, logoUrl: `https://picsum.photos/seed/${Math.random()}/100` },
        awayTeam: { ...values.awayTeam, logoUrl: `https://picsum.photos/seed/${Math.random()}/100` },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{match ? 'Editar Partido' : 'Añadir Nuevo Partido'}</DialogTitle>
          <DialogDescription>
            Introduce los detalles del partido y asigna un ojeador si lo deseas.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                 <FormField
                    control={form.control}
                    name="homeTeam.name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Equipo Local</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej., Real Sporting" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="awayTeam.name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Equipo Visitante</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej., Real Oviedo" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
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
             <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Fecha del Partido</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP", { locale: es })
                            ) : (
                                <span>Elige una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="assignedScoutId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asignar Ojeador</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un ojeador" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unassigned">Sin asignar</SelectItem>
                      {scouts.map(scout => (
                        <SelectItem key={scout.id} value={scout.id}>{scout.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <Button type="submit">Guardar Partido</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
