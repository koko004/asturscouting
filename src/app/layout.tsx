import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/app-header';
import AppSidebar from '@/components/app-sidebar';
import Template from './template';

export const metadata: Metadata = {
  title: 'AsturScouting',
  description: 'A modern scouting application for soccer coaches.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <AppHeader />
          <div className="flex-1">
            <div className="flex h-full">
              <AppSidebar />
              <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
                <Template>{children}</Template>
              </main>
            </div>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
