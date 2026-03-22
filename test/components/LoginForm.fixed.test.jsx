// test/components/LoginForm.fixed.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { LoginForm } from '@/components/Auth/LoginForm';

// Mock específico para LoginForm
const mockLogin = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
  }),
}));

describe('LoginForm - Funciona con Mocks', () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  test('se renderiza sin errores con el mock de Auth', () => {
    expect(() => render(<LoginForm />)).not.toThrow();
  });

  test('contiene elementos de formulario', () => {
    render(<LoginForm />);
    
    // Buscar elementos de forma flexible
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/\u2022+/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión|ingresar|acceder/i });
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('permite interactuar con el formulario', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/\u2022+/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión|ingresar|acceder/i });
    
    // Interactuar con el formulario
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});