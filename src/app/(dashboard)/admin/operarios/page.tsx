'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import type { ShiftType } from '@/data/mockData';

const SHIFTS: ShiftType[] = ['Mañana', 'Tarde', 'Noche'];
const SHIFT_COLORS: Record<ShiftType, { bg: string; text: string; border: string }> = {
  'Mañana': { bg: 'bg-warning-bg', text: 'text-warning', border: 'border-warning/20' },
  'Tarde': { bg: 'bg-info-bg', text: 'text-info', border: 'border-info/20' },
  'Noche': { bg: 'bg-surface-hover', text: 'text-text-secondary', border: 'border-border-primary' },
};

function getWeekDays(offsetWeek = 0) {
  const today = new Date();
  const monday = new Date(today);
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(today.getDate() + diff + (offsetWeek * 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return { date: d.toISOString().split('T')[0], dayName: dayNames[d.getDay()], dayNum: d.getDate() };
  });
}

interface AssignModalData {
  day: string;
  dayLabel: string;
  shift: ShiftType;
}

export default function OperariosPage() {
  const { operators, shifts, addOperator, toggleOperator, assignShift, removeShift } = useData();
  const [weekOffset, setWeekOffset] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [assignModal, setAssignModal] = useState<AssignModalData | null>(null);

  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const activeOperators = operators.filter(o => o.active);

  const getShift = (operatorId: string, day: string, shift: ShiftType) => {
    return shifts.find(s => s.operatorId === operatorId && s.day === day && s.shift === shift);
  };

  const handleCellClick = (operatorId: string, operatorName: string, day: string, shift: ShiftType) => {
    const existing = getShift(operatorId, day, shift);
    if (existing) {
      removeShift(operatorId, day, shift);
    } else {
      assignShift({ operatorId, operatorName, day, shift });
    }
  };

  // Open assign modal for "all" view
  const handleEmptyCellClick = (day: string, dayLabel: string, shift: ShiftType) => {
    setAssignModal({ day, dayLabel, shift });
  };

  // Get assigned operators for a cell
  const getCellAssigned = (day: string, shift: ShiftType) => {
    const visibleOps = selectedOperator === 'all' ? activeOperators : activeOperators.filter(o => o.id === selectedOperator);
    return visibleOps.filter(op => getShift(op.id, day, shift));
  };

  // Get unassigned operators for a cell (for the assign modal)
  const getUnassignedForCell = (day: string, shift: ShiftType) => {
    return activeOperators.filter(op => !getShift(op.id, day, shift));
  };

  const handleAddOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newEmail) {
      addOperator(newName, newEmail);
      setNewName('');
      setNewEmail('');
      setShowAddModal(false);
    }
  };

  // Summary stats
  const totalShiftsThisWeek = weekDays.reduce((acc, day) => {
    return acc + SHIFTS.reduce((a, shift) => a + activeOperators.filter(op => getShift(op.id, day.date, shift)).length, 0);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gestión de Operarios</h1>
          <p className="text-sm text-text-muted mt-1">Alta, baja y asignación de turnos semanales</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-g4-red-dark text-white text-sm font-semibold hover:shadow-lg hover:shadow-g4-red/30 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Operario
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in delay-1">
        <div className="bg-surface-card border border-border-primary rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{operators.length}</p>
          <p className="text-xs text-text-muted">Total Operarios</p>
        </div>
        <div className="bg-surface-card border border-border-primary rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-success">{activeOperators.length}</p>
          <p className="text-xs text-text-muted">Activos</p>
        </div>
        <div className="bg-surface-card border border-border-primary rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-danger">{operators.length - activeOperators.length}</p>
          <p className="text-xs text-text-muted">Inactivos</p>
        </div>
        <div className="bg-surface-card border border-border-primary rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-info">{totalShiftsThisWeek}</p>
          <p className="text-xs text-text-muted">Turnos esta semana</p>
        </div>
      </div>

      {/* Operators List */}
      <div className="bg-surface-card border border-border-primary rounded-xl p-6 animate-fade-in delay-2">
        <h3 className="text-base font-semibold text-text-primary mb-4">Operarios ({operators.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {operators.map(op => (
            <div key={op.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              op.active
                ? 'border-border-primary bg-surface-primary/50 hover:border-border-secondary'
                : 'border-border-primary/50 bg-surface-primary/20 opacity-60'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                  op.active
                    ? 'bg-gradient-to-br from-g4-red to-g4-red-dark text-white'
                    : 'bg-surface-hover text-text-muted'
                }`}>
                  {op.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{op.name}</p>
                  <p className="text-xs text-text-muted">{op.email || 'Sin email'}</p>
                </div>
              </div>
              <button
                onClick={() => toggleOperator(op.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  op.active
                    ? 'bg-danger-bg text-danger hover:bg-danger/20'
                    : 'bg-success-bg text-success hover:bg-success/20'
                }`}
              >
                {op.active ? 'Dar de baja' : 'Reactivar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="bg-surface-card border border-border-primary rounded-xl p-6 animate-fade-in delay-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-base font-semibold text-text-primary">Calendario de Turnos</h3>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedOperator}
              onChange={e => setSelectedOperator(e.target.value)}
              className="px-3 py-2 rounded-lg bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red"
            >
              <option value="all">Todos los operarios</option>
              {activeOperators.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:bg-surface-hover transition-colors">
                Hoy
              </button>
              <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="text-left px-3 py-3 text-xs font-semibold text-text-muted uppercase w-28">Turno</th>
                {weekDays.map(day => {
                  const isToday = day.date === new Date().toISOString().split('T')[0];
                  return (
                    <th key={day.date} className={`text-center px-2 py-3 ${isToday ? 'bg-g4-red/5 rounded-t-lg' : ''}`}>
                      <p className={`text-xs font-semibold ${isToday ? 'text-g4-red' : 'text-text-muted'}`}>{day.dayName}</p>
                      <p className={`text-lg font-bold ${isToday ? 'text-g4-red' : 'text-text-primary'}`}>{day.dayNum}</p>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {SHIFTS.map(shift => (
                <tr key={shift} className="border-t border-border-primary/50">
                  <td className="px-3 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${SHIFT_COLORS[shift].bg} ${SHIFT_COLORS[shift].text}`}>
                      {shift}
                    </span>
                  </td>
                  {weekDays.map(day => {
                    const isToday = day.date === new Date().toISOString().split('T')[0];
                    const assigned = getCellAssigned(day.date, shift);
                    const hasUnassigned = getUnassignedForCell(day.date, shift).length > 0;

                    return (
                      <td key={day.date} className={`px-1 py-2 text-center ${isToday ? 'bg-g4-red/5' : ''}`}>
                        <div className="min-h-[56px] flex flex-col gap-1 items-center justify-center">
                          {assigned.map(op => (
                            <button
                              key={op.id}
                              onClick={() => handleCellClick(op.id, op.name, day.date, shift)}
                              className="w-full px-2 py-1 rounded-md bg-g4-red/15 text-g4-red text-[11px] font-medium hover:bg-g4-red/25 transition-colors truncate flex items-center gap-1 justify-center"
                              title={`Click para quitar a ${op.name}`}
                            >
                              <span className="truncate">{op.name.split(' ')[0]}</span>
                              <svg className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          ))}
                          {/* Assign button: works in both "all" and single-operator mode */}
                          {hasUnassigned && (
                            <button
                              onClick={() => {
                                if (selectedOperator !== 'all') {
                                  // Single operator: assign directly
                                  const op = activeOperators.find(o => o.id === selectedOperator);
                                  if (op && !getShift(op.id, day.date, shift)) {
                                    handleCellClick(op.id, op.name, day.date, shift);
                                  }
                                } else {
                                  // All operators: open assign modal
                                  handleEmptyCellClick(day.date, `${day.dayName} ${day.dayNum}`, shift);
                                }
                              }}
                              className="w-full px-2 py-1.5 rounded-md border border-dashed border-border-primary text-text-muted text-[11px] hover:border-g4-red hover:text-g4-red transition-colors"
                            >
                              + Asignar
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border-primary/50">
          <span className="text-xs text-text-muted">💡 Hacé click en &quot;+ Asignar&quot; para agregar operarios o en un nombre para quitarlo</span>
          <div className="flex items-center gap-3 ml-auto">
            {SHIFTS.map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${SHIFT_COLORS[s].bg} border ${SHIFT_COLORS[s].border}`} />
                <span className="text-[11px] text-text-muted">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assign Operator Modal — for "All" view */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-card border border-border-primary rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary">Asignar Turno</h3>
              <button onClick={() => setAssignModal(null)} className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors">
                <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-surface-primary/50 border border-border-primary">
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${SHIFT_COLORS[assignModal.shift].bg} ${SHIFT_COLORS[assignModal.shift].text}`}>
                {assignModal.shift}
              </span>
              <span className="text-sm text-text-primary font-medium">{assignModal.dayLabel}</span>
            </div>
            <p className="text-sm text-text-muted mb-3">Seleccioná los operarios a asignar:</p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {activeOperators.map(op => {
                const isAssigned = !!getShift(op.id, assignModal.day, assignModal.shift);
                return (
                  <button
                    key={op.id}
                    onClick={() => handleCellClick(op.id, op.name, assignModal.day, assignModal.shift)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isAssigned
                        ? 'border-g4-red/30 bg-g4-red/10'
                        : 'border-border-primary hover:border-border-secondary bg-surface-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isAssigned ? 'bg-g4-red text-white' : 'bg-surface-hover text-text-muted'
                      }`}>
                        {op.name.charAt(0)}
                      </div>
                      <span className={`text-sm font-medium ${isAssigned ? 'text-g4-red' : 'text-text-primary'}`}>
                        {op.name}
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      isAssigned ? 'border-g4-red bg-g4-red' : 'border-border-secondary'
                    }`}>
                      {isAssigned && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setAssignModal(null)}
              className="w-full mt-4 px-4 py-2.5 rounded-xl bg-g4-red-dark text-white text-sm font-medium hover:shadow-lg hover:shadow-g4-red/30 transition-all"
            >
              Listo
            </button>
          </div>
        </div>
      )}

      {/* Add Operator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-card border border-border-primary rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="text-lg font-bold text-text-primary mb-4">Nuevo Operario</h3>
            <form onSubmit={handleAddOperator} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Nombre completo</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red transition-colors"
                  placeholder="Nombre del operario" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-input border border-border-primary text-text-primary text-sm focus:outline-none focus:border-g4-red transition-colors"
                  placeholder="operario@g4company.com" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border-primary text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-g4-red-dark text-white text-sm font-medium hover:shadow-lg hover:shadow-g4-red/30 transition-all">
                  Dar de Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
