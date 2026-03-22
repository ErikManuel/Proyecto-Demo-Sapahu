import styles from './DeudasDashboard.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faChartBar, 
  faChartArea,
  faBullseye,
  faBalanceScale,
  faMoneyBillWave,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

export function MetricasDeuda({ calculos, periodo, historialDeuda }) {
  // Calcular métricas de tendencia solo con datos reales
  const datosReales = historialDeuda.filter(item => item.real);
  const ultimoMesReal = datosReales[datosReales.length - 1]?.deuda || 0;
  const primerMesReal = datosReales[0]?.deuda || 0;

  // Solo calcular tendencia si hay al menos 2 datos reales
  let tendencia = 'stable';
  let variacionPorcentual = 0;
  let variacionMonto = 0;

  if (datosReales.length >= 2) {
    tendencia = ultimoMesReal > primerMesReal ? 'up' : 'down';
    variacionPorcentual = ((ultimoMesReal - primerMesReal) / primerMesReal * 100).toFixed(1);
    variacionMonto = ultimoMesReal - primerMesReal;
  }

  return (
    <div className={styles.metricasDeuda}>
      {/* Análisis de Tendencia */}
      <div className={styles.metricaCard}>
        <div className={styles.metricaHeader}>
          <div className={styles.metricaIcon}>
            {datosReales.length >= 2 ? (
              <FontAwesomeIcon 
                icon={tendencia === 'up' ? faChartLine : faChartBar} 
                className={tendencia === 'up' ? styles.trendUp : styles.trendDown}
              />
            ) : (
              <FontAwesomeIcon icon={faChartArea} />
            )}
          </div>
          <div className={styles.metricaTitle}>Análisis de Tendencia</div>
        </div>
        <div className={styles.metricaContent}>
          {datosReales.length >= 2 ? (
            <>
              <div className={`${styles.metricaValor} ${tendencia === 'up' ? styles.trendUp : styles.trendDown}`}>
                {tendencia === 'up' ? 'En Aumento' : 'En Disminución'}
              </div>
              <div className={styles.metricaDesc}>
                <span className={styles.trendDetail}>
                  {tendencia === 'up' ? '+' : ''}{variacionPorcentual}% 
                  (${Math.abs(variacionMonto).toLocaleString('es-MX')} MXN)
                </span>
              </div>
            </>
          ) : (
            <>
              <div className={styles.metricaValor}>
                Datos Insuficientes
              </div>
              <div className={styles.metricaDesc}>
                <span className={styles.trendDetail}>
                  Se necesitan al menos 2 meses con datos
                </span>
              </div>
            </>
          )}
          <div className={styles.trendPeriod}>
            Período: {periodo.charAt(0).toUpperCase() + periodo.slice(1)}
            {datosReales.length < 2 && ` (${datosReales.length} mes)`}
          </div>
        </div>
      </div>

      {/* Tasa de Recuperación */}
      <div className={styles.metricaCard}>
        <div className={styles.metricaHeader}>
          <div className={styles.metricaIcon}>
            <FontAwesomeIcon icon={faBullseye} className={styles.iconSuccess} />
          </div>
          <div className={styles.metricaTitle}>Tasa de Recuperación</div>
        </div>
        <div className={styles.metricaContent}>
          <div className={styles.metricaValor}>{calculos.tasaRecuperacion}%</div>
          <div className={styles.metricaDesc}>Eficiencia de Cobranza</div>
        </div>
      </div>

      {/* Deuda Promedio */}
      <div className={styles.metricaCard}>
        <div className={styles.metricaHeader}>
          <div className={styles.metricaIcon}>
            <FontAwesomeIcon icon={faBalanceScale} className={styles.iconWarning} />
          </div>
          <div className={styles.metricaTitle}>Deuda Promedio</div>
        </div>
        <div className={styles.metricaContent}>
          <div className={styles.metricaValor}>{calculos.deudaPromedio}</div>
          <div className={styles.metricaDesc}>Por contrato moroso</div>
        </div>
      </div>

      {/* Deuda Mayor */}
      <div className={styles.metricaCard}>
        <div className={styles.metricaHeader}>
          <div className={styles.metricaIcon}>
            <FontAwesomeIcon icon={faMoneyBillWave} className={styles.iconDanger} />
          </div>
          <div className={styles.metricaTitle}>Deuda Mayor</div>
        </div>
        <div className={styles.metricaContent}>
          <div className={styles.metricaValor}>{calculos.deudaMayor}</div>
          <div className={styles.metricaDesc}>Adeudo individual más alto</div>
        </div>
      </div>

      {/* Información adicional */}
      <div className={styles.infoCard}>
        <div className={styles.infoHeader}>
          <FontAwesomeIcon icon={faInfoCircle} className={styles.infoIcon} />
          <h4>Resumen de Deuda</h4>
        </div>
        <div className={styles.infoItem}>
          <span>Contratos con deuda:</span>
          <strong>{calculos.contratosMorosos}</strong>
        </div>
        <div className={styles.infoItem}>
          <span>Deuda reciente:</span>
          <strong>{calculos.deudaReciente}</strong>
        </div>
        <div className={styles.infoItem}>
          <span>Deuda vencida:</span>
          <strong>{calculos.deudaVencida}</strong>
        </div>
        <div className={styles.infoItem}>
          <span>Deuda total:</span>
          <strong>{calculos.deudaTotal}</strong>
        </div>
        <div className={styles.infoItem}>
          <span>Meses con datos:</span>
          <strong>{datosReales.length}</strong>
        </div>
      </div>
    </div>
  );
}