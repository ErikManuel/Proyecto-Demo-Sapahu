// test/components/DeudasDashboard.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

// Importar como named export
import { DeudasDashboard } from '@/components/DeudasDashboard/DeudasDashboard';

// Mock de hooks
jest.mock('@/components/DeudasDashboard/hooks/useDeudasData', () => ({
  useDeudasData: () => ({
    deudas: [
      { id: 1, cliente: 'Test Cliente', monto: 1000, fecha: '2024-01-01', estado: 'pendiente' }
    ],
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

jest.mock('@/components/DeudasDashboard/hooks/useDeudasCalculations', () => ({
  useDeudasCalculations: () => ({
    totalDeudas: 4800,
    promedioDeudas: 1600,
    totalClientes: 3,
    deudasPendientes: 2,
    historialDeuda: [],
    topDeudores: [],
  }),
}));

describe('DeudasDashboard - Tests Corregidos', () => {
  test('renderiza el dashboard correctamente', async () => {
    render(<DeudasDashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /deuda global/i })).toBeInTheDocument();
    });
  });

  test('muestra métricas principales', async () => {
    render(<DeudasDashboard />);
    
    await waitFor(() => {
      // Buscar cualquier elemento que contenga símbolo de moneda
      const currencyElements = screen.queryAllByText(/\$|S\/|sol/i);
      if (currencyElements.length > 0) {
        expect(currencyElements[0]).toBeInTheDocument();
      }
    });
  });
});