// test/components/ClientManagement.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Importar como named export
import { ClientManagement } from '@/components/ClientManagement/ClientManagement';

// Mock de hooks
jest.mock('@/components/ClientManagement/hooks/useClientData', () => ({
  useClientData: () => ({
    clients: [
      { id: 1, name: 'Juan Pérez', email: 'juan@test.com', phone: '123456789', deuda: 1500 }
    ],
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

jest.mock('@/components/ClientManagement/hooks/useClientMetrics', () => ({
  useClientMetrics: () => ({
    totalClients: 1,
    clientsWithDebt: 1,
    totalDebt: 1500,
    averageDebt: 1500,
  }),
}));

describe('ClientManagement - Tests Corregidos', () => {
  test('renderiza gestión de clientes', async () => {
    render(<ClientManagement />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /gesti[oó]n de clientes/i })).toBeInTheDocument();
    });
  });

  test('muestra datos de clientes', async () => {
    render(<ClientManagement />);
    
    await waitFor(() => {
      expect(screen.getByText(/\$1,500.00/i)).toBeInTheDocument();
      expect(screen.getByText(/clientes registrados/i)).toBeInTheDocument();
    });
  });
});