import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ClientManagement } from '@/components/ClientManagement/ClientManagement';

describe('ClientManagement - Funciona con Mocks', () => {
	test('se renderiza sin errores', () => {
		expect(() => render(<ClientManagement />)).not.toThrow();
	});

	test('muestra estructura principal', async () => {
		render(<ClientManagement />);

		await waitFor(() => {
			expect(screen.getByRole('heading', { name: /gesti[oó]n de clientes/i })).toBeInTheDocument();
			expect(screen.getByText(/clientes registrados/i)).toBeInTheDocument();
		});
	});
});
