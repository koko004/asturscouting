import type { Formation, TacticalElement } from './types';

const homeColor = 'hsl(210, 80%, 55%)';
const awayColor = 'hsl(0, 80%, 55%)';

// Positions are defined as { x, y } percentages for the bottom half of the field
const formationPositions: Record<Formation, { x: number; y: number }[]> = {
  '4-4-2': [
    // Goalkeeper
    { x: 50, y: 95 },
    // Defenders
    { x: 15, y: 85 }, { x: 35, y: 88 }, { x: 65, y: 88 }, { x: 85, y: 85 },
    // Midfielders
    { x: 15, y: 65 }, { x: 35, y: 68 }, { x: 65, y: 68 }, { x: 85, y: 65 },
    // Forwards
    { x: 40, y: 55 }, { x: 60, y: 55 },
  ],
  '4-3-3': [
    // Goalkeeper
    { x: 50, y: 95 },
    // Defenders
    { x: 15, y: 85 }, { x: 35, y: 88 }, { x: 65, y: 88 }, { x: 85, y: 85 },
    // Midfielders
    { x: 25, y: 70 }, { x: 50, y: 72 }, { x: 75, y: 70 },
    // Forwards
    { x: 20, y: 55 }, { x: 50, y: 52 }, { x: 80, y: 55 },
  ],
  '3-5-2': [
    // Goalkeeper
    { x: 50, y: 95 },
    // Defenders
    { x: 25, y: 88 }, { x: 50, y: 90 }, { x: 75, y: 88 },
    // Midfielders
    { x: 10, y: 65 }, { x: 30, y: 70 }, { x: 50, y: 68 }, { x: 70, y: 70 }, { x: 90, y: 65 },
    // Forwards
    { x: 40, y: 55 }, { x: 60, y: 55 },
  ],
  '4-5-1': [
    // Goalkeeper
    { x: 50, y: 95 },
    // Defenders
    { x: 15, y: 85 }, { x: 35, y: 88 }, { x: 65, y: 88 }, { x: 85, y: 85 },
    // Midfielders
    { x: 10, y: 65 }, { x: 30, y: 70 }, { x: 50, y: 68 }, { x: 70, y: 70 }, { x: 90, y: 65 },
    // Forward
    { x: 50, y: 55 },
  ],
  '5-3-2': [
      // Goalkeeper
      { x: 50, y: 95 },
      // Defenders
      { x: 10, y: 85 }, { x: 30, y: 88 }, { x: 50, y: 90 }, { x: 70, y: 88 }, { x: 90, y: 85 },
      // Midfielders
      { x: 25, y: 70 }, { x: 50, y: 72 }, { x: 75, y: 70 },
      // Forwards
      { x: 40, y: 55 }, { x: 60, y: 55 },
  ]
};

export function getPlayerPositions(formation: Formation, team: 'home' | 'away'): TacticalElement[] {
    const positions = formationPositions[formation];
    const color = team === 'home' ? homeColor : awayColor;
    const prefix = team === 'home' ? 'H' : 'A';

    return positions.map((pos, index) => {
        // Home team is on the bottom half, away team is on the top half
        const y = team === 'home' ? pos.y : 100 - pos.y;
        // For the away team, we reflect the x position as well
        const x = team === 'home' ? pos.x : 100 - pos.x;

        return {
            id: `${prefix}${index + 1}`,
            label: `${prefix}${index + 1}`,
            position: { x, y },
            type: 'player',
            color,
        };
    });
}
