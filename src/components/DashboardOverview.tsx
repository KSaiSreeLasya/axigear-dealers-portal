import React from 'react';
import { 
  ShoppingBag, 
  CalendarCheck, 
  Boxes, 
  Wrench, 
  Users, 
  FileText,
  Building2
} from 'lucide-react';
import { InventoryItem, Sale, Employee, AttendanceRecord, ServiceTicket } from '../types';

interface DashboardOverviewProps {
  currentDealer: any;
  inventory: InventoryItem[];
  sales: Sale[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  tickets: ServiceTicket[];
  setActiveTab: (tab: string) => void;
  onQuickAction: (action: 'sale' | 'ticket') => void;
}

export default function DashboardOverview({
  currentDealer,
  inventory,
  sales,
  employees,
  attendance,
  tickets,
  setActiveTab,
  onQuickAction
}: DashboardOverviewProps) {
  
  // Custom Card items to exactly match Image 1
  const dashboardCards = [
    {
      id: 'sales',
      title: 'SALES',
      description: 'Manage account entries and invoices.',
      icon: ShoppingBag,
      color: {
        bg: 'bg-emerald-50 border border-emerald-100',
        iconColor: 'text-emerald-700',
        cardBorderActive: 'border-emerald-600 hover:border-emerald-600 shadow'
      },
      tab: 'sales'
    },
    {
      id: 'attendance',
      title: 'ATTENDANCE',
      description: 'Mark daily attendance and track status.',
      icon: CalendarCheck,
      color: {
        bg: 'bg-blue-50 border border-blue-100',
        iconColor: 'text-blue-600',
        cardBorderActive: 'hover:border-blue-500'
      },
      tab: 'attendance'
    },
    {
      id: 'inventory',
      title: 'INVENTORY',
      description: 'Manage vehicle stock, battery count and closing stock.',
      icon: Boxes,
      color: {
        bg: 'bg-amber-50 border border-amber-150',
        iconColor: 'text-amber-700',
        cardBorderActive: 'hover:border-amber-500'
      },
      tab: 'inventory'
    },
    {
      id: 'service',
      title: 'SERVICE',
      description: 'Create and manage service invoices with PDF export.',
      icon: Wrench,
      color: {
        bg: 'bg-orange-50 border border-orange-100',
        iconColor: 'text-orange-600',
        cardBorderActive: 'hover:border-orange-500'
      },
      tab: 'service'
    },
    {
      id: 'dealers',
      title: 'DEALERS',
      description: 'Manage dealers and their products.',
      icon: Users,
      color: {
        bg: 'bg-purple-50 border border-purple-100',
        iconColor: 'text-purple-600',
        cardBorderActive: 'hover:border-purple-500'
      },
      tab: 'dealers'
    },
    {
      id: 'dealer_invoice',
      title: 'DEALER INVOICE',
      description: 'Create and manage dealer product invoices.',
      icon: FileText,
      color: {
        bg: 'bg-cyan-50 border border-cyan-100',
        iconColor: 'text-cyan-600',
        cardBorderActive: 'hover:border-cyan-500'
      },
      tab: 'dealer_invoice'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-4">
      {/* Welcome banner suited for light simple theme */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-950">
              Welcome to <span className="text-emerald-700">{currentDealer.name}</span>
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">
              Operations manager: <strong className="text-gray-800 font-semibold">{currentDealer.managerName}</strong> • Station Code: <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded text-emerald-800 font-bold">{currentDealer.code}</span>
            </p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-xs text-gray-400 font-mono block">TERMINAL LOCAL TIME</span>
          <span className="text-sm font-bold text-gray-800 font-mono">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Grid container mirroring Image 1 */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardCards.map((card) => {
            const Icon = card.icon;
            // The first item (Sales) has a green border explicitly in Image 1
            const isFirst = card.id === 'sales';
            const borderOutline = isFirst 
              ? 'border-emerald-600/90 shadow-sm' 
              : 'border-gray-200/80 hover:shadow';

            return (
              <div
                id={`dashboard-card-${card.id}`}
                key={card.id}
                onClick={() => setActiveTab(card.tab)}
                className={`group bg-white rounded-xl ${borderOutline} border p-6 flex items-start gap-4 transition-all duration-150 cursor-pointer hover:translate-y-[-2px]`}
              >
                {/* Icon box */}
                <div className={`${card.color.bg} w-12 h-12 rounded-xl shrink-0 flex items-center justify-center transition-all duration-200 group-hover:scale-105`}>
                  <Icon className={`${card.color.iconColor} w-6 h-6`} />
                </div>

                {/* Text details */}
                <div className="space-y-1">
                  <h3 className="font-sans font-bold text-gray-900 tracking-tight text-base uppercase">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-[11px] font-sans md:text-xs leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brief Quick Information Box */}
      <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <div className="text-gray-500 font-medium">
          Logged into <strong className="text-gray-800">AXIGEAR Syndicate Terminal Protocol</strong>. Access multi-channel dealer records isolated by branch location.
        </div>
        <div className="flex gap-4 font-mono font-bold text-emerald-800">
          <span>STABLE CONNECTED</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>V2.4</span>
          </span>
        </div>
      </div>
    </div>
  );
}
