
'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast }s/use-toast';
import { Upload, Save } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = () => {
    setIsSaving(true);
    // Simulate saving data
    setTimeout(() => {
      toast({
        title: 'Ajustes Guardados',
        description: 'Tu información de perfil ha sido actualizada.',
      });
      setIsSaving(false);
    }, 1500);
  };
  
  const handlePasswordChange = () => {
    setIsSaving(true);
    // Simulate saving data
    setTimeout(() => {
      toast({
        title: 'Contraseña Actualizada',
        description: 'Tu contraseña ha sido cambiada con éxito.',
      });
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Ajustes de Perfil"
        description="Gestiona la información de tu cuenta y tus preferencias."
      />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>
              Actualiza tu foto de perfil. Se recomienda una imagen cuadrada.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="User Avatar" data-ai-hint="person face" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Nueva Foto
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Correo Electrónico</CardTitle>
            <CardDescription>
              Este es el correo para notificaciones y recuperación de cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" defaultValue="scout@asturscouting.com" />
            </div>
            <Button onClick={handleSaveChanges} disabled={isSaving} className="w-fit">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Guardando...' : 'Guardar Correo'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cambiar Contraseña</CardTitle>
            <CardDescription>
              Para mayor seguridad, elige una contraseña fuerte.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input id="new-password" type="password" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                <Input id="confirm-password" type="password" />
            </div>
             <Button onClick={handlePasswordChange} disabled={isSaving} className="w-fit">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Guardando...' : 'Cambiar Contraseña'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
