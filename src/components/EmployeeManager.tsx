import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ShieldAlert, Key, ToggleLeft, ToggleRight } from 'lucide-react';
import { Employee, Dealer } from '../types';

interface EmployeeManagerProps {
  currentDealer: Dealer;
  employees: Employee[];
  onAddEmployee: (emp: Omit<Employee, 'id' | 'dealerId'>) => void;
  onUpdateEmployee: (emp: Employee) => void;
}

export default function EmployeeManager({
  currentDealer,
  employees,
  onAddEmployee,
  onUpdateEmployee
}: EmployeeManagerProps) {
  
  // Isolated employees
  const dealerEmployees = employees.filter(emp => emp.dealerId === currentDealer.id);

  // Form states matching Image 11
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empRole, setEmpRole] = useState('Sales');

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empEmail || !empPhone) {
      alert('Employee Name, Email and Phone Number are required.');
      return;
    }

    onAddEmployee({
      name: empName,
      email: empEmail,
      phone: empPhone,
      role: empRole,
      status: 'Active',
      hireDate: new Date().toISOString().split('T')[0]
    });

    setEmpName('');
    setEmpEmail('');
    setEmpPassword('');
    setEmpPhone('');
    setEmpRole('Sales');
    alert('Employee successfully onboarded!');
  };

  const handleToggleStatus = (emp: Employee) => {
    const nextStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
    onUpdateEmployee({
      ...emp,
      status: nextStatus
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 font-sans text-xs">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 font-sans">Admin - Employee Management</h1>
        <p className="text-gray-500 text-xs mt-1">Add employees and manage active/inactive status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Add Employee Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAddEmployeeSubmit} className="bg-white rounded-xl border border-gray-205 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wide">Add Employee</h2>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Employee Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter employee name"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full bg-white text-gray-850 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:border-emerald-650"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Employee Email</label>
                <input
                  type="email"
                  required
                  placeholder="Enter employee email"
                  value={empEmail}
                  onChange={(e) => setEmpEmail(e.target.value)}
                  className="w-full bg-white text-gray-850 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Set Password</label>
                <input
                  type="password"
                  placeholder="Enter initial password"
                  value={empPassword}
                  onChange={(e) => setEmpPassword(e.target.value)}
                  className="w-full bg-white text-gray-850 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="Phone number"
                  value={empPhone}
                  onChange={(e) => setEmpPhone(e.target.value)}
                  className="w-full bg-white text-gray-850 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Role</label>
                <select
                  value={empRole}
                  onChange={(e) => setEmpRole(e.target.value)}
                  className="w-full bg-white text-gray-850 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:border-emerald-650"
                >
                  <option value="Sales">Sales</option>
                  <option value="Admin">Admin</option>
                  <option value="Technician">Technician</option>
                  <option value="Asst. Technician">Asst. Technician</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-850 text-white font-bold py-2.5 px-4 rounded-lg text-xs tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Add Employee
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Employees Registry */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
            <div className="p-4 border-b bg-gray-50">
              <span className="font-bold text-gray-955 uppercase tracking-wide">Employees ({dealerEmployees.length})</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-100 font-mono text-[9px] uppercase font-bold text-gray-500">
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">Email</th>
                    <th className="py-2.5 px-4">Phone</th>
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4">Created</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-700">
                  {dealerEmployees.map((emp) => (
                    <tr key={emp.id} className={`hover:bg-gray-50 ${emp.status === 'Inactive' ? 'opacity-65 bg-gray-50/50' : ''}`}>
                      <td className="py-3.5 px-4 font-bold text-gray-900">{emp.name}</td>
                      <td className="py-3.5 px-4 font-mono select-all text-xs text-gray-500">{emp.email}</td>
                      <td className="py-3.5 px-4 font-mono">{emp.phone}</td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-850">
                        <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-[10px] font-bold">
                          {emp.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          emp.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-400">{emp.hireDate}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(emp)}
                            className={`p-1 rounded text-xs px-2 font-bold cursor-pointer ${
                              emp.status === 'Active' 
                                ? 'text-rose-600 hover:bg-rose-50' 
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={emp.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                          >
                            {emp.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {dealerEmployees.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400">No employees registered on this station.</td>
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
