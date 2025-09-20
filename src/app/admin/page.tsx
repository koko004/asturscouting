import PageHeader from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MatchManagementTab from './components/match-management-tab';
import UserManagementTab from './components/user-management-tab';

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Panel de Administrador"
        description="Gestiona partidos, usuarios y asignaciones de la aplicación."
      />
      <Tabs defaultValue="matches">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="matches">Gestionar Partidos</TabsTrigger>
          <TabsTrigger value="users">Gestionar Usuarios</TabsTrigger>
        </TabsList>
        <TabsContent value="matches" className="mt-6">
          <MatchManagementTab />
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <UserManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
