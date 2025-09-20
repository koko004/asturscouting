import AppHeader from '@/components/app-header';
import AppSidebar from '@/components/app-sidebar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AppHeader />
      <div className="flex-1">
        <div className="flex h-full">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
