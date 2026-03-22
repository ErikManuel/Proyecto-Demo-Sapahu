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
import styles from './IncomeReports.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function GraficaIngresos({ datos, labels, periodo }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Ingresos: $${context.parsed.y.toLocaleString('es-MX')} MXN`;
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
        }
      }
    }
  };

  const data = {
    labels,
    datasets: [
      {
        data: datos,
        backgroundColor: '#3b82f6',
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  return (
    <div className={styles.graficaIngresos}>
      <h3>Ingresos {periodo === 'semanal' ? 'Semanales' : periodo === 'mensual' ? 'Mensuales' : 'Anuales'}</h3>
      <Bar options={options} data={data} />
    </div>
  );
}