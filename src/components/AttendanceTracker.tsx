import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  X, 
  Clock, 
  UserCheck, 
  ArrowLeftRight,
  Plus, 
  Search, 
  CalendarDays,
  Check,
  AlertCircle
} from 'lucide-react';
import { Employee, AttendanceRecord, Dealer, AttendanceStatus } from '../types';

interface AttendanceTrackerProps {
  currentDealer: Dealer;
  employees: Employee[];
  attendance: AttendanceRecord[];
  onSaveAttendanceBatch: (records: AttendanceRecord[]) => void;
}

export default function AttendanceTracker({
  currentDealer,
  employees,
  attendance,
  onSaveAttendanceBatch
}: AttendanceTrackerProps) {
  
  const activeEmployees = employees.filter(emp => emp.dealerId === currentDealer.id && emp.status === 'Active');

  // Today prefilled string
  const todayStr = '2026-06-22';

  // --- Quick Entry Form States ---
  const [quickEmpId, setQuickEmpId] = useState(activeEmployees[0]?.id || '');
  const [quickDate, setQuickDate] = useState(todayStr);
  const [quickTime, setQuickTime] = useState('09:15');
  const [quickStatus, setQuickStatus] = useState<AttendanceStatus>('Present');
  const [quickRemark, setQuickRemark] = useState('');

  // Handle Quick Entry Submit
  const handleQuickSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEmpId) {
      alert('Please select an employee.');
      return;
    }

    const targetEmp = activeEmployees.find(emp => emp.id === quickEmpId);
    if (!targetEmp) return;

    const newRecord: AttendanceRecord = {
      id: `att-quick-${targetEmp.id}-${quickDate}`,
      dealerId: currentDealer.id,
      employeeId: quickEmpId,
      employeeName: targetEmp.name,
      date: quickDate,
      status: quickStatus,
      clockIn: quickTime,
      clockOut: '18:00',
      notes: quickRemark || undefined
    };

    onSaveAttendanceBatch([newRecord]);
    setQuickRemark('');
    alert(`Roster check logged for ${targetEmp.name}`);
  };

  // --- Interactive Monthly Calendar setup ---
  // We represent "June 2026", which has 30 days.
  const totalDaysInMonth = 30;
  const daysArray = Array.from({ length: totalDaysInMonth }, (_, index) => index + 1);

  // Helper to retrieve status for a specific employee on a specific day of June
  const getRecordForDay = (empId: string, day: number) => {
    const paddedDay = String(day).padStart(2, '0');
    const targetDate = `2026-06-${paddedDay}`;
    return attendance.find(
      rec => rec.dealerId === currentDealer.id && rec.employeeId === empId && rec.date === targetDate
    );
  };

  // Cycle the status on click
  const handleCellClickStatusCycle = (empId: string, day: number) => {
    const currentRecord = getRecordForDay(empId, day);
    const paddedDay = String(day).padStart(2, '0');
    const targetDate = `2026-06-${paddedDay}`;
    const targetEmp = activeEmployees.find(emp => emp.id === empId);
    if (!targetEmp) return;

    // Cycle order: Present (P) -> Absent (A) -> Leave (L) -> Weekly off (WO) -> Half day (H)
    let nextStatus: AttendanceStatus = 'Present';
    if (currentRecord) {
      if (currentRecord.status === 'Present') nextStatus = 'Absent';
      else if (currentRecord.status === 'Absent') nextStatus = 'Leave';
      else if (currentRecord.status === 'Late') nextStatus = 'Present'; // Handle late boundary
      else if (currentRecord.status === 'Leave') nextStatus = 'Present'; // Loop wrapper
    } else {
      nextStatus = 'Present';
    }

    const updatedRecord: AttendanceRecord = {
      id: currentRecord?.id || `att-cell-${empId}-${targetDate}`,
      dealerId: currentDealer.id,
      employeeId: empId,
      employeeName: targetEmp.name,
      date: targetDate,
      status: nextStatus,
      clockIn: nextStatus === 'Present' ? '09:15' : undefined,
      clockOut: nextStatus === 'Present' ? '18:00' : undefined
    };

    onSaveAttendanceBatch([updatedRecord]);
  };

  // Counts statistics for active row
  const getEmployeeStats = (empId: string) => {
    let presents = 0;
    let woffs = 0;
    let absents = 0;

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const rec = getRecordForDay(empId, day);
      if (rec) {
        if (rec.status === 'Present' || rec.status === 'Late') presents++;
        else if (rec.status === 'Absent') absents++;
        else if (rec.status === 'Leave') absents++; // Leave counts toward rest
      } else {
        // Let's assume day 7, 14, 21, 28 are weekly offs if empty
        if (day % 7 === 0) {
          woffs++;
        } else {
          // Defaults
          presents++;
        }
      }
    }

    return { presents, woffs, absents };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 font-sans">Attendance</h1>
        <p className="text-gray-500 text-xs mt-1">
          Log check-ins and scan the month grid—each row is one team member with payroll summaries on the right.
        </p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Quick entry block */}
        <div className="space-y-6 lg:col-span-1">
          <form onSubmit={handleQuickSave} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">Quick entry</h2>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Employee</label>
                <select
                  required
                  value={quickEmpId}
                  onChange={(e) => setQuickEmpId(e.target.value)}
                  className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none"
                >
                  <option value="">Select Employee</option>
                  {activeEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Date</label>
                  <input
                    type="date"
                    required
                    value={quickDate}
                    onChange={(e) => setQuickDate(e.target.value)}
                    className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Time</label>
                  <input
                    type="time"
                    required
                    value={quickTime}
                    onChange={(e) => setQuickTime(e.target.value)}
                    className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Status</label>
                <select
                  value={quickStatus}
                  onChange={(e) => setQuickStatus(e.target.value as AttendanceStatus)}
                  className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">L Leave</option>
                  <option value="Late">Late-In Entry</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Remark</label>
                <input
                  type="text"
                  placeholder="Optional notes e.g. sick leave"
                  value={quickRemark}
                  onChange={(e) => setQuickRemark(e.target.value)}
                  className="w-full bg-white text-gray-800 border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-850 text-white font-bold py-2.5 px-4 rounded-lg text-xs tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Save attendance
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right column: Interactive Month ledger matching Image 4 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
            
            {/* Header row containing Period selection and Status Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div className="space-y-1">
                <h3 className="font-bold text-gray-950 text-sm uppercase tracking-wide">Employees — monthly attendance</h3>
                
                {/* Visual Legend tags exactly mirroring Image 4 */}
                <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-gray-500 pt-1">
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-750 px-1.5 py-0.5 rounded border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Present</span>
                  </span>
                  <span className="flex items-center gap-1 bg-red-50 text-red-750 px-1.5 py-0.5 rounded border border-red-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-505"></span>
                    <span>Absent</span>
                  </span>
                  <span className="flex items-center gap-1 bg-blue-50 text-blue-750 px-1.5 py-0.5 rounded border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>L Leave</span>
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    <span>WO Weekly off</span>
                  </span>
                </div>
              </div>

              {/* Month selector */}
              <div className="shrink-0 text-right">
                <span className="text-[10px] text-gray-400 font-mono block">ATTENDANCE PERIOD</span>
                <span className="text-xs font-bold text-gray-800 bg-gray-50 border px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>June, 2026</span>
                </span>
              </div>
            </div>

            {/* Scrollable grid table */}
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-center border-collapse text-[11px] font-sans">
                <thead>
                  <tr className="border-b bg-gray-100 font-mono text-[9px] uppercase font-bold text-gray-500">
                    <th className="py-2.5 px-3 text-left bg-white sticky left-0 border-r min-w-[120px]">Employee</th>
                    {daysArray.map(day => (
                      <th key={day} className="py-2 px-1 border-r w-8 shrink-0">{day}</th>
                    ))}
                    <th className="py-2 px-2 border-l font-bold text-emerald-800">NO. OF PRESENTS</th>
                    <th className="py-2 px-2 border-l font-bold text-gray-650">NO. OF W/OS</th>
                    <th className="py-2 px-2 border-l font-bold text-rose-700">NO. OF ABSENTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-[10px]">
                  {activeEmployees.map(emp => {
                    const stats = getEmployeeStats(emp.id);
                    return (
                      <tr key={emp.id} className="hover:bg-gray-50/55">
                        {/* Sticky Name column */}
                        <td className="py-3 px-3 text-left font-bold text-gray-900 bg-white sticky left-0 border-r shadow-[2px_0_5px_rgba(0,0,0,0.02)] min-w-[120px]">
                          {emp.name}
                        </td>

                        {daysArray.map(day => {
                          const record = getRecordForDay(emp.id, day);
                          
                          // Default rendering: day % 7 == 0 is weekly off
                          let isWeeklyOff = day % 7 === 0;
                          let char = 'P';
                          let style = 'bg-emerald-50 text-emerald-800 border-emerald-100';

                          if (record) {
                            if (record.status === 'Present') {
                              char = '✔';
                              style = 'bg-emerald-55 text-emerald-800 border-emerald-200';
                            } else if (record.status === 'Absent') {
                              char = '✖';
                              style = 'bg-red-50 text-red-650 border-red-150';
                            } else if (record.status === 'Leave') {
                              char = 'L';
                              style = 'bg-blue-50 text-blue-650 border-blue-150';
                            } else if (record.status === 'Late') {
                              char = '½';
                              style = 'bg-orange-50 text-orange-650 border-orange-150';
                            }
                          } else {
                            if (isWeeklyOff) {
                              char = 'WO';
                              style = 'bg-gray-100 text-gray-400 border-transparent';
                            } else {
                              char = '✔';
                              style = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                            }
                          }

                          return (
                            <td 
                              key={day} 
                              onClick={() => handleCellClickStatusCycle(emp.id, day)}
                              className="py-1 px-0.5 border-r cursor-pointer select-none transition-colors hover:bg-gray-100"
                              title={`Click to cycle attendance status for June ${day}`}
                            >
                              <div className={`w-6 h-6 mx-auto rounded-full border flex items-center justify-center font-bold text-[9px] ${style}`}>
                                {char}
                              </div>
                            </td>
                          );
                        })}

                        {/* Summary metrics columns on right */}
                        <td className="py-3 px-2 border-l font-bold bg-emerald-50/20 text-emerald-800 font-mono text-center">
                          {stats.presents}
                        </td>
                        <td className="py-3 px-2 border-l font-bold bg-gray-50 text-gray-500 font-mono text-center">
                          {stats.woffs}
                        </td>
                        <td className="py-3 px-2 border-l font-bold bg-rose-50/20 text-rose-700 font-mono text-center">
                          {stats.absents}
                        </td>

                      </tr>
                    );
                  })}
                  {activeEmployees.length === 0 && (
                    <tr>
                      <td colSpan={35} className="py-8 text-center text-gray-400 bg-white">
                        No employees discovered on the active roster. Fill the Employee tab inside portal.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-[10px] text-gray-405 font-sans italic flex items-center gap-1 mt-1 justify-center">
              <AlertCircle className="w-3.5 h-3.5 text-gray-450 shrink-0" />
              <span>Tip: Click any grid cell to instantly cycle that employee's status for the day!</span>
            </div>

          </div>

          {/* Detailed chronological audit log below */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xs font-bold text-gray-950 uppercase tracking-wide">Detailed Logs</h2>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-100 font-mono text-[9px] uppercase font-bold text-gray-500">
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Employee</th>
                    <th className="py-2.5 px-4">Time In</th>
                    <th className="py-2.5 px-4">Time Out</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-700">
                  {attendance.filter(r => r.dealerId === currentDealer.id).slice(0, 15).map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-semibold text-gray-950">{log.date}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-800">{log.employeeName}</td>
                      <td className="py-3 px-4 font-mono">{log.clockIn || '--:--'}</td>
                      <td className="py-3 px-4 font-mono">{log.clockOut || '--:--'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          log.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          log.status === 'Absent' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          'bg-blue-50 text-blue-750 border border-blue-105'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 italic max-w-[140px] truncate">{log.notes || 'None'}</td>
                    </tr>
                  ))}
                  {attendance.filter(r => r.dealerId === currentDealer.id).length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-400">No static chronological logs saved today.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
