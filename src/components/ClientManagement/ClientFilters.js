import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFileExport,
  faChevronDown,
  faFileExcel,
  faFileCsv,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import styles from './ClientManagement.module.scss';

export function ClientFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  tarifaFilter,
  onTarifaFilterChange,
  onExport,
  tarifas = [], // RECIBIR TARIFAS COMO PROP
  loadingTarifas = false
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Filtrar tarifas activas
  const tarifasActivas = tarifas.filter(tarifa => tarifa.activo !== false);

  return (
    <div className={styles.filters}>
      {/* Búsqueda */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre, contrato, dirección o colonia"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Grupo de filtros (Estado + Tarifa) */}
      <div className={styles.filtersGroup}>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>ESTADO:</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Suspendido">Suspendido</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>TIPO DE TARIFA</label>
          <select
            value={tarifaFilter}
            onChange={(e) => onTarifaFilterChange(e.target.value)}
            className={styles.filterSelect}
            disabled={loadingTarifas}
          >
            <option value="todas">Todas las tarifas</option>
            {tarifasActivas.map(tarifa => (
              <option key={tarifa.id} value={tarifa.nombre}>
                {tarifa.nombre}
              </option>
            ))}
          </select>
          {loadingTarifas && <small style={{fontSize: '10px', color: '#6b7280'}}>Cargando...</small>}
        </div>
      </div>

      {/* Botón de Exportar */}
      <div className={styles.exportContainer}>
        <button 
          className={styles.exportButton}
          onClick={() => setShowExportMenu(!showExportMenu)}
          onBlur={() => setTimeout(() => setShowExportMenu(false), 200)}
        >
          <FontAwesomeIcon icon={faFileExport} className={styles.exportIcon} />
          Exportar
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={`${styles.chevronIcon} ${showExportMenu ? styles.rotated : ''}`} 
          />
        </button>
        
        {showExportMenu && (
          <div className={styles.exportMenu}>
            <button 
              className={styles.exportMenuItem}
              onClick={() => { 
                onExport('excel'); 
                setShowExportMenu(false); 
              }}
            >
              <FontAwesomeIcon icon={faFileExcel} className={styles.exportMenuItemIcon} />
              <div className={styles.exportText}>
                <strong>Excel Completo</strong>
                <small>Todos los clientes con información completa</small>
              </div>
            </button>
            
            <button 
              className={styles.exportMenuItem}
              onClick={() => { 
                onExport('csv'); 
                setShowExportMenu(false); 
              }}
            >
              <FontAwesomeIcon icon={faFileCsv} className={styles.exportMenuItemIcon} />
              <div className={styles.exportText}>
                <strong>CSV (Solo activos)</strong>
                <small>Clientes activos en formato CSV</small>
              </div>
            </button>
            
            <button 
              className={styles.exportMenuItem}
              onClick={() => { 
                onExport('metricas'); 
                setShowExportMenu(false); 
              }}
            >
              <FontAwesomeIcon icon={faChartBar} className={styles.exportMenuItemIcon} />
              <div className={styles.exportText}>
                <strong>Reporte de Métricas</strong>
                <small>Estadísticas y análisis</small>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}