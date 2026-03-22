import { BasicLayout } from '@/layouts/BasicLayout';
import {ClientManagement} from '@/components/ClientManagement';

export default function ClientesPage() {
  return (
    <BasicLayout title="Gestión de Clientes - Sistema de Cobranza">
      <ClientManagement />
    </BasicLayout>
  );
}