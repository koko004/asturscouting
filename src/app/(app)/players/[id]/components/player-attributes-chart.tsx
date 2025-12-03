'use client';
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Player } from "@/lib/admin-types";


interface PlayerAttributesChartProps {
    attributes: Player['attributes'];
}

export default function PlayerAttributesChart({ attributes }: PlayerAttributesChartProps) {
    
    const chartData = [
        { attribute: "Ataque", value: attributes.attacking, fullMark: 100 },
        { attribute: "Técnica", value: attributes.technical, fullMark: 100 },
        { attribute: "Táctica", value: attributes.tactical, fullMark: 100 },
        { attribute: "Defensa", value: attributes.defending, fullMark: 100 },
        { attribute: "Creatividad", value: attributes.creativity, fullMark: 100 },
    ];
    
    const chartConfig = {
      value: {
        label: "Value",
        color: "hsl(var(--primary))",
      },
    } satisfies Parameters<typeof ChartContainer>[0]["config"]

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Resumen de Atributos</CardTitle>
                <CardDescription>
                    Visualización de las habilidades clave del jugador.
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-0 flex justify-center items-center">
                 <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[250px]"
                    >
                    <RadarChart data={chartData}>
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                        />
                        <PolarAngleAxis dataKey="attribute" />
                        <PolarGrid />
                        <Radar
                        dataKey="value"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                        stroke="hsl(var(--primary))"
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
