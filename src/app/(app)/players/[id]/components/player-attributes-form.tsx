'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  attributes: z.object({
    technical: z.number().min(0).max(100),
    tactical: z.number().min(0).max(100),
    physical: z.number().min(0).max(100),
    attacking: z.number().min(0).max(100),
    defending: z.number().min(0).max(100),
    creativity: z.number().min(0).max(100),
  }),
  psychology: z.object({
    leadership: z.number().min(0).max(100),
    teamwork: z.number().min(0).max(100),
    aggression: z.number().min(0).max(100),
    determination: z.number().min(0).max(100),
  }),
  position: z.enum(playerPositions),
  secondaryPosition: z.enum(playerPositions).optional(),
  recommendation: z.enum(recommendations),
  strengths: z.array(z.object({ value: z.string().min(1, 'No puede estar vacío') })).optional(),
  weaknesses: z.array(z.object({ value: z.string().min(1, 'No puede estar vacío') })).optional(),
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
      psychology: player.psychology || { leadership: 50, teamwork: 50, aggression: 50, determination: 50 },
      position: player.position,
      secondaryPosition: player.secondaryPosition,
      recommendation: player.recommendation || 'Sin definir',
      strengths: player.strengths?.map(s => ({ value: s })) || [],
      weaknesses: player.weaknesses?.map(w => ({ value: w })) || [],
    },
  });

  const { fields: strengthsFields, append: appendStrength, remove: removeStrength } = useFieldArray({ control: form.control, name: "strengths" });
  const { fields: weaknessesFields, append: appendWeakness, remove: removeWeakness } = useFieldArray({ control: form.control, name: "weaknesses" });


  const onSubmit = (values: PlayerAttributesFormValues) => {
    const saveData = {
        ...values,
        strengths: values.strengths?.map(s => s.value),
        weaknesses: values.weaknesses?.map(w => w.value),
    }
    onSave(saveData);
    toast({
        title: 'Atributos Guardados',
        description: `Los atributos de ${player.firstName} ${player.lastName} han sido actualizados.`,
    })
  };

  const renderSlider = (name: keyof PlayerAttributesFormValues['attributes'] | `psychology.${keyof NonNullable<PlayerAttributesFormValues['psychology']>}`, label: string) => (
    <FormField
        control={form.control}
        name={name}
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
                defaultValue={[field.value as number]}
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
                    {renderSlider('attributes.technical', 'Aptitud Técnica')}
                    {renderSlider('attributes.tactical', 'Aptitud Táctica')}
                    {renderSlider('attributes.physical', 'Capacidad Física')}
                    {renderSlider('attributes.attacking', 'Ataque')}
                    {renderSlider('attributes.defending', 'Defensa')}
                    {renderSlider('attributes.creativity', 'Creatividad')}
                </CardContent>
            </Card>

            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Posiciones y Análisis</CardTitle>
                    <CardDescription>Define las posiciones y rasgos clave del jugador.</CardDescription>
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
                        name="secondaryPosition"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Posición Secundaria</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una posición secundaria" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="none">Ninguna</SelectItem>
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
                </CardContent>
            </Card>
             <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Personalidad y Psicología</CardTitle>
                    <CardDescription>Valora los atributos mentales y de actitud.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {renderSlider('psychology.leadership', 'Liderazgo')}
                    {renderSlider('psychology.teamwork', 'Trabajo en Equipo')}
                    {renderSlider('psychology.aggression', 'Agresividad')}
                    {renderSlider('psychology.determination', 'Determinación')}
                </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Recomendación Final</CardTitle>
                    <CardDescription>Veredicto del ojeador.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FormField
                        control={form.control}
                        name="recommendation"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>Recomendación</FormLabel>
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
