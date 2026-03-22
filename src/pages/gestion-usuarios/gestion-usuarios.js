import { BasicLayout } from '@/layouts/BasicLayout';
import {GestionUsuarios} from '@/components/UserManagement';

export default function ClientesPage() {
  return (
    <BasicLayout title="Gestión de Clientes - Sistema de Cobranza">
      <GestionUsuarios />
    </BasicLayout>
  );
}