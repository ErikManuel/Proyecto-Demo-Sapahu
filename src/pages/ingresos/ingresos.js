import { BasicLayout } from '@/layouts/BasicLayout';
import {IncomeReports} from '@/components/IncomeReports';

export default function IngresosPage() {
  return (
    <BasicLayout title="Ingresos - Sistema de Cobranza">
      <IncomeReports />
    </BasicLayout>
  );
}