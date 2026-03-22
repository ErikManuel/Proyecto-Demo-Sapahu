import styles from './DeudasDashboard.module.scss';

export function DeudaSummary({ calculos }) {
  return (
    <div className={styles.deudaSummary}>
      <div className={styles.metricaPrincipal}>
        <div className={styles.deudaTotal}>
          <div className={styles.deudaValor}>{calculos.deudaTotal}</div>
          <div className={styles.deudaLabel}>Deuda Total Acumulada</div>
          <div className={styles.deudaSubtext}>
            Correspondiente a {calculos.contratosMorosos} contratos morosos
          </div>
        </div>
      </div>

      <div className={styles.desgloseDeuda}>
        <div className={styles.desgloseItem}>
          <div className={styles.desgloseIcon}>🟢</div>
          <div className={styles.desgloseContent}>
            <div className={styles.desgloseLabel}>Deuda Reciente (&lt;30 días)</div>
            <div className={styles.desgloseValor}>{calculos.deudaReciente}</div>
          </div>
        </div>

        <div className={styles.desgloseItem}>
          <div className={styles.desgloseIcon}>🔴</div>
          <div className={styles.desgloseContent}>
            <div className={styles.desgloseLabel}>Deuda Vencida (&gt;30 días)</div>
            <div className={styles.desgloseValor}>{calculos.deudaVencida}</div>
          </div>
        </div>
      </div>
    </div>
  );
}