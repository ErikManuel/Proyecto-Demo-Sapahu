import {
  faSearch,
  faUsers,
  faFileInvoiceDollar,
  faPhone,
  faChartLine,
  faHouse
} from '@fortawesome/free-solid-svg-icons';

export const HOME_NAV_ITEM = {
  icon: faHouse,
  label: 'Inicio',
  href: '/home'
};

const NAV_ITEMS_BY_ROLE = {
  admin: [
    { icon: faUsers, label: 'Gestión de Usuarios', href: '/gestion-usuarios' },
    { icon: faFileInvoiceDollar, label: 'Deudas', href: '/deudas' },
    { icon: faPhone, label: 'Contacto', href: '/contacto' },
    { icon: faChartLine, label: 'Ingresos', href: '/ingresos' },
    { icon: faUsers, label: 'Gestión de Clientes', href: '/gestion-clientes' }
  ],
  cobrador: [
    { icon: faSearch, label: 'Buscar Cliente', href: '/buscar-cliente' },
    { icon: faFileInvoiceDollar, label: 'Deudas', href: '/deudas' },
    { icon: faPhone, label: 'Contacto', href: '/contacto' }
  ],
  consultor: [
    { icon: faSearch, label: 'Buscar Cliente', href: '/buscar-cliente' },
    { icon: faFileInvoiceDollar, label: 'Deudas', href: '/deudas' },
    { icon: faPhone, label: 'Contacto', href: '/contacto' }
  ]
};

export const getNavItemsByRole = (role) => {
  return NAV_ITEMS_BY_ROLE[role] || NAV_ITEMS_BY_ROLE.consultor;
};
