'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { User } from '@/lib/admin-types';
import { users as initialUsers } from '@/lib/admin-data';
import UserTable from './user-table';
import UserForm from './user-form';

export default function UserManagementTab() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isUserFormOpen, setUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSaveUser = (userData: Omit<User, 'id'>) => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...userData, id: u.id } : u));
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: `u${Date.now()}`,
        avatarUrl: `https://picsum.photos/seed/${Math.random()}/100/100`,
      };
      setUsers([...users, newUser]);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserFormOpen(true);
  };
  
  const handleAddNewUser = () => {
    setSelectedUser(null);
    setUserFormOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Usuarios</CardTitle>
              <CardDescription>Gestiona los ojeadores y administradores del sistema.</CardDescription>
            </div>
            <Button onClick={handleAddNewUser}>
              <PlusCircle />
              Añadir Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <UserTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
        </CardContent>
      </Card>
      <UserForm
        isOpen={isUserFormOpen}
        onOpenChange={setUserFormOpen}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </>
  );
}
