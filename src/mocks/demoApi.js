const API_MARKER = '/api/';
const DEMO_TOKEN = 'demo-token';
const DB_STORAGE_KEY = 'sapahu-demo-db-v1';
const DB_META_KEY = 'sapahu-demo-meta-v1';
const AUTO_RESET_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const DEMO_CREDENTIALS = [
  {
    email: 'admin@sapahu.demo',
    password: 'Admin123!',
    role: 'admin',
  },
  {
    email: 'cobrador@sapahu.demo',
    password: 'Cobrador123!',
    role: 'cobrador',
  },
  {
    email: 'consultor@sapahu.demo',
    password: 'Consultor123!',
    role: 'consultor',
  },
];

const DEFAULT_TARIFAS = [
  'SERVICIO DOMESTICO PARTICULAR',
  'SERVICIO DOMESTICO RESIDENCIAL',
  'SERVICIO COMERCIAL',
  'SERVICIO PARA PLANTELES EDUCATIVOS',
  'COMERCIAL BASICO',
];

function createInitialDb() {
  const clients = [
    {
      _id: 'c1',
      contrato: 'CTO-001',
      nombre: 'Juan Perez',
      colonia: 'Centro',
      direccion: 'Av. Hidalgo 120',
      tipoTarifa: 'SERVICIO DOMESTICO PARTICULAR',
      deuda: 1250.5,
      estado: 'Activo',
      telefono: '7411234567',
      email: 'juan.perez@test.com',
      municipio: 'Huetamo',
      activo: true,
      coordenadas: { lat: 18.632, lng: -100.898 },
    },
    {
      _id: 'c2',
      contrato: 'CTO-002',
      nombre: 'Maria Lopez',
      colonia: 'Las Flores',
      direccion: 'Calle Morelos 45',
      tipoTarifa: 'SERVICIO DOMESTICO RESIDENCIAL',
      deuda: 0,
      estado: 'Activo',
      telefono: '7419991122',
      email: 'maria.lopez@test.com',
      municipio: 'Huetamo',
      activo: true,
      coordenadas: null,
    },
    {
      _id: 'c3',
      contrato: 'CTO-003',
      nombre: 'Comercial El Faro',
      colonia: 'Mercado',
      direccion: 'Av. Juarez 20',
      tipoTarifa: 'SERVICIO COMERCIAL',
      deuda: 3480,
      estado: 'Suspendido',
      telefono: '7415559012',
      email: 'contacto@elfaro.com',
      municipio: 'Huetamo',
      activo: true,
      coordenadas: { lat: 18.635, lng: -100.902 },
    },
    {
      _id: 'c4',
      contrato: 'CTO-004',
      nombre: 'Escuela Primaria Benito Juarez',
      colonia: 'La Estacion',
      direccion: 'Prolongacion Guerrero S/N',
      tipoTarifa: 'SERVICIO PARA PLANTELES EDUCATIVOS',
      deuda: 780,
      estado: 'Activo',
      telefono: '7413332211',
      email: 'direccion@primaria-bj.edu.mx',
      municipio: 'Huetamo',
      activo: false,
      coordenadas: null,
      deletedAt: new Date().toISOString(),
    },
  ];

  const users = [
    {
      _id: 'u1',
      name: 'Admin SAPAHU',
      email: 'admin@sapahu.demo',
      role: 'admin',
      municipio: 'Huetamo',
      active: true,
      lastLogin: new Date().toISOString(),
    },
    {
      _id: 'u2',
      name: 'Cobrador Demo',
      email: 'cobrador@sapahu.demo',
      role: 'cobrador',
      municipio: 'Huetamo',
      active: true,
      lastLogin: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: 'u3',
      name: 'Consultor Demo',
      email: 'consultor@sapahu.demo',
      role: 'consultor',
      municipio: 'Huetamo',
      active: true,
      lastLogin: null,
    },
  ];

  const reportes = [
    {
      _id: 'r1',
      titulo: 'Fuga en calle principal',
      descripcion: 'Se detecta fuga constante frente al mercado.',
      categoria: 'fuga_agua',
      prioridad: 'alta',
      estado: 'pendiente',
      ubicacion: 'Av. Juarez esquina Matamoros',
      creadoPor: {
        userId: { _id: 'u2', name: 'Cobrador Demo', role: 'cobrador' },
        nombre: 'Cobrador Demo',
        role: 'cobrador',
      },
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      _id: 'r2',
      titulo: 'Baja presion en colonia Centro',
      descripcion: 'El suministro llega con muy poca presion por las mananas.',
      categoria: 'presion_baja',
      prioridad: 'media',
      estado: 'en_proceso',
      ubicacion: 'Colonia Centro',
      creadoPor: {
        userId: { _id: 'u1', name: 'Admin SAPAHU', role: 'admin' },
        nombre: 'Admin SAPAHU',
        role: 'admin',
      },
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ];

  return {
    clients,
    users,
    reportes,
  };
}

function loadDb() {
  try {
    const raw = window.localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      return createInitialDb();
    }
    const parsed = JSON.parse(raw);
    if (!parsed.clients || !parsed.users || !parsed.reportes) {
      return createInitialDb();
    }
    return parsed;
  } catch {
    return createInitialDb();
  }
}

function saveDb(db) {
  try {
    window.localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    window.localStorage.setItem(
      DB_META_KEY,
      JSON.stringify({
        updatedAt: Date.now(),
      }),
    );
  } catch {
    // Ignore persistence errors in private mode.
  }
}

function getDbMeta() {
  try {
    const rawMeta = window.localStorage.getItem(DB_META_KEY);
    if (!rawMeta) return null;
    const parsedMeta = JSON.parse(rawMeta);
    if (!parsedMeta || typeof parsedMeta.updatedAt !== 'number') {
      return null;
    }
    return parsedMeta;
  } catch {
    return null;
  }
}

function isDemoDbExpired() {
  const meta = getDbMeta();
  if (!meta) {
    return false;
  }
  return Date.now() - meta.updatedAt > AUTO_RESET_MAX_AGE_MS;
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function blobResponse(content, filename, contentType) {
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

function getHeader(headers, name) {
  if (!headers) return null;
  if (headers instanceof Headers) return headers.get(name);
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
  return entry ? entry[1] : null;
}

function extractToken(init) {
  const authHeader = getHeader(init?.headers, 'Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

function createTokenForUser(userId) {
  return `${DEMO_TOKEN}::${userId}`;
}

function getUserIdFromToken(token) {
  if (!token || !token.startsWith(`${DEMO_TOKEN}::`)) return null;
  return token.slice(`${DEMO_TOKEN}::`.length);
}

function isSapahuApiRequest(url) {
  return url.pathname.includes(API_MARKER);
}

function getApiPath(url) {
  const markerIndex = url.pathname.indexOf(API_MARKER);
  if (markerIndex === -1) return '';
  return url.pathname.slice(markerIndex + API_MARKER.length - 1);
}

function parseBody(body) {
  if (!body) return null;
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body;
}

function nextId(prefix, list) {
  return `${prefix}${Date.now()}${list.length + 1}`;
}

function ensureAuth(path, token) {
  if (path === '/auth/login') return true;
  return Boolean(token);
}

function getCurrentUser(db, token) {
  if (!token) return null;
  const userId = getUserIdFromToken(token);
  if (!userId) return null;
  return db.users.find((u) => u._id === userId) || null;
}

function getDashboardData(periodo, db) {
  const activeWithDebt = db.clients.filter((client) => client.activo !== false && Number(client.deuda || 0) > 0);
  const deudaTotal = activeWithDebt.reduce((sum, client) => sum + Number(client.deuda || 0), 0);
  const deudaReciente = deudaTotal * 0.35;
  const deudaVencida = deudaTotal - deudaReciente;

  const grouped = new Map();
  activeWithDebt.forEach((client) => {
    const current = grouped.get(client.colonia) || { colonia: client.colonia, deudaTotal: 0, deudores: 0 };
    current.deudaTotal += Number(client.deuda || 0);
    current.deudores += 1;
    grouped.set(client.colonia, current);
  });

  const distribucionColonias = Array.from(grouped.values())
    .sort((a, b) => b.deudaTotal - a.deudaTotal)
    .slice(0, 6);

  const points = periodo === 'anual' ? 24 : periodo === 'trimestral' ? 12 : 6;
  const now = new Date();
  const historialDeuda = Array.from({ length: points }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (points - i - 1), 1);
    const debt = Math.max(0, deudaTotal - (points - i - 1) * 90 + i * 60);
    return {
      mes: date.toLocaleDateString('es-MX', { month: 'short', year: periodo === 'anual' ? 'numeric' : undefined }),
      deuda: Math.round(debt * 100) / 100,
      real: i >= points - 4,
    };
  });

  return {
    resumen: {
      deudaTotal,
      contratosMorosos: activeWithDebt.length,
      deudaReciente,
      deudaVencida,
      tasaRecuperacion: 82,
      deudaPromedio: activeWithDebt.length ? deudaTotal / activeWithDebt.length : 0,
      deudaMayor: activeWithDebt.length ? Math.max(...activeWithDebt.map((client) => Number(client.deuda || 0))) : 0,
    },
    distribucionColonias,
    historialDeuda,
  };
}

function getIngresosData(periodo, desde, hasta) {
  if (periodo === 'personalizado') {
    const startDate = new Date(desde);
    const endDate = new Date(hasta);
    const totalDays = Math.max(1, Math.floor((endDate - startDate) / 86400000) + 1);
    const datos = Array.from({ length: totalDays }, (_, i) => 5000 + (i % 5) * 1200 + Math.floor(Math.random() * 1000));
    const labels = Array.from({ length: totalDays }, (_, i) => `Dia ${i + 1}`);
    return { datos, labels };
  }

  if (periodo === 'mensual') {
    return {
      datos: [420000, 450000, 470000, 510000, 540000, 500000, 560000, 590000, 620000, 605000, 630000, 650000],
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    };
  }

  if (periodo === 'anual') {
    return {
      datos: [4800000, 5300000, 5600000, 5900000, 6400000],
      labels: ['2021', '2022', '2023', '2024', '2025'],
    };
  }

  return {
    datos: [12000, 14500, 13200, 16900, 18200, 21000, 19800],
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
  };
}

function applyClientFilters(clients, searchParams) {
  let filtered = [...clients];
  const search = (searchParams.get('search') || '').toLowerCase().trim();
  const estado = searchParams.get('estado');
  const tipoTarifa = searchParams.get('tipoTarifa');

  if (search) {
    filtered = filtered.filter((client) => {
      const haystack = `${client.contrato} ${client.nombre} ${client.colonia} ${client.direccion}`.toLowerCase();
      return haystack.includes(search);
    });
  }

  if (estado && estado !== 'todos') {
    filtered = filtered.filter((client) => client.estado === estado);
  }

  if (tipoTarifa && tipoTarifa !== 'todas') {
    filtered = filtered.filter((client) => client.tipoTarifa === tipoTarifa);
  }

  return filtered;
}

async function handleApiRequest(url, init, dbRef) {
  const method = (init?.method || 'GET').toUpperCase();
  const path = getApiPath(url);
  const token = extractToken(init);

  if (!ensureAuth(path, token)) {
    return jsonResponse({ success: false, message: 'No autenticado' }, 401);
  }

  const db = dbRef.current;

  if (path === '/auth/login' && method === 'POST') {
    const body = parseBody(init?.body) || {};
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    const matchedCredential = DEMO_CREDENTIALS.find(
      (credential) => credential.email === email && credential.password === password,
    );

    if (!matchedCredential) {
      return jsonResponse(
        {
          success: false,
          message: 'Credenciales invalidas. Usa una cuenta demo definida para el portafolio.',
        },
        401,
      );
    }

    let user = db.users.find((item) => item.email.toLowerCase() === email);
    if (!user) {
      user = {
        _id: nextId('u', db.users),
        name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: matchedCredential.email,
        role: matchedCredential.role,
        municipio: 'Huetamo',
        active: true,
        lastLogin: new Date().toISOString(),
      };
      db.users.unshift(user);
    }

    user.lastLogin = new Date().toISOString();
    saveDb(db);

    return jsonResponse({
      success: true,
      token: createTokenForUser(user._id),
      user,
    });
  }

  if (path === '/auth/me' && method === 'GET') {
    const user = getCurrentUser(db, token);
    if (!user) {
      return jsonResponse({ success: false, message: 'Sesion invalida' }, 401);
    }
    return jsonResponse({ success: true, user });
  }

  if (path.startsWith('/users') && method === 'GET') {
    const pagina = Math.max(1, Number(url.searchParams.get('pagina')) || 1);
    const limite = Math.max(1, Number(url.searchParams.get('limite')) || 5);
    const sorted = [...db.users].sort((a, b) => a.name.localeCompare(b.name));
    const totalUsuarios = sorted.length;
    const totalPaginas = Math.max(1, Math.ceil(totalUsuarios / limite));
    const start = (pagina - 1) * limite;
    const users = sorted.slice(start, start + limite);
    return jsonResponse({
      success: true,
      users,
      paginaActual: pagina,
      totalPaginas,
      totalUsuarios,
    });
  }

  if (path === '/users' && method === 'POST') {
    const body = parseBody(init?.body) || {};
    const user = {
      _id: nextId('u', db.users),
      name: body.name || 'Nuevo Usuario',
      email: body.email || `usuario${db.users.length + 1}@sapahu.demo`,
      role: body.role || 'cobrador',
      municipio: body.municipio || 'Huetamo',
      active: true,
      lastLogin: null,
    };
    db.users.unshift(user);
    saveDb(db);
    return jsonResponse({ success: true, data: user });
  }

  if (/^\/users\/.+/.test(path) && method === 'PUT') {
    const userId = path.split('/')[2];
    const body = parseBody(init?.body) || {};
    const index = db.users.findIndex((user) => user._id === userId);
    if (index < 0) {
      return jsonResponse({ success: false, message: 'Usuario no encontrado' }, 404);
    }
    db.users[index] = { ...db.users[index], ...body };
    saveDb(db);
    return jsonResponse({ success: true, data: db.users[index] });
  }

  if (/^\/users\/.+/.test(path) && method === 'DELETE') {
    const userId = path.split('/')[2];
    const user = db.users.find((item) => item._id === userId);
    if (!user) {
      return jsonResponse({ success: false, message: 'Usuario no encontrado' }, 404);
    }
    user.active = false;
    saveDb(db);
    return jsonResponse({ success: true, data: user });
  }

  if (path === '/clientes/next-contract' && method === 'GET') {
    const max = db.clients.reduce((acc, client) => {
      const match = /^CTO-(\d+)$/.exec(client.contrato || '');
      return match ? Math.max(acc, Number(match[1])) : acc;
    }, 0);
    const nextNumber = max + 1;
    const nextContract = `CTO-${String(nextNumber).padStart(3, '0')}`;
    return jsonResponse({
      success: true,
      data: { nextNumber, nextContract },
    });
  }

  if (path === '/clientes' && method === 'GET') {
    const filtered = applyClientFilters(db.clients, url.searchParams);
    const limit = Number(url.searchParams.get('limit')) || filtered.length;
    return jsonResponse({ success: true, data: filtered.slice(0, limit) });
  }

  if (path === '/clientes' && method === 'POST') {
    const body = parseBody(init?.body) || {};
    const client = {
      _id: nextId('c', db.clients),
      contrato: body.contrato || `CTO-${String(db.clients.length + 1).padStart(3, '0')}`,
      nombre: body.nombre || 'Cliente Demo',
      colonia: body.colonia || 'Centro',
      direccion: body.direccion || 'Sin direccion',
      tipoTarifa: body.tipoTarifa || DEFAULT_TARIFAS[0],
      deuda: Number(body.deuda || 0),
      estado: body.estado || 'Activo',
      telefono: body.telefono || '',
      email: body.email || '',
      municipio: body.municipio || 'Huetamo',
      activo: true,
      coordenadas: body.coordenadas || null,
    };
    db.clients.unshift(client);
    saveDb(db);
    return jsonResponse({ success: true, data: client }, 201);
  }

  if (path === '/clientes/deleted/list' && method === 'GET') {
    const search = (url.searchParams.get('search') || '').toLowerCase().trim();
    let deleted = db.clients.filter((client) => client.activo === false);
    if (search) {
      deleted = deleted.filter((client) => {
        const haystack = `${client.contrato} ${client.nombre} ${client.colonia}`.toLowerCase();
        return haystack.includes(search);
      });
    }
    return jsonResponse({ success: true, data: deleted });
  }

  if (/^\/clientes\/.+\/restore$/.test(path) && method === 'POST') {
    const clientId = path.split('/')[2];
    const client = db.clients.find((item) => item._id === clientId);
    if (!client) {
      return jsonResponse({ success: false, message: 'Cliente no encontrado' }, 404);
    }
    client.activo = true;
    client.deletedAt = null;
    saveDb(db);
    return jsonResponse({ success: true, data: client });
  }

  if (path === '/clientes/restore/multiple' && method === 'POST') {
    const body = parseBody(init?.body) || {};
    const ids = Array.isArray(body.clienteIds) ? body.clienteIds : [];
    const details = ids.map((id) => {
      const client = db.clients.find((item) => item._id === id);
      if (!client) return { id, success: false };
      client.activo = true;
      client.deletedAt = null;
      return { id, success: true };
    });
    saveDb(db);

    const restaurados = details.filter((item) => item.success).length;
    const errores = details.length - restaurados;

    return jsonResponse({
      success: true,
      data: {
        restaurados,
        errores,
        detalles: details,
      },
    });
  }

  if (path === '/clientes/restore/all' && method === 'POST') {
    let restaurados = 0;
    db.clients.forEach((client) => {
      if (client.activo === false) {
        client.activo = true;
        client.deletedAt = null;
        restaurados += 1;
      }
    });
    saveDb(db);

    return jsonResponse({
      success: true,
      data: {
        restaurados,
        errores: 0,
      },
    });
  }

  if (path === '/clientes/buscar' && method === 'GET') {
    const term = (url.searchParams.get('q') || '').toLowerCase().trim();
    const results = db.clients.filter((client) => {
      const haystack = `${client.contrato} ${client.nombre}`.toLowerCase();
      return client.activo !== false && haystack.includes(term);
    });
    return jsonResponse({ success: true, data: results });
  }

  if (/^\/clientes\/.+\/coordenadas$/.test(path) && method === 'PUT') {
    const clientId = path.split('/')[2];
    const body = parseBody(init?.body) || {};
    const client = db.clients.find((item) => item._id === clientId);
    if (!client) {
      return jsonResponse({ success: false, message: 'Cliente no encontrado' }, 404);
    }
    client.coordenadas = body.coordenadas || null;
    saveDb(db);
    return jsonResponse({ success: true, data: client });
  }

  if (/^\/clientes\/.+\/pago$/.test(path) && method === 'POST') {
    const clientId = path.split('/')[2];
    const body = parseBody(init?.body) || {};
    const client = db.clients.find((item) => item._id === clientId);
    if (!client) {
      return jsonResponse({ success: false, message: 'Cliente no encontrado' }, 404);
    }
    const monto = Number(body.monto || 0);
    client.deuda = Math.max(0, Number(client.deuda || 0) - monto);
    client.estado = client.deuda > 0 ? 'Suspendido' : 'Activo';
    saveDb(db);
    return jsonResponse({ success: true, data: { deuda: client.deuda } });
  }

  if (/^\/clientes\/.+/.test(path) && method === 'PUT') {
    const clientId = path.split('/')[2];
    const body = parseBody(init?.body) || {};
    const index = db.clients.findIndex((client) => client._id === clientId);
    if (index < 0) {
      return jsonResponse({ success: false, message: 'Cliente no encontrado' }, 404);
    }
    db.clients[index] = { ...db.clients[index], ...body };
    saveDb(db);
    return jsonResponse({ success: true, data: db.clients[index] });
  }

  if (/^\/clientes\/.+/.test(path) && method === 'DELETE') {
    const clientId = path.split('/')[2];
    const body = parseBody(init?.body) || {};
    const client = db.clients.find((item) => item._id === clientId);
    if (!client) {
      return jsonResponse({ success: false, message: 'Cliente no encontrado' }, 404);
    }
    client.activo = false;
    client.deletedAt = new Date().toISOString();
    client.motivoBaja = body?.motivo || 'Eliminado en modo demo';
    saveDb(db);
    return jsonResponse({ success: true, data: client });
  }

  if (path === '/deudas/dashboard' && method === 'GET') {
    const periodo = url.searchParams.get('periodo') || 'mensual';
    return jsonResponse({
      success: true,
      data: getDashboardData(periodo, db),
    });
  }

  if ((path === '/ingresos/semanal' || path === '/ingresos/mensual' || path === '/ingresos/anual') && method === 'GET') {
    const periodo = path.split('/')[2];
    return jsonResponse({ success: true, data: getIngresosData(periodo) });
  }

  if (path === '/ingresos/rango' && method === 'GET') {
    const desde = url.searchParams.get('desde');
    const hasta = url.searchParams.get('hasta');
    return jsonResponse({ success: true, data: getIngresosData('personalizado', desde, hasta) });
  }

  if (path === '/ingresos/descargar' && method === 'GET') {
    const periodo = url.searchParams.get('periodo') || 'semanal';
    const content = `Reporte de ingresos demo (${periodo}) - ${new Date().toISOString()}`;
    return blobResponse(content, `reporte_ingresos_${periodo}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }

  if (path === '/export/tarifas' && method === 'GET') {
    const uniqueTarifas = Array.from(new Set(db.clients.map((client) => client.tipoTarifa).filter(Boolean)));
    return jsonResponse({ success: true, tarifas: uniqueTarifas.length ? uniqueTarifas : DEFAULT_TARIFAS });
  }

  if (path === '/export/clientes/excel' && method === 'GET') {
    return blobResponse('Export clientes demo', `clientes_${new Date().toISOString().split('T')[0]}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }

  if (path === '/export/clientes/csv' && method === 'GET') {
    const csvRows = ['contrato,nombre,colonia,deuda'];
    db.clients
      .filter((client) => client.activo !== false)
      .forEach((client) => {
        csvRows.push(`${client.contrato},${client.nombre},${client.colonia},${client.deuda}`);
      });
    return blobResponse(csvRows.join('\n'), `clientes_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  }

  if (path === '/export/metricas' && method === 'GET') {
    return blobResponse('Export metricas demo', `metricas_clientes_${new Date().toISOString().split('T')[0]}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }

  if (path === '/reportes' && method === 'GET') {
    const estado = url.searchParams.get('estado');
    const categoria = url.searchParams.get('categoria');
    const prioridad = url.searchParams.get('prioridad');

    let list = [...db.reportes];
    if (estado) list = list.filter((item) => item.estado === estado);
    if (categoria) list = list.filter((item) => item.categoria === categoria);
    if (prioridad) list = list.filter((item) => item.prioridad === prioridad);

    return jsonResponse({ success: true, data: list });
  }

  if (path === '/reportes' && method === 'POST') {
    const body = parseBody(init?.body) || {};
    const currentUser = getCurrentUser(db, token) || db.users[0];

    const reporte = {
      _id: nextId('r', db.reportes),
      titulo: body.titulo || 'Reporte sin titulo',
      descripcion: body.descripcion || '',
      categoria: body.categoria || 'otro',
      prioridad: body.prioridad || 'media',
      estado: 'pendiente',
      ubicacion: body.ubicacion || '',
      creadoPor: {
        userId: {
          _id: currentUser._id,
          name: currentUser.name,
          role: currentUser.role,
        },
        nombre: currentUser.name,
        role: currentUser.role,
      },
      createdAt: new Date().toISOString(),
    };

    db.reportes.unshift(reporte);
    saveDb(db);

    return jsonResponse({ success: true, data: reporte }, 201);
  }

  if (/^\/reportes\/.+/.test(path) && method === 'PUT') {
    const reporteId = path.split('/')[2];
    const body = parseBody(init?.body) || {};
    const index = db.reportes.findIndex((item) => item._id === reporteId);
    if (index < 0) {
      return jsonResponse({ success: false, message: 'Reporte no encontrado' }, 404);
    }
    db.reportes[index] = { ...db.reportes[index], ...body, updatedAt: new Date().toISOString() };
    saveDb(db);
    return jsonResponse({ success: true, data: db.reportes[index] });
  }

  return jsonResponse({ success: false, message: `Ruta demo no implementada: ${method} ${path}` }, 404);
}

export function initializeDemoApi() {
  if (typeof window === 'undefined') return;
  if (window.__SAPAHU_DEMO_API_INSTALLED__) return;

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
  if (!demoMode) return;

  const originalFetch = window.fetch.bind(window);
  const dbRef = { current: loadDb() };
  window.__SAPAHU_DEMO_DB_REF__ = dbRef;

  if (!window.localStorage.getItem(DB_STORAGE_KEY)) {
    saveDb(dbRef.current);
  } else if (isDemoDbExpired()) {
    resetDemoData({ silent: true });
    dbRef.current = loadDb();
  }

  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, window.location.origin);

    if (!isSapahuApiRequest(url)) {
      return originalFetch(input, init);
    }

    const response = await handleApiRequest(url, init, dbRef);
    dbRef.current = loadDb();
    return response;
  };

  window.__SAPAHU_DEMO_API_INSTALLED__ = true;
}

export function resetDemoData({ silent = false } = {}) {
  if (typeof window === 'undefined') return;

  const freshDb = createInitialDb();
  saveDb(freshDb);

  if (window.__SAPAHU_DEMO_DB_REF__) {
    window.__SAPAHU_DEMO_DB_REF__.current = freshDb;
  }

  if (!silent) {
    window.dispatchEvent(new CustomEvent('sapahu-demo-reset'));
  }
}
