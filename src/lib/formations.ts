import type { Formation, TacticalElement } from './types';
import { formations } from './types';

const homeColor = 'hsl(210, 80%, 55%)';
const awayColor = 'hsl(0, 80%, 55%)';

// Positions are defined as { x, y } percentages for the bottom half of the field
const formationPositions: Record<Formation, { x: number; y: number }[]> = {
  '4-4-2': [
    // Goalkeeper
    { x: 50, y: 95 },
    // Defenders
    { x: 20, y: 80 }, { x: 40, y: 82 }, { x: 60, y: 82 }, { x: 80, y: 80 },
    // Midfielders
    { x: 20, y: 60 }, { x: 40, y: 62 }, { x: 60, y: 62 }, { x: 80, y: 60 },
    // Forwards
    { x: 40, y: 45 }, { x: 60, y: 45 },
  ],
  '4-3-3': [
    // Goalkeeper
    { x: 50, y: 95 },
    // Defenders
    { x: 20, y: 80 }, { x: 40, y: 82 }, { x: 60, y: 82 }, { x: 80, y: 80 },
    // Midfielders
    { x: 30, y: 60 }, { x: 50, y: 65 }, { x: 70, y: 60 },
    // Forwards
    { x: 25, y: 45 }, { x: 50, y: 40 }, { x: 75, y: 45 },
  ],
  '3-5-2': [
    // Goalkeeper
    { x: 50, y: 95 },
    // Defenders
    { x: 30, y: 82 }, { x: 50, y: 85 }, { x: 70, y: 82 },
    // Midfielders
    { x: 15, y: 60 }, { x: 35, y: 65 }, { x: 50, y: 60 }, { x: 65, y: 65 }, { x: 85, y: 60 },
    // Forwards
    { x: 40, y: 45 }, { x: 60, y: 45 },
  ],
  '4-5-1': [
    // Goalkeeper
    { x: 50, y: 95 },
    // Defenders
    { x: 20, y: 80 }, { x: 40, y: 82 }, { x: 60, y: 82 }, { x: 80, y: 80 },
    // Midfielders
    { x: 15, y: 60 }, { x: 35, y: 65 }, { x: 50, y: 60 }, { x: 65, y: 65 }, { x: 85, y: 60 },
    // Forward
    { x: 50, y: 45 },
  ],
  '5-3-2': [
      // Goalkeeper
      { x: 50, y: 95 },
      // Defenders
      { x: 15, y: 80 }, { x: 35, y: 82 }, { x: 50, y: 85 }, { x: 65, y: 82 }, { x: 85, y: 80 },
      // Midfielders
      { x: 30, y: 60 }, { x: 50, y: 65 }, { x: 70, y: 60 },
      // Forwards
      { x: 40, y: 45 }, { x: 60, y: 45 },
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
        const x = team === 'home' ? pos.x : pos.x;

        return {
            id: `${prefix}${index + 1}`,
            label: `${prefix}${index + 1}`,
            position: { x, y },
            type: 'player',
            color,
        };
    });
}

export { formations };
