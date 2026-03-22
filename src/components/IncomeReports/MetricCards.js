import styles from './IncomeReports.module.scss';

export function MetricCards({ metricas }) {
  return (
    <div className={styles.metricCards}>
      <div className={styles.metricCard}>
        <div className={styles.metricTitle}>Total {metricas.periodo}</div>
        <div className={styles.metricValue}>{metricas.total}</div>
      </div>
      
      <div className={styles.metricCard}>
        <div className={styles.metricTitle}>Día Más Alto</div>
        <div className={styles.metricValue}>{metricas.diaMasAlto}</div>
      </div>
      
      <div className={styles.metricCard}>
        <div className={styles.metricTitle}>Promedio Diario</div>
        <div className={styles.metricValue}>{metricas.promedioDiario}</div>
      </div>
    </div>
  );
}