import { useMemo } from 'react';

export function useCalculosMetricas(datos, labels, periodo) {
  return useMemo(() => {
    if (!datos.length) return { 
      total: '$0 MXN', 
      diaMasAlto: 'N/A', 
      promedioDiario: '$0 MXN', 
      periodo: '',
      tituloMaximo: 'Día Más Alto'
    };

    const total = datos.reduce((sum, value) => sum + value, 0);
    const maxIndex = datos.indexOf(Math.max(...datos));
    const diaMasAlto = labels[maxIndex];
    
    const dias = periodo === 'semanal' ? 7 : periodo === 'mensual' ? 30 : 365;
    const promedioDiario = total / dias;

    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    const tituloMaximo = periodo === 'semanal' ? 'Día Más Alto' : 
                        periodo === 'mensual' ? 'Mes Más Alto' : 'Año Más Alto';

    return {
      total: formatter.format(total),
      diaMasAlto: diaMasAlto,
      promedioDiario: formatter.format(promedioDiario),
      periodo: periodo === 'semanal' ? 'Semanal' : periodo === 'mensual' ? 'Mensual' : 'Anual',
      tituloMaximo: tituloMaximo
    };
  }, [datos, labels, periodo]);
}