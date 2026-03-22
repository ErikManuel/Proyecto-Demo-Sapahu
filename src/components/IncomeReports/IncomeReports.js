import { useState } from 'react';
import { PeriodSelector, GraficaIngresos, AdditionalControls, BottomMetrics } from '.';
import { useDatosIngresos } from './hooks/useDatosIngresos';
import { useCalculosMetricas } from './hooks/useCalculosMetricas';
import styles from './IncomeReports.module.scss';

export function IncomeReports() {
  const [periodo, setPeriodo] = useState('semanal');
  const [rangoPersonalizado, setRangoPersonalizado] = useState(null);
  
  // Modificar el hook para aceptar rango personalizado
  const { datos, labels } = useDatosIngresos(periodo, rangoPersonalizado);
  const metricas = useCalculosMetricas(datos, labels, periodo);

   const handleDownloadReport = async () => {
    try {
      console.log('📥 Iniciando descarga de reporte...');
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Error: No hay token de autenticación');
        return;
      }

      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ingresos/descargar`;
      const params = new URLSearchParams();

      params.append('periodo', periodo);
      
      // Si es rango personalizado, agregar las fechas
      if (periodo === 'personalizado' && rangoPersonalizado) {
        params.append('desde', rangoPersonalizado.desde);
        params.append('hasta', rangoPersonalizado.hasta);
      }

      const queryString = params.toString();
      const finalUrl = `${url}?${queryString}`;

      console.log('🔗 Descargando desde:', finalUrl);

      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Obtener el nombre del archivo del header o generar uno
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `reporte_ingresos_${periodo}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      console.log('✅ Reporte descargado exitosamente');

    } catch (error) {
      console.error('❌ Error descargando reporte:', error);
      alert(`Error al descargar el reporte: ${error.message}`);
    }
  };

  const handleDateRangeChange = (startDate, endDate) => {
    console.log('Rango de fechas aplicado:', startDate, endDate);
    
    // Cambiar a modo personalizado y pasar el rango
    setPeriodo('personalizado');
    setRangoPersonalizado({
      desde: startDate,
      hasta: endDate
    });
  };

  const handlePeriodChange = (nuevoPeriodo) => {
    setPeriodo(nuevoPeriodo);
    setRangoPersonalizado(null); // Limpiar rango personalizado
  };

  return (
    <div className={styles.incomeReports}>
      <div className={styles.reportsHeader}>
        <div className={styles.headerTop}>
          <div className={styles.titleSection}>
            <h1>Reportes de Ingresos</h1>
            <p>Análisis de Ingresos por período</p>
          </div>
          
          <div className={styles.headerMain}>
            <PeriodSelector periodo={periodo} onPeriodChange={handlePeriodChange} />
          </div>
        </div>
        <div className={styles.headerBottom}>
          <AdditionalControls 
            onDownload={handleDownloadReport}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
      </div>
      <div className={styles.reportsContent}>
        <div className={styles.chartSection}>
          <GraficaIngresos 
            datos={datos} 
            labels={labels} 
            periodo={periodo}
          />
        </div>
      </div>
      <BottomMetrics metricas={metricas} />
    </div>
  );
}