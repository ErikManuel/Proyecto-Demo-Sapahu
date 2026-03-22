import styles from './IncomeReports.module.scss';

export function BottomMetrics({ metricas }) {
  return (
    <div className={styles.bottomMetrics}>
      <div className={`${styles.metricCard} ${styles.highlight}`}>
        <div className={styles.metricTitle}>Total {metricas.periodo}</div>
        <div className={styles.metricValue}>{metricas.total}</div>
      </div>
      
      <div className={`${styles.metricCard} ${styles.highlight}`}>
        <div className={styles.metricTitle}>
          {metricas.periodo === 'Semanal' ? 'Día Más Alto' : 
           metricas.periodo === 'Mensual' ? 'Mes Más Alto' : 'Año Más Alto'}
        </div>
        <div className={styles.metricValue}>{metricas.diaMasAlto}</div>
      </div>
      
      <div className={`${styles.metricCard} ${styles.highlight}`}>
        <div className={styles.metricTitle}>Promedio Diario</div>
        <div className={styles.metricValue}>{metricas.promedioDiario}</div>
      </div>
    </div>
  );
}