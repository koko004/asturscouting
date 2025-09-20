import Link from 'next/link';
import Image from 'next/image';
import { matches } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import PageHeader from '@/components/page-header';

export default function MatchesPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Assigned Matches"
        description="Review your assigned matches for the upcoming weekend."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <Card key={match.id} className="flex flex-col transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-base font-medium text-muted-foreground">
                {match.competition}
              </CardTitle>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <Image
                    src={match.homeTeam.logoUrl}
                    alt={`${match.homeTeam.name} logo`}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                    data-ai-hint="team logo"
                  />
                  <span className="text-xl font-bold">{match.homeTeam.name}</span>
                </div>
                <span className="text-xl font-bold">vs</span>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold">{match.awayTeam.name}</span>
                  <Image
                    src={match.awayTeam.logoUrl}
                    alt={`${match.awayTeam.name} logo`}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                    data-ai-hint="team logo"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-end">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{new Date(match.date).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/matches/${match.id}`}>
                    Start Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
