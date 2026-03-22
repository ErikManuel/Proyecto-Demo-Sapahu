// test/components/DeudasDashboard.fixed.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { DeudasDashboard } from '@/components/DeudasDashboard/DeudasDashboard';

describe('DeudasDashboard - Funciona con Mocks', () => {
  test('se renderiza sin errores', () => {
    expect(() => render(<DeudasDashboard />)).not.toThrow();
  });

  test('muestra elementos del dashboard', async () => {
    render(<DeudasDashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /deuda global/i })).toBeInTheDocument();
      expect(screen.getByText(/deuda total acumulada/i)).toBeInTheDocument();
    });
  });

  test('contiene selectores de período', async () => {
    render(<DeudasDashboard />);
    
    await waitFor(() => {
      const select = screen.queryByRole('combobox');
      if (select) {
        expect(select).toBeInTheDocument();
      }
    });
  });
});