// ============================================
// G4 COMPANY — Mock Data
// Sistema de logística de café (paquetes)
// ============================================

export type UserRole = 'admin' | 'operario' | 'cliente';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
  minStock: number;
  price: number;
  category: string;
  weight: string;
  origin: string;
}

export type OrderStatus = 'Pendiente' | 'En Proceso' | 'En Camino' | 'Entregado' | 'Cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  branchId: string;
  branchName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type TrackingStatus =
  | 'Depósitos'
  | 'Retirado'
  | 'Centro de Distribución'
  | 'En Viaje'
  | 'Aduana'
  | 'Argentina'
  | 'Bolivia'
  | 'Entregado';

export const TRACKING_STEPS: TrackingStatus[] = [
  'Depósitos',
  'Retirado',
  'Centro de Distribución',
  'En Viaje',
  'Aduana',
  'Argentina',
  'Bolivia',
  'Entregado',
];

export interface TrackingEvent {
  status: TrackingStatus;
  timestamp: string;
  note?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  operatorId: string;
  operatorName: string;
  branchName: string;
  currentStatus: TrackingStatus;
  tracking: TrackingEvent[];
  createdAt: string;
}

export type ShiftType = 'Mañana' | 'Tarde' | 'Noche';

export interface ShiftAssignment {
  operatorId: string;
  operatorName: string;
  day: string; // ISO date string YYYY-MM-DD
  shift: ShiftType;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'entrada' | 'salida';
  quantity: number;
  date: string;
  note: string;
}

// ============================================
// FINANCIAL DATA TYPES
// ============================================

export type PaymentStatus = 'Pagada' | 'Pendiente' | 'Vencida' | 'Parcial';
export type PaymentMethod = 'Transferencia' | 'Efectivo' | 'Cheque' | 'Crédito 30d' | 'Crédito 60d';

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Invoice {
  id: string;
  orderId: string;
  branchId: string;
  branchName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  issuedAt: string;
  dueDate: string;
  paidAt?: string;
}

export interface MonthlyRevenue {
  month: string;
  monthLabel: string;
  revenue: number;
  costs: number;
  profit: number;
  orders: number;
  avgTicket: number;
}

export interface DailyRevenue {
  date: string;
  dateLabel: string;
  revenue: number;
  orders: number;
}

export interface BranchRevenue {
  branchId: string;
  branchName: string;
  revenue: number;
  orders: number;
  percentage: number;
}

export interface ProductRevenue {
  productId: string;
  productName: string;
  revenue: number;
  unitsSold: number;
  percentage: number;
}

// ============================================
// INITIAL DATA
// ============================================

export const initialUsers: User[] = [
  { id: 'u1', name: 'Admin G4', email: 'admin@g4company.com', password: 'admin123', role: 'admin', active: true, createdAt: '2026-01-15T08:00:00' },
  { id: 'u2', name: 'Carlos Mendoza', email: 'carlos@g4company.com', password: 'oper123', role: 'operario', active: true, createdAt: '2026-02-01T09:00:00' },
  { id: 'u3', name: 'María López', email: 'maria@g4company.com', password: 'oper123', role: 'operario', active: true, createdAt: '2026-02-10T09:00:00' },
  { id: 'u4', name: 'Jorge Ruiz', email: 'jorge@g4company.com', password: 'oper123', role: 'operario', active: true, createdAt: '2026-02-15T09:00:00' },
  { id: 'u5', name: 'Ana Vargas', email: 'ana@g4company.com', password: 'oper123', role: 'operario', active: false, createdAt: '2026-03-01T09:00:00' },
  { id: 'u6', name: 'Sucursal Centro', email: 'centro@cliente.com', password: 'cli123', role: 'cliente', active: true, createdAt: '2026-01-20T10:00:00' },
];

export const initialBranches: Branch[] = [
  { id: 'b1', name: 'Sucursal Centro', address: 'Av. Principal 1200', city: 'Buenos Aires', country: 'Argentina' },
  { id: 'b2', name: 'Sucursal Norte', address: 'Calle Comercio 450', city: 'Salta', country: 'Argentina' },
  { id: 'b3', name: 'Sucursal Sur', address: 'Av. Patagonia 890', city: 'Neuquén', country: 'Argentina' },
  { id: 'b4', name: 'Sucursal Bolivia', address: 'Calle Mercado 320', city: 'Santa Cruz', country: 'Bolivia' },
  { id: 'b5', name: 'Sucursal La Paz', address: 'Av. 6 de Agosto 1500', city: 'La Paz', country: 'Bolivia' },
];

export const initialProducts: Product[] = [
  { id: 'p1', name: 'G4 Clásico', description: 'Blend tradicional, tostado medio. Notas de chocolate y nuez.', stock: 150, minStock: 30, price: 2500, category: 'Blend', weight: '250g', origin: 'Colombia/Brasil' },
  { id: 'p2', name: 'G4 Premium', description: 'Selección especial de granos arábica de altura.', stock: 85, minStock: 20, price: 4200, category: 'Especialidad', weight: '250g', origin: 'Colombia' },
  { id: 'p3', name: 'G4 Intenso', description: 'Tostado oscuro, cuerpo fuerte. Ideal para espresso.', stock: 12, minStock: 25, price: 2800, category: 'Espresso', weight: '500g', origin: 'Brasil' },
  { id: 'p4', name: 'G4 Descafeinado', description: 'Todo el sabor sin cafeína. Proceso Swiss Water.', stock: 45, minStock: 15, price: 3100, category: 'Descafeinado', weight: '250g', origin: 'México' },
  { id: 'p5', name: 'G4 Orgánico', description: 'Certificado orgánico. Notas frutales y florales.', stock: 8, minStock: 20, price: 4800, category: 'Orgánico', weight: '250g', origin: 'Perú' },
  { id: 'p6', name: 'G4 Molido Suave', description: 'Molienda fina, ideal para filtro y prensa francesa.', stock: 200, minStock: 40, price: 2200, category: 'Molido', weight: '500g', origin: 'Colombia/Brasil' },
  { id: 'p7', name: 'G4 Grano Entero', description: 'Granos enteros para moler al momento. Frescura máxima.', stock: 60, minStock: 15, price: 3500, category: 'Grano', weight: '1kg', origin: 'Etiopía' },
  { id: 'p8', name: 'G4 Edición Limitada', description: 'Micro-lote de temporada. Perfil único, disponibilidad limitada.', stock: 5, minStock: 10, price: 6500, category: 'Edición Limitada', weight: '250g', origin: 'Guatemala' },
];

export const initialOrders: Order[] = [
  {
    id: 'ord-001', branchId: 'b1', branchName: 'Sucursal Centro',
    items: [
      { productId: 'p1', productName: 'G4 Clásico', quantity: 20, unitPrice: 2500 },
      { productId: 'p2', productName: 'G4 Premium', quantity: 10, unitPrice: 4200 },
    ],
    total: 92000, status: 'Pendiente',
    createdAt: '2026-04-01T09:30:00', updatedAt: '2026-04-01T09:30:00',
  },
  {
    id: 'ord-002', branchId: 'b2', branchName: 'Sucursal Norte',
    items: [
      { productId: 'p3', productName: 'G4 Intenso', quantity: 15, unitPrice: 2800 },
      { productId: 'p6', productName: 'G4 Molido Suave', quantity: 30, unitPrice: 2200 },
    ],
    total: 108000, status: 'En Proceso',
    createdAt: '2026-04-01T10:15:00', updatedAt: '2026-04-01T11:00:00',
  },
  {
    id: 'ord-003', branchId: 'b4', branchName: 'Sucursal Bolivia',
    items: [
      { productId: 'p1', productName: 'G4 Clásico', quantity: 50, unitPrice: 2500 },
      { productId: 'p7', productName: 'G4 Grano Entero', quantity: 20, unitPrice: 3500 },
    ],
    total: 195000, status: 'En Camino',
    createdAt: '2026-03-30T14:00:00', updatedAt: '2026-03-31T08:00:00',
  },
  {
    id: 'ord-004', branchId: 'b3', branchName: 'Sucursal Sur',
    items: [
      { productId: 'p4', productName: 'G4 Descafeinado', quantity: 10, unitPrice: 3100 },
    ],
    total: 31000, status: 'Entregado',
    createdAt: '2026-03-28T08:45:00', updatedAt: '2026-03-29T16:30:00',
  },
  {
    id: 'ord-005', branchId: 'b5', branchName: 'Sucursal La Paz',
    items: [
      { productId: 'p5', productName: 'G4 Orgánico', quantity: 25, unitPrice: 4800 },
      { productId: 'p8', productName: 'G4 Edición Limitada', quantity: 5, unitPrice: 6500 },
    ],
    total: 152500, status: 'Pendiente',
    createdAt: '2026-04-01T16:20:00', updatedAt: '2026-04-01T16:20:00',
  },
  {
    id: 'ord-006', branchId: 'b1', branchName: 'Sucursal Centro',
    items: [
      { productId: 'p6', productName: 'G4 Molido Suave', quantity: 40, unitPrice: 2200 },
    ],
    total: 88000, status: 'Cancelado',
    createdAt: '2026-03-25T11:00:00', updatedAt: '2026-03-25T14:00:00',
  },
];

export const initialShipments: Shipment[] = [
  {
    id: 'shp-001', orderId: 'ord-003', operatorId: 'u2', operatorName: 'Carlos Mendoza',
    branchName: 'Sucursal Bolivia', currentStatus: 'En Viaje',
    tracking: [
      { status: 'Depósitos', timestamp: '2026-03-30T14:30:00', note: 'Paquete preparado en depósito central' },
      { status: 'Retirado', timestamp: '2026-03-30T16:00:00', note: 'Retirado por operario' },
      { status: 'Centro de Distribución', timestamp: '2026-03-31T08:00:00', note: 'Ingresó al centro de distribución BA' },
      { status: 'En Viaje', timestamp: '2026-03-31T10:00:00', note: 'En tránsito hacia zona fronteriza' },
    ],
    createdAt: '2026-03-30T14:30:00',
  },
  {
    id: 'shp-002', orderId: 'ord-002', operatorId: 'u3', operatorName: 'María López',
    branchName: 'Sucursal Norte', currentStatus: 'Retirado',
    tracking: [
      { status: 'Depósitos', timestamp: '2026-04-01T11:00:00', note: 'Paquete en depósito' },
      { status: 'Retirado', timestamp: '2026-04-01T13:30:00', note: 'Retirado del depósito' },
    ],
    createdAt: '2026-04-01T11:00:00',
  },
  {
    id: 'shp-003', orderId: 'ord-004', operatorId: 'u4', operatorName: 'Jorge Ruiz',
    branchName: 'Sucursal Sur', currentStatus: 'Entregado',
    tracking: [
      { status: 'Depósitos', timestamp: '2026-03-28T09:00:00' },
      { status: 'Retirado', timestamp: '2026-03-28T10:30:00' },
      { status: 'Centro de Distribución', timestamp: '2026-03-28T14:00:00' },
      { status: 'En Viaje', timestamp: '2026-03-28T16:00:00' },
      { status: 'Aduana', timestamp: '2026-03-29T08:00:00' },
      { status: 'Argentina', timestamp: '2026-03-29T12:00:00' },
      { status: 'Bolivia', timestamp: '2026-03-29T14:00:00' },
      { status: 'Entregado', timestamp: '2026-03-29T16:30:00', note: 'Entregado en sucursal destino' },
    ],
    createdAt: '2026-03-28T09:00:00',
  },
];

const today = new Date();
const getDate = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

export const initialShifts: ShiftAssignment[] = [
  { operatorId: 'u2', operatorName: 'Carlos Mendoza', day: getDate(0), shift: 'Mañana' },
  { operatorId: 'u3', operatorName: 'María López', day: getDate(0), shift: 'Tarde' },
  { operatorId: 'u4', operatorName: 'Jorge Ruiz', day: getDate(0), shift: 'Noche' },
  { operatorId: 'u2', operatorName: 'Carlos Mendoza', day: getDate(1), shift: 'Mañana' },
  { operatorId: 'u3', operatorName: 'María López', day: getDate(1), shift: 'Mañana' },
  { operatorId: 'u4', operatorName: 'Jorge Ruiz', day: getDate(2), shift: 'Tarde' },
  { operatorId: 'u2', operatorName: 'Carlos Mendoza', day: getDate(3), shift: 'Noche' },
  { operatorId: 'u3', operatorName: 'María López', day: getDate(4), shift: 'Mañana' },
];

export const initialStockMovements: StockMovement[] = [
  { id: 'sm1', productId: 'p1', productName: 'G4 Clásico', type: 'entrada', quantity: 100, date: '2026-03-28T10:00:00', note: 'Reabastecimiento mensual' },
  { id: 'sm2', productId: 'p3', productName: 'G4 Intenso', type: 'salida', quantity: 30, date: '2026-03-29T14:00:00', note: 'Pedido ord-002' },
  { id: 'sm3', productId: 'p5', productName: 'G4 Orgánico', type: 'salida', quantity: 15, date: '2026-03-30T09:00:00', note: 'Pedido ord-005' },
  { id: 'sm4', productId: 'p8', productName: 'G4 Edición Limitada', type: 'entrada', quantity: 20, date: '2026-03-25T08:00:00', note: 'Nuevo lote de temporada' },
  { id: 'sm5', productId: 'p8', productName: 'G4 Edición Limitada', type: 'salida', quantity: 15, date: '2026-03-31T11:00:00', note: 'Distribución a sucursales' },
];

// ============================================
// FINANCIAL DATA
// ============================================

export const initialInvoices: Invoice[] = [
  {
    id: 'INV-2026-001', orderId: 'ord-001', branchId: 'b1', branchName: 'Sucursal Centro',
    items: [
      { productId: 'p1', productName: 'G4 Clásico', quantity: 20, unitPrice: 2500, subtotal: 50000 },
      { productId: 'p2', productName: 'G4 Premium', quantity: 10, unitPrice: 4200, subtotal: 42000 },
    ],
    subtotal: 92000, tax: 19320, discount: 0, total: 111320,
    paymentStatus: 'Pendiente', paymentMethod: 'Crédito 30d',
    issuedAt: '2026-04-01T09:30:00', dueDate: '2026-05-01T09:30:00',
  },
  {
    id: 'INV-2026-002', orderId: 'ord-002', branchId: 'b2', branchName: 'Sucursal Norte',
    items: [
      { productId: 'p3', productName: 'G4 Intenso', quantity: 15, unitPrice: 2800, subtotal: 42000 },
      { productId: 'p6', productName: 'G4 Molido Suave', quantity: 30, unitPrice: 2200, subtotal: 66000 },
    ],
    subtotal: 108000, tax: 22680, discount: 5400, total: 125280,
    paymentStatus: 'Pagada', paymentMethod: 'Transferencia',
    issuedAt: '2026-04-01T10:15:00', dueDate: '2026-04-15T10:15:00', paidAt: '2026-04-01T18:00:00',
  },
  {
    id: 'INV-2026-003', orderId: 'ord-003', branchId: 'b4', branchName: 'Sucursal Bolivia',
    items: [
      { productId: 'p1', productName: 'G4 Clásico', quantity: 50, unitPrice: 2500, subtotal: 125000 },
      { productId: 'p7', productName: 'G4 Grano Entero', quantity: 20, unitPrice: 3500, subtotal: 70000 },
    ],
    subtotal: 195000, tax: 40950, discount: 9750, total: 226200,
    paymentStatus: 'Pendiente', paymentMethod: 'Crédito 60d',
    issuedAt: '2026-03-30T14:00:00', dueDate: '2026-05-30T14:00:00',
  },
  {
    id: 'INV-2026-004', orderId: 'ord-004', branchId: 'b3', branchName: 'Sucursal Sur',
    items: [
      { productId: 'p4', productName: 'G4 Descafeinado', quantity: 10, unitPrice: 3100, subtotal: 31000 },
    ],
    subtotal: 31000, tax: 6510, discount: 0, total: 37510,
    paymentStatus: 'Pagada', paymentMethod: 'Efectivo',
    issuedAt: '2026-03-28T08:45:00', dueDate: '2026-03-28T08:45:00', paidAt: '2026-03-28T08:45:00',
  },
  {
    id: 'INV-2026-005', orderId: 'ord-005', branchId: 'b5', branchName: 'Sucursal La Paz',
    items: [
      { productId: 'p5', productName: 'G4 Orgánico', quantity: 25, unitPrice: 4800, subtotal: 120000 },
      { productId: 'p8', productName: 'G4 Edición Limitada', quantity: 5, unitPrice: 6500, subtotal: 32500 },
    ],
    subtotal: 152500, tax: 32025, discount: 7625, total: 176900,
    paymentStatus: 'Vencida', paymentMethod: 'Crédito 30d',
    issuedAt: '2026-02-28T16:20:00', dueDate: '2026-03-28T16:20:00',
  },
  {
    id: 'INV-2026-006', orderId: 'ord-006', branchId: 'b1', branchName: 'Sucursal Centro',
    items: [
      { productId: 'p6', productName: 'G4 Molido Suave', quantity: 40, unitPrice: 2200, subtotal: 88000 },
    ],
    subtotal: 88000, tax: 18480, discount: 0, total: 106480,
    paymentStatus: 'Pagada', paymentMethod: 'Transferencia',
    issuedAt: '2026-03-15T11:00:00', dueDate: '2026-03-30T11:00:00', paidAt: '2026-03-20T09:00:00',
  },
  {
    id: 'INV-2026-007', orderId: '', branchId: 'b2', branchName: 'Sucursal Norte',
    items: [
      { productId: 'p1', productName: 'G4 Clásico', quantity: 35, unitPrice: 2500, subtotal: 87500 },
      { productId: 'p4', productName: 'G4 Descafeinado', quantity: 15, unitPrice: 3100, subtotal: 46500 },
    ],
    subtotal: 134000, tax: 28140, discount: 6700, total: 155440,
    paymentStatus: 'Parcial', paymentMethod: 'Cheque',
    issuedAt: '2026-03-10T09:00:00', dueDate: '2026-04-10T09:00:00',
  },
  {
    id: 'INV-2026-008', orderId: '', branchId: 'b4', branchName: 'Sucursal Bolivia',
    items: [
      { productId: 'p2', productName: 'G4 Premium', quantity: 30, unitPrice: 4200, subtotal: 126000 },
      { productId: 'p5', productName: 'G4 Orgánico', quantity: 20, unitPrice: 4800, subtotal: 96000 },
      { productId: 'p7', productName: 'G4 Grano Entero', quantity: 10, unitPrice: 3500, subtotal: 35000 },
    ],
    subtotal: 257000, tax: 53970, discount: 12850, total: 298120,
    paymentStatus: 'Pagada', paymentMethod: 'Transferencia',
    issuedAt: '2026-02-15T10:00:00', dueDate: '2026-03-15T10:00:00', paidAt: '2026-03-10T14:00:00',
  },
];

export const initialMonthlyRevenue: MonthlyRevenue[] = [
  { month: '2025-11', monthLabel: 'Nov', revenue: 1450000, costs: 870000, profit: 580000, orders: 18, avgTicket: 80556 },
  { month: '2025-12', monthLabel: 'Dic', revenue: 2180000, costs: 1100000, profit: 1080000, orders: 28, avgTicket: 77857 },
  { month: '2026-01', monthLabel: 'Ene', revenue: 1680000, costs: 920000, profit: 760000, orders: 22, avgTicket: 76364 },
  { month: '2026-02', monthLabel: 'Feb', revenue: 1920000, costs: 980000, profit: 940000, orders: 24, avgTicket: 80000 },
  { month: '2026-03', monthLabel: 'Mar', revenue: 2350000, costs: 1150000, profit: 1200000, orders: 31, avgTicket: 75806 },
  { month: '2026-04', monthLabel: 'Abr', revenue: 580000, costs: 310000, profit: 270000, orders: 6, avgTicket: 96667 },
];

export const initialDailyRevenue: DailyRevenue[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const base = 50000 + Math.random() * 120000;
  const weekend = d.getDay() === 0 || d.getDay() === 6;
  return {
    date: d.toISOString().split('T')[0],
    dateLabel: `${d.getDate()}/${d.getMonth() + 1}`,
    revenue: Math.round(weekend ? base * 0.4 : base),
    orders: Math.round(weekend ? 1 : 1 + Math.random() * 3),
  };
});

export const initialBranchRevenue: BranchRevenue[] = [
  { branchId: 'b1', branchName: 'Sucursal Centro', revenue: 2850000, orders: 35, percentage: 28.5 },
  { branchId: 'b2', branchName: 'Sucursal Norte', revenue: 2100000, orders: 26, percentage: 21.0 },
  { branchId: 'b3', branchName: 'Sucursal Sur', revenue: 1200000, orders: 15, percentage: 12.0 },
  { branchId: 'b4', branchName: 'Sucursal Bolivia', revenue: 2500000, orders: 30, percentage: 25.0 },
  { branchId: 'b5', branchName: 'Sucursal La Paz', revenue: 1350000, orders: 18, percentage: 13.5 },
];

export const initialProductRevenue: ProductRevenue[] = [
  { productId: 'p1', productName: 'G4 Clásico', revenue: 2750000, unitsSold: 1100, percentage: 27.5 },
  { productId: 'p2', productName: 'G4 Premium', revenue: 1890000, unitsSold: 450, percentage: 18.9 },
  { productId: 'p6', productName: 'G4 Molido Suave', revenue: 1540000, unitsSold: 700, percentage: 15.4 },
  { productId: 'p7', productName: 'G4 Grano Entero', revenue: 1050000, unitsSold: 300, percentage: 10.5 },
  { productId: 'p5', productName: 'G4 Orgánico', revenue: 960000, unitsSold: 200, percentage: 9.6 },
  { productId: 'p3', productName: 'G4 Intenso', revenue: 756000, unitsSold: 270, percentage: 7.6 },
  { productId: 'p4', productName: 'G4 Descafeinado', revenue: 620000, unitsSold: 200, percentage: 6.2 },
  { productId: 'p8', productName: 'G4 Edición Limitada', revenue: 434000, unitsSold: 66, percentage: 4.3 },
];

// ============================================
// FISCAL DOCUMENTS
// ============================================

export type FiscalDocType = 'Factura A' | 'Factura B' | 'Factura C' | 'Nota de Crédito';
export type FiscalDocCategory = 'Venta' | 'Compra';
export type FiscalPaymentStatus = 'Pagado' | 'Pendiente';

export interface FiscalDocument {
  id: string; // F-001
  numero: string; // 0001-00001234
  tipo: FiscalDocType;
  categoria: FiscalDocCategory;
  emisor: string; // Nombre del proveedor o cliente
  cuit: string;
  fechaEmision: string;
  netoGrabado: number;
  iva: number;
  total: number;
  estado: FiscalPaymentStatus;
  archivoUrl?: string; // Simulacro
}

export const initialFiscalDocuments: FiscalDocument[] = [
  {
    id: 'F-001', numero: '0001-00001234', tipo: 'Factura A', categoria: 'Venta',
    emisor: 'Distribuidora Norte S.A.', cuit: '30-71234567-8',
    fechaEmision: '2026-03-10T10:00:00', netoGrabado: 100000, iva: 21000, total: 121000,
    estado: 'Pagado'
  },
  {
    id: 'F-002', numero: '0001-00001235', tipo: 'Factura B', categoria: 'Venta',
    emisor: 'Consumidor Final', cuit: '20-12345678-9',
    fechaEmision: '2026-03-12T14:30:00', netoGrabado: 25000, iva: 5250, total: 30250,
    estado: 'Pagado'
  },
  {
    id: 'F-003', numero: '0003-00045612', tipo: 'Factura A', categoria: 'Compra',
    emisor: 'Insumos Cafeteros S.R.L.', cuit: '30-98765432-1',
    fechaEmision: '2026-03-15T09:15:00', netoGrabado: 45000, iva: 9450, total: 54450,
    estado: 'Pendiente'
  },
  {
    id: 'F-004', numero: '0002-00000890', tipo: 'Factura C', categoria: 'Compra',
    emisor: 'Logística Express', cuit: '27-87654321-4',
    fechaEmision: '2026-03-20T11:45:00', netoGrabado: 32000, iva: 0, total: 32000,
    estado: 'Pagado'
  },
  {
    id: 'F-005', numero: '0001-00001236', tipo: 'Factura A', categoria: 'Venta',
    emisor: 'Cafetería El Faro', cuit: '30-22334455-6',
    fechaEmision: '2026-04-01T08:00:00', netoGrabado: 150000, iva: 31500, total: 181500,
    estado: 'Pendiente'
  }
];
