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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Player, User } from '@/lib/admin-types';

const formSchema = z.object({
  scoutId: z.string().min(1, 'Debes seleccionar un ojeador.'),
  notify: z.boolean().default(false),
});

type ReportRequestFormValues = z.infer<typeof formSchema>;

interface RequestReportFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  scouts: User[];
  onSave: (scoutId: string, notify: boolean) => void;
}

export default function RequestReportForm({
  isOpen,
  onOpenChange,
  player,
  scouts,
  onSave,
}: RequestReportFormProps) {
  const form = useForm<ReportRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scoutId: player?.assignedScoutId || '',
      notify: true,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        scoutId: player?.assignedScoutId || '',
        notify: true,
      });
    }
  }, [isOpen, player, form]);

  const onSubmit = (values: ReportRequestFormValues) => {
    onSave(values.scoutId, values.notify);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar Informe de Jugador</DialogTitle>
          <DialogDescription>
            {player ? `Asigna un ojeador para que realice un informe de ${player.firstName} ${player.lastName}.` : ''}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="scoutId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asignar a Ojeador</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un ojeador" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {scouts.map(scout => (
                        <SelectItem key={scout.id} value={scout.id}>{scout.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notify"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Notificar al ojeador por correo electrónico
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Solicitar Informe</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
