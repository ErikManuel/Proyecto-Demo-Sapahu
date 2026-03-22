import { useState } from 'react';
import { DeudaSummary } from './DeudaSummary';
import { DistribucionColoniasChart } from './DistribucionColoniasChart';
import { EvolucionDeudaAreaChart } from './EvolucionDeudaAreaChart';
import { MetricasDeuda } from './MetricasDeuda';
import { useDeudasData } from './hooks/useDeudasData';
import styles from './DeudasDashboard.module.scss';

export function DeudasDashboard() {
  const [periodo, setPeriodo] = useState('mensual');
  const { dashboardData, loading, error } = useDeudasData(periodo); // ✅ Pasa el periodo al hook
  
  // Si tenemos datos del servidor, los usamos directamente
  // Si no, usamos los cálculos locales como fallback
  const calculos = dashboardData ? adaptServerDataToCalculos(dashboardData) : 
                  getCalculosFallback();

  if (loading) {
    return <div className={styles.loading}>Cargando dashboard para {periodo}...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.deudasDashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Deuda Global</h1>
          <p>Resumen general de adeudos pendientes - Período: {periodo}</p>
        </div>
        
        <div className={styles.periodSelector}>
          <select 
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className={styles.periodSelect}
          >
            <option value="mensual">Mensual</option>
            <option value="trimestral">Trimestral</option>
            <option value="anual">Anual</option>
          </select>
        </div>
      </div>

      {/* Métrica principal */}
      <DeudaSummary calculos={calculos} />

      <div className={styles.dashboardContent}>
        {/* Columna izquierda: Gráficas */}
        <div className={styles.chartsColumn}>
          <DistribucionColoniasChart 
            distribucionColonias={calculos.distribucionColonias}
          />
          <EvolucionDeudaAreaChart 
            historialDeuda={calculos.historialDeuda}
            periodo={periodo}
          />
        </div>

        {/* Columna derecha: Métricas */}
        <div className={styles.metricsColumn}>
          <MetricasDeuda 
            calculos={calculos} 
            periodo={periodo}
            historialDeuda={calculos.historialDeuda}
          />
        </div>
      </div>
    </div>
  );
}

// Función para adaptar los datos del servidor al formato que esperan los componentes
function adaptServerDataToCalculos(dashboardData) {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Asegurar que tenemos datos válidos
  const resumen = dashboardData.resumen || {};
  const distribucionColonias = dashboardData.distribucionColonias || [];
  const historialDeuda = dashboardData.historialDeuda || [];

  return {
    // Datos formateados para display
    deudaTotal: formatter.format(resumen.deudaTotal || 0),
    deudaTotalNum: resumen.deudaTotal || 0,
    contratosMorosos: resumen.contratosMorosos || 0,
    deudaReciente: formatter.format(resumen.deudaReciente || 0),
    deudaRecienteNum: resumen.deudaReciente || 0,
    deudaVencida: formatter.format(resumen.deudaVencida || 0),
    deudaVencidaNum: resumen.deudaVencida || 0,
    distribucionColonias: distribucionColonias,
    tasaRecuperacion: resumen.tasaRecuperacion || 0,
    deudaPromedio: formatter.format(resumen.deudaPromedio || 0),
    deudaMayor: formatter.format(resumen.deudaMayor || 0),
    deudaMayorNum: resumen.deudaMayor || 0,
    historialDeuda: historialDeuda
  };
}

// Fallback simple para cuando no hay datos
function getCalculosFallback() {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return {
    deudaTotal: formatter.format(0),
    deudaTotalNum: 0,
    contratosMorosos: 0,
    deudaReciente: formatter.format(0),
    deudaRecienteNum: 0,
    deudaVencida: formatter.format(0),
    deudaVencidaNum: 0,
    distribucionColonias: [],
    tasaRecuperacion: 0,
    deudaPromedio: formatter.format(0),
    deudaMayor: formatter.format(0),
    deudaMayorNum: 0,
    historialDeuda: []
  };
}