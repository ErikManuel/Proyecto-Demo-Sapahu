import { useMemo } from 'react';

export function useClientMetrics(clients) {
  return useMemo(() => {
    const total = clients.length;
    const activos = clients.filter(client => client.estado === 'Activo').length;
    const suspendidos = clients.filter(client => client.estado === 'Suspendido').length;
    const conDeuda = clients.filter(client => client.deuda > 0).length;
    const conUbicacion = clients.filter(client => client.coordenadas).length;
    
    // Calcular deuda total
    const deudaTotal = clients.reduce((total, client) => total + (client.deuda || 0), 0);
    
    // Estadísticas por tipo de tarifa
    const tarifas = clients.reduce((acc, client) => {
      const tarifa = client.tipoTarifa || 'Sin especificar';
      acc[tarifa] = (acc[tarifa] || 0) + 1;
      return acc;
    }, {});

    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return {
      total: total.toString(),
      activos: activos.toString(),
      suspendidos: suspendidos.toString(),
      conDeuda: conDeuda.toString(),
      conUbicacion: conUbicacion.toString(),
      sinUbicacion: (total - conUbicacion).toString(),
      deudaTotal: formatter.format(deudaTotal),
      tarifas
    };
  }, [clients]);
}