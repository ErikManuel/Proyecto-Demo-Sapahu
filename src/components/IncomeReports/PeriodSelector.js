import styles from './IncomeReports.module.scss';

export function PeriodSelector({ periodo, onPeriodChange }) {
  return (
    <div className={styles.periodSelector}>
      <div 
        className={`${styles.periodItem} ${periodo === 'semanal' ? styles.active : ''}`}
        onClick={() => onPeriodChange('semanal')}
      >
        Semanal
      </div>
      <div 
        className={`${styles.periodItem} ${periodo === 'mensual' ? styles.active : ''}`}
        onClick={() => onPeriodChange('mensual')}
      >
        Mensual
      </div>
      <div 
        className={`${styles.periodItem} ${periodo === 'anual' ? styles.active : ''}`}
        onClick={() => onPeriodChange('anual')}
      >
        Anual
      </div>
    </div>
  );
}