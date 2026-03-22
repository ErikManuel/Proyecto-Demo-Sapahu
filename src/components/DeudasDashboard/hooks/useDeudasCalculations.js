import { useMemo } from 'react';

export function useDeudasCalculations(deudas) {
  return useMemo(() => {
    if (!deudas.length) {
      return {
        deudaTotal: 0,
        contratosMorosos: 0,
        deudaReciente: 0,
        deudaVencida: 0,
        distribucionColonias: [],
        tasaRecuperacion: 0,
        deudaPromedio: 0,
        deudaMayor: 0,
        historialDeuda: []
      };
    }

    // Cálculos básicos
    const deudaTotal = deudas.reduce((sum, deuda) => sum + deuda.deuda, 0);
    const contratosMorosos = deudas.length;
    
    const deudaReciente = deudas
      .filter(deuda => deuda.diasVencido <= 30)
      .reduce((sum, deuda) => sum + deuda.deuda, 0);
      
    const deudaVencida = deudas
      .filter(deuda => deuda.diasVencido > 30)
      .reduce((sum, deuda) => sum + deuda.deuda, 0);

    // Distribución por colonia
    const coloniasMap = {};
    deudas.forEach(deuda => {
      if (!coloniasMap[deuda.colonia]) {
        coloniasMap[deuda.colonia] = { deudores: 0, deudaTotal: 0 };
      }
      coloniasMap[deuda.colonia].deudores++;
      coloniasMap[deuda.colonia].deudaTotal += deuda.deuda;
    });

    const distribucionColonias = Object.entries(coloniasMap)
      .map(([colonia, data]) => ({
        colonia,
        deudores: data.deudores,
        deudaTotal: data.deudaTotal
      }))
      .sort((a, b) => b.deudaTotal - a.deudaTotal);

    // Top 5 colonias + "Otras"
    const topColonias = distribucionColonias.slice(0, 5);
    const otrasColonias = distribucionColonias.slice(5);
    
    const otrasDeuda = otrasColonias.reduce((sum, colonia) => sum + colonia.deudaTotal, 0);
    const otrasDeudores = otrasColonias.reduce((sum, colonia) => sum + colonia.deudores, 0);
    
    const distribucionFinal = [
      ...topColonias,
      ...(otrasDeudores > 0 ? [{ colonia: 'Otras', deudores: otrasDeudores, deudaTotal: otrasDeuda }] : [])
    ];

    // Métricas adicionales
    const deudaPromedio = deudaTotal / contratosMorosos;
    const deudaMayor = Math.max(...deudas.map(deuda => deuda.deuda));
    
    // Tasa de recuperación simulada (72% como en el ejemplo)
    // En producción esto vendría de datos históricos reales
    const tasaRecuperacion = 72;

    // Historial de deuda mock (para gráfica de evolución)
    const historialDeuda = [
      { mes: 'Ene', deuda: 420000 },
      { mes: 'Feb', deuda: 450000 },
      { mes: 'Mar', deuda: 470000 },
      { mes: 'Abr', deuda: 460000 },
      { mes: 'May', deuda: 480000 },
      { mes: 'Jun', deuda: 487650 }
    ];

    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return {
      deudaTotal: formatter.format(deudaTotal),
      deudaTotalNum: deudaTotal,
      contratosMorosos,
      deudaReciente: formatter.format(deudaReciente),
      deudaRecienteNum: deudaReciente,
      deudaVencida: formatter.format(deudaVencida),
      deudaVencidaNum: deudaVencida,
      distribucionColonias: distribucionFinal,
      tasaRecuperacion,
      deudaPromedio: formatter.format(deudaPromedio),
      deudaMayor: formatter.format(deudaMayor),
      deudaMayorNum: deudaMayor,
      historialDeuda
    };
  }, [deudas]);
}