// src/pages/buscar-cliente/buscar-cliente.js
import { BasicLayout } from '@/layouts/BasicLayout';
import { ClientSearch } from '@/components/ClientSearch';

export default function BuscarClientePage() {
  return (
    <BasicLayout title="Buscar Cliente - Sistema de Cobranza">
      <ClientSearch />
    </BasicLayout>
  );
}