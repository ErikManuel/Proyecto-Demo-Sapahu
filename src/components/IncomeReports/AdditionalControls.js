import { useState } from 'react';
import styles from './IncomeReports.module.scss';

export function AdditionalControls({ onDownload, onDateRangeChange }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDateChange = () => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
  };

  return (
    <div className={styles.additionalControls}>
      <div className={styles.dateRangeSelector}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Fecha inicio"
        />
        <span>a</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Fecha fin"
        />
        <button onClick={handleDateChange} className={styles.applyButton}>
          Aplicar
        </button>
      </div>
      
      <button onClick={onDownload} className={styles.downloadButton}>
        📥 Descargar Reporte
      </button>
    </div>
  );
}