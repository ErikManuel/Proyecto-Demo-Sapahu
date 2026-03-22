// test/components/LoginForm.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Importar como named export
import { LoginForm } from '@/components/Auth/LoginForm';

// Mock del contexto de auth
const mockLogin = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
  }),
}));

describe('LoginForm - Tests Corregidos', () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  test('renderiza formulario de login', () => {
    render(<LoginForm />);
    
    // Buscar elementos del formulario
    expect(screen.getByRole('button', { name: /iniciar sesión|ingresar|acceder/i })).toBeInTheDocument();
    
    // Buscar inputs por tipo o placeholder
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/\u2022+/i);
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test('envía formulario con datos válidos', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    // Encontrar inputs de forma flexible
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/\u2022+/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión|ingresar|acceder/i });
    
    // Datos válidos
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});