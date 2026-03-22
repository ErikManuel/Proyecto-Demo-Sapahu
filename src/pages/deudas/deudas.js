import { BasicLayout } from '@/layouts/BasicLayout';
import {DeudasDashboard} from '@/components/DeudasDashboard';

export default function DeudasPage() {
  return (
    <BasicLayout title="Deuda Global - Sistema de Cobranza">
      <DeudasDashboard />
    </BasicLayout>
  );
}