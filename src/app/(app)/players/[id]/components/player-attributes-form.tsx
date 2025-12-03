'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Player, PlayerPosition, Recommendation } from '@/lib/admin-types';
import { playerPositions, recommendations } from '@/lib/admin-types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  attributes: z.object({
    technical: z.number().min(0).max(100),
    tactical: z.number().min(0).max(100),
    physical: z.number().min(0).max(100),
    attacking: z.number().min(0).max(100),
    defending: z.number().min(0).max(100),
    creativity: z.number().min(0).max(100),
  }),
  position: z.enum(playerPositions),
  recommendation: z.enum(recommendations),
});

type PlayerAttributesFormValues = z.infer<typeof formSchema>;

interface PlayerAttributesFormProps {
  player: Player;
  onSave: (data: Partial<Player>) => void;
}

export default function PlayerAttributesForm({ player, onSave }: PlayerAttributesFormProps) {
  const { toast } = useToast();
  
  const form = useForm<PlayerAttributesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attributes: player.attributes,
      position: player.position,
      recommendation: player.recommendation || 'Sin definir',
    },
  });

  const onSubmit = (values: PlayerAttributesFormValues) => {
    onSave(values);
    toast({
        title: 'Atributos Guardados',
        description: `Los atributos de ${player.firstName} ${player.lastName} han sido actualizados.`,
    })
  };

  const renderSlider = (name: keyof PlayerAttributesFormValues['attributes'], label: string) => (
    <FormField
        control={form.control}
        name={`attributes.${name}`}
        render={({ field }) => (
        <FormItem>
            <div className="flex justify-between items-center">
                <FormLabel>{label}</FormLabel>
                <span className="text-sm font-medium">{field.value}</span>
            </div>
            <FormControl>
            <Slider
                min={0}
                max={100}
                step={1}
                defaultValue={[field.value]}
                onValueChange={(value) => field.onChange(value[0])}
            />
            </FormControl>
        </FormItem>
        )}
    />
  );


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Valoración de Habilidades</CardTitle>
                    <CardDescription>Valora los atributos clave del 1 al 100.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {renderSlider('technical', 'Aptitud Técnica')}
                    {renderSlider('tactical', 'Aptitud Táctica')}
                    {renderSlider('physical', 'Capacidad Física')}
                    {renderSlider('attacking', 'Ataque')}
                    {renderSlider('defending', 'Defensa')}
                    {renderSlider('creativity', 'Creatividad')}
                </CardContent>
            </Card>

             <div className="space-y-6 lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Posición y Recomendación</CardTitle>
                        <CardDescription>Define la posición principal y la recomendación final.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Posición Principal</FormLabel>
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
                            name="recommendation"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Recomendación Final</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                    {recommendations.map(rec => (
                                        <FormItem key={rec} className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value={rec} />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {rec}
                                            </FormLabel>
                                        </FormItem>
                                    ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="flex justify-end">
            <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Guardar Atributos
            </Button>
        </div>
      </form>
    </Form>
  );
}
