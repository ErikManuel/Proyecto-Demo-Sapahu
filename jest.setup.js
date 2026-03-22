// jest.setup.js
import '@testing-library/jest-dom';

// Mock de next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    };
  },
}));

// Mock de AuthContext GLOBAL
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    login: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
    isAuthenticated: true,
    token: 'mock-token-12345',
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

// Mock de Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-chart-line">Mock Chart Line</div>,
  Bar: () => <div data-testid="mock-chart-bar">Mock Chart Bar</div>,
  Doughnut: () => <div data-testid="mock-chart-doughnut">Mock Chart Doughnut</div>,
  Pie: () => <div data-testid="mock-chart-pie">Mock Chart Pie</div>,
}));

// Mock de hooks específicos que fallan
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

jest.mock('@/components/ClientManagement/hooks/useTarifas', () => ({
  useTarifas: () => ({
    tarifas: [],
    loading: false,
    error: null,
  }),
}));

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

// Mock global para canvas
global.HTMLCanvasElement.prototype.getContext = jest.fn();

// Mock de console.error para reducir ruido
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      /Warning: ReactDOM.render is deprecated/.test(args[0]) ||
      /Warning:.*not wrapped in act/.test(args[0]) ||
      /HTMLCanvasElement.prototype.getContext/.test(args[0]) ||
      /Error fetching/.test(args[0]) ||
      /No hay token de autenticación/.test(args[0]) ||
      /useAuth must be used within an AuthProvider/.test(args[0])
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});