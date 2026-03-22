import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faDatabase, faClock } from '@fortawesome/free-solid-svg-icons';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function EvolucionDeudaAreaChart({ historialDeuda, periodo = 'mensual' }) { // ✅ periodo como prop con valor por defecto
  // Asegurar que historialDeuda sea un array
  if (!historialDeuda || !Array.isArray(historialDeuda)) {
    historialDeuda = [];
  }

  // Contar datos reales vs simulados
  const datosReales = historialDeuda.filter(item => item && item.real).length;
  const totalMeses = historialDeuda.length;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Evolución de Deuda - ${periodo.charAt(0).toUpperCase() + periodo.slice(1)}`, // ✅ periodo definido
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const item = historialDeuda[context.dataIndex];
            if (!item) return 'Sin datos';
            
            const esReal = item.real ? ' (Real)' : ' (Sin datos)';
            return `Deuda: $${context.parsed.y.toLocaleString('es-MX')} MXN${esReal}`;
          },
          afterLabel: function(context) {
            const item = historialDeuda[context.dataIndex];
            if (!item) return '';
            return item.real ? '📊 Dato real del sistema' : '⏳ Período sin registro';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `$${(value / 1000).toFixed(0)}K`;
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        title: {
          display: true,
          text: 'Monto de Deuda (MXN)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: true,
          text: 'Meses'
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        hoverRadius: 8,
        radius: function(context) {
          const index = context.dataIndex;
          const item = historialDeuda[index];
          return item && item.real ? 6 : 3;
        }
      }
    }
  };

  const data = {
    labels: historialDeuda.map(item => item ? item.mes : ''),
    datasets: [
      {
        label: 'Deuda Acumulada',
        data: historialDeuda.map(item => item ? item.deuda : 0),
        borderColor: historialDeuda.map(item => item && item.real ? '#3b82f6' : '#9ca3af'),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: historialDeuda.map(item => item && item.real ? 3 : 1),
        borderDash: historialDeuda.map(item => item && item.real ? [] : [5, 5]),
        fill: true,
        pointBackgroundColor: historialDeuda.map(item => item && item.real ? '#3b82f6' : '#6b7280'),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: historialDeuda.map(item => item && item.real ? '#1d4ed8' : '#4b5563'),
        pointHoverBorderColor: '#ffffff'
      }
    ]
  };

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <Line options={options} data={data} />
      <div style={{ 
        textAlign: 'center', 
        marginTop: '10px', 
        fontSize: '12px', 
        color: '#6b7280',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <FontAwesomeIcon icon={faChartLine} />
        <span>{datosReales} mes(es) con datos reales de {totalMeses} mostrados</span>
        {datosReales < totalMeses && (
          <>
            <FontAwesomeIcon icon={faDatabase} style={{ marginLeft: '8px' }} />
            <span>|</span>
            <FontAwesomeIcon icon={faClock} />
            <span>Acumulando datos históricos</span>
          </>
        )}
      </div>
    </div>
  );
}