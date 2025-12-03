
'use client';

import type { Player } from '@/lib/admin-types';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface PlayerInfoCardProps {
  player: Player;
}

const InfoItem = ({ label, value, children }: { label: string; value?: string | number; children?: React.ReactNode }) => (
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground">{label}</span>
    {children || <span className="font-semibold">{value}</span>}
  </div>
);

export default function PlayerInfoCard({ player }: PlayerInfoCardProps) {
  const getFlagEmoji = (country: string) => {
    // This is a simple placeholder. A real implementation would use a library or a service.
    const flags: { [key: string]: string } = {
        'España': '🇪🇸',
        'Inglaterra': '🇬🇧',
        'Serbia': '🇷🇸',
        'Francia': '🇫🇷',
        'Portugal': '🇵🇹',
    };
    return flags[country] || '🏳️';
  }

  return (
    <div className="mt-4 flex flex-col gap-4 text-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             <InfoItem label="Nacionalidad">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{getFlagEmoji(player.nationality)}</span>
                    <span className="font-semibold">{player.nationality}</span>
                </div>
            </InfoItem>
            <InfoItem label="Edad" value={`${player.age} años`} />
            <InfoItem label="Posición" value={player.position} />
            <InfoItem label="Club">
                 <div className="flex items-center gap-2">
                    <Image
                        src={player.teamLogoUrl || 'https://picsum.photos/seed/team-generic/40'}
                        alt={`${player.teamName} logo`}
                        width={20}
                        height={20}
                        className="h-5 w-5 rounded-full object-cover"
                        data-ai-hint="team logo"
                    />
                    <span className="font-semibold">{player.teamName}</span>
                </div>
            </InfoItem>
        </div>
    </div>
  );
}
