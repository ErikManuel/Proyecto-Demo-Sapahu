import { BasicLayout } from '@/layouts/BasicLayout';
import {Contacto} from '@/components/Contacto';

export default function DeudasPage() {
  return (
    <BasicLayout title="Deuda Global - Sistema de Cobranza">
      <Contacto />
    </BasicLayout>
  );
}