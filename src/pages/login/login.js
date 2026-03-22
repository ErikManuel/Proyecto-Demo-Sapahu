import { AuthLayout } from '@/layouts/JoinLayout/AuthLayout';
import { LoginForm } from '@/components/Auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout title="Iniciar Sesión - SAPAHU">
      <LoginForm />
    </AuthLayout>
  );
}