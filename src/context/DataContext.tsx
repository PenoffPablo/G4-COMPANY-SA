'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Order, OrderStatus, Product, Shipment, ShiftAssignment, StockMovement, TrackingStatus, TRACKING_STEPS, User,
  initialOrders, initialProducts, initialShipments, initialShifts, initialStockMovements, initialBranches, initialUsers, Branch,
} from '@/data/mockData';

interface DataContextType {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  branches: Branch[];
  products: Product[];
  updateStock: (productId: string, qty: number, type: 'entrada' | 'salida', note: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  lowStockProducts: Product[];
  shipments: Shipment[];
  advanceShipment: (shipmentId: string, note?: string) => void;
  operators: User[];
  shifts: ShiftAssignment[];
  addOperator: (name: string, email: string) => void;
  toggleOperator: (operatorId: string) => void;
  assignShift: (assignment: ShiftAssignment) => void;
  removeShift: (operatorId: string, day: string, shift: string) => void;
  stockMovements: StockMovement[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [shifts, setShifts] = useState<ShiftAssignment[]>(initialShifts);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [operatorsList, setOperatorsList] = useState<User[]>(
    initialUsers.filter(u => u.role === 'operario')
  );

  // Orders
  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    ));
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'Cancelado' as OrderStatus, updatedAt: new Date().toISOString() } : o
    ));
  }, []);

  // Products
  const updateStock = useCallback((productId: string, qty: number, type: 'entrada' | 'salida', note: string) => {
    setProducts(prev => {
      const product = prev.find(p => p.id === productId);
      const updated = prev.map(p => {
        if (p.id !== productId) return p;
        const newStock = type === 'entrada' ? p.stock + qty : Math.max(0, p.stock - qty);
        return { ...p, stock: newStock };
      });

      if (product) {
        setStockMovements(sm => [...sm, {
          id: `sm${Date.now()}`,
          productId,
          productName: product.name,
          type,
          quantity: qty,
          date: new Date().toISOString(),
          note,
        }]);
      }

      return updated;
    });
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: `p${Date.now()}` }]);
  }, []);

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  // Shipments
  const advanceShipment = useCallback((shipmentId: string, note?: string) => {
    setShipments(prev => prev.map(s => {
      if (s.id !== shipmentId) return s;
      const currentIdx = TRACKING_STEPS.indexOf(s.currentStatus);
      if (currentIdx >= TRACKING_STEPS.length - 1) return s;
      const nextStatus = TRACKING_STEPS[currentIdx + 1];
      return {
        ...s,
        currentStatus: nextStatus,
        tracking: [...s.tracking, {
          status: nextStatus,
          timestamp: new Date().toISOString(),
          note,
        }],
      };
    }));
  }, []);

  // Operators
  const addOperator = useCallback((name: string, email: string) => {
    const newOp: User = {
      id: `u${Date.now()}`,
      name,
      email,
      password: 'oper123',
      role: 'operario',
      active: true,
      createdAt: new Date().toISOString(),
    };
    setOperatorsList(prev => [...prev, newOp]);
  }, []);

  const toggleOperator = useCallback((operatorId: string) => {
    setOperatorsList(prev => prev.map(o =>
      o.id === operatorId ? { ...o, active: !o.active } : o
    ));
  }, []);

  // Shifts
  const assignShift = useCallback((assignment: ShiftAssignment) => {
    setShifts(prev => {
      const exists = prev.some(s =>
        s.operatorId === assignment.operatorId && s.day === assignment.day && s.shift === assignment.shift
      );
      if (exists) return prev;
      return [...prev, assignment];
    });
  }, []);

  const removeShift = useCallback((operatorId: string, day: string, shift: string) => {
    setShifts(prev => prev.filter(s =>
      !(s.operatorId === operatorId && s.day === day && s.shift === shift)
    ));
  }, []);

  return (
    <DataContext.Provider value={{
      orders, updateOrderStatus, cancelOrder,
      branches: initialBranches,
      products, updateStock, addProduct, lowStockProducts,
      shipments, advanceShipment,
      operators: operatorsList, shifts, addOperator, toggleOperator, assignShift, removeShift,
      stockMovements,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
