import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, 
  faChevronRight,
  faAnglesLeft,
  faAnglesRight
} from '@fortawesome/free-solid-svg-icons';
import styles from './UserManagement.module.scss';

export function Pagination({ 
  paginaActual, 
  totalPaginas, 
  onChangePagina,
  totalElementos,
  elementosPorPagina,
  onChangeElementosPorPagina 
}) {
  const opcionesElementosPorPagina = [5, 10, 20, 50];

  const generarNumerosPaginas = () => {
    const paginas = [];
    const paginasAMostrar = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(paginasAMostrar / 2));
    let fin = Math.min(totalPaginas, inicio + paginasAMostrar - 1);
    
    // Ajustar inicio si estamos cerca del final
    if (fin - inicio + 1 < paginasAMostrar) {
      inicio = Math.max(1, fin - paginasAMostrar + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  };

  const irPrimeraPagina = () => onChangePagina(1);
  const irPaginaAnterior = () => onChangePagina(paginaActual - 1);
  const irPaginaSiguiente = () => onChangePagina(paginaActual + 1);
  const irUltimaPagina = () => onChangePagina(totalPaginas);

  if (totalPaginas <= 1 && totalElementos <= opcionesElementosPorPagina[0]) return null;

  const paginas = generarNumerosPaginas();
  const inicioElemento = (paginaActual - 1) * elementosPorPagina + 1;
  const finElemento = Math.min(paginaActual * elementosPorPagina, totalElementos);

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationInfo}>
        <span>
          Mostrando {inicioElemento}-{finElemento} de {totalElementos} usuarios
        </span>
      </div>
      
      <div className={styles.paginationControls}>
        <div className={styles.pageSizeSelector}>
          <label>Mostrar:</label>
          <select 
            value={elementosPorPagina} 
            onChange={(e) => onChangeElementosPorPagina(Number(e.target.value))}
            className={styles.pageSizeSelect}
          >
            {opcionesElementosPorPagina.map(opcion => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.paginationButtons}>
          <button
            className={styles.paginationBtn}
            onClick={irPrimeraPagina}
            disabled={paginaActual === 1}
            title="Primera página"
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          
          <button
            className={styles.paginationBtn}
            onClick={irPaginaAnterior}
            disabled={paginaActual === 1}
            title="Página anterior"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {paginas.map(numero => (
            <button
              key={numero}
              className={`${styles.paginationBtn} ${
                numero === paginaActual ? styles.paginationBtnActive : ''
              }`}
              onClick={() => onChangePagina(numero)}
            >
              {numero}
            </button>
          ))}

          <button
            className={styles.paginationBtn}
            onClick={irPaginaSiguiente}
            disabled={paginaActual === totalPaginas}
            title="Página siguiente"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          
          <button
            className={styles.paginationBtn}
            onClick={irUltimaPagina}
            disabled={paginaActual === totalPaginas}
            title="Última página"
          >
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>
        </div>
      </div>
    </div>
  );
}