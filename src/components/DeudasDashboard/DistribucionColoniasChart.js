import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function DistribucionColoniasChart({ distribucionColonias }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Distribución de Deuda por Colonia',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const colonia = distribucionColonias[context.dataIndex];
            return [
              `Deuda: $${colonia.deudaTotal.toLocaleString('es-MX')} MXN`,
              `Deudores: ${colonia.deudores}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `$${value.toLocaleString('es-MX')}`;
          }
        },
        title: {
          display: true,
          text: 'Monto (MXN)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Colonias'
        }
      }
    }
  };

  const data = {
    labels: distribucionColonias.map(item => item.colonia),
    datasets: [
      {
        data: distribucionColonias.map(item => item.deudaTotal),
        backgroundColor: [
          '#3b82f6',
          '#10b981', 
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#6b7280'
        ],
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };

  return (
    <div className="chart-container">
      <Bar options={options} data={data} />
    </div>
  );
}