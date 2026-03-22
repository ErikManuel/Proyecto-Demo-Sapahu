import { createContext, useState, useContext } from 'react';

const ReporteContext = createContext();

export function ReporteProvider({ children }) {
  const [reportes, setReportes] = useState([]);

  const agregarReporte = (nuevoReporte) => {
    setReportes(prev => [nuevoReporte, ...prev]);
  };

  const actualizarReporte = (id, datosActualizados) => {
    setReportes(prev => 
      prev.map(reporte => 
        reporte._id === id ? { ...reporte, ...datosActualizados } : reporte
      )
    );
  };

  return (
    <ReporteContext.Provider value={{
      reportes,
      agregarReporte,
      actualizarReporte,
      setReportes
    }}>
      {children}
    </ReporteContext.Provider>
  );
}

export const useReporteContext = () => {
  const context = useContext(ReporteContext);
  if (!context) {
    throw new Error('useReporteContext debe usarse dentro de ReporteProvider');
  }
  return context;
};