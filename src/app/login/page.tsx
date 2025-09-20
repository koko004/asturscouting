import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <Logo className="h-16 w-16" />
            </div>
          <CardTitle className="text-2xl">Bienvenido a AsturScouting</CardTitle>
          <CardDescription>Introduce tus credenciales para acceder a tu panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" placeholder="entrenador@ejemplo.com" required />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                        ¿Has olvidado tu contraseña?
                    </Link>
                </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" asChild className="w-full">
              <Link href="/">Iniciar Sesión</Link>
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{' '}
            <Link href="#" className="underline">
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
