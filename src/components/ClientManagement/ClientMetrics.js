// components/ClientMetrics.js - Versión con 5 métricas
import styles from './ClientManagement.module.scss';

export function ClientMetrics({ metrics }) {
  return (
    <div className={styles.metrics}>
      <div className={styles.metricCard}>
        <div className={styles.metricIcon}>👥</div>
        <div className={styles.metricContent}>
          <div className={styles.metricValue}>{metrics.total}</div>
          <div className={styles.metricLabel}>Total Clientes</div>
        </div>
      </div>
      
      <div className={styles.metricCard}>
        <div className={styles.metricIcon}>✅</div>
        <div className={styles.metricContent}>
          <div className={styles.metricValue}>{metrics.activos}</div>
          <div className={styles.metricLabel}>Clientes Activos</div>
        </div>
      </div>
      
      <div className={styles.metricCard}>
        <div className={styles.metricIcon}>⏸️</div>
        <div className={styles.metricContent}>
          <div className={styles.metricValue}>{metrics.suspendidos}</div>
          <div className={styles.metricLabel}>Clientes Suspendidos</div>
        </div>
      </div>
      
      <div className={styles.metricCard}>
        <div className={styles.metricIcon}>💰</div>
        <div className={styles.metricContent}>
          <div className={styles.metricValue}>{metrics.conDeuda}</div>
          <div className={styles.metricLabel}>Clientes con Deuda</div>
        </div>
      </div>
      
      <div className={styles.metricCard}>
        <div className={styles.metricIcon}>📍</div>
        <div className={styles.metricContent}>
          <div className={styles.metricValue}>{metrics.conUbicacion}</div>
          <div className={styles.metricLabel}>Con Ubicación</div>
        </div>
      </div>
    </div>
  );
}