import React from 'react';
import { Car, CheckCircle2, Tag, Star, MessageSquare, PlusCircle, ArrowRight, FileEdit } from 'lucide-react';
import { DashboardStats, Vehicle, InquiryMessage } from '../../types';

interface DashboardOverviewProps {
  stats: DashboardStats;
  recentVehicles: Vehicle[];
  recentMessages: InquiryMessage[];
  onSelectTab: (tab: string) => void;
  onEditVehicle: (v: Vehicle) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  recentVehicles,
  recentMessages,
  onSelectTab,
  onEditVehicle
}) => {
  const metricCards = [
    { title: 'Total Vehicles', val: stats.totalVehicles, icon: Car, color: 'text-neutral-200' },
    { title: 'Available Stock', val: stats.availableVehicles, icon: CheckCircle2, color: 'text-emerald-400' },
    { title: 'Sold Vehicles', val: stats.soldVehicles, icon: Tag, color: 'text-red-400' },
    { title: 'Featured Showcase', val: stats.featuredVehicles, icon: Star, color: 'text-amber-400' },
    { title: 'Drafts (Unpublished)', val: stats.draftVehicles, icon: FileEdit, color: 'text-neutral-400' },
    { title: 'New Inquiries', val: stats.newMessages, icon: MessageSquare, color: 'text-sky-400', highlight: stats.newMessages > 0 }
  ];

  return (
    <div className="space-y-8" id="admin-dashboard-overview">
      
      {/* Title & Quick Add Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-red-500 text-xs font-bold uppercase tracking-widest block">
            KANDELA CARS MANAGEMENT
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight font-sans">
            DASHBOARD OVERVIEW
          </h1>
        </div>

        <button
          onClick={() => onSelectTab('add-vehicle')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center space-x-2 shrink-0"
          id="overview-add-vehicle-btn"
        >
          <PlusCircle className="w-4 h-4" />
          <span>ADD NEW VEHICLE</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-neutral-900 border rounded-2xl p-5 flex flex-col justify-between ${
                card.highlight ? 'border-red-600/60 shadow-lg shadow-red-950/40' : 'border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">
                  {card.title}
                </span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className={`text-3xl font-black font-sans ${card.color}`}>
                {card.val}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Section: Recent Inventory & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Inventory Table */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm font-sans flex items-center space-x-2">
              <Car className="w-4 h-4 text-red-500" />
              <span>RECENT INVENTORY ADDITIONS</span>
            </h3>
            <button
              onClick={() => onSelectTab('vehicles')}
              className="text-xs text-red-500 hover:text-red-400 font-bold uppercase flex items-center space-x-1"
            >
              <span>View All ({stats.totalVehicles})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentVehicles.slice(0, 5).map(v => (
              <div
                key={v.id}
                onClick={() => onEditVehicle(v)}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 hover:border-red-600/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={v.primaryImage || v.images?.[0]}
                    alt={v.model}
                    className="w-12 h-9 object-cover rounded bg-neutral-900"
                  />
                  <div className="min-w-0">
                    <span className="text-white text-xs font-bold block truncate group-hover:text-red-400 transition-colors">
                      {v.make} {v.model} ({v.year})
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      {v.fuelType} • {v.mileage.toLocaleString()} KM
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-red-400 text-xs font-black block font-sans">
                    ETB {v.price.toLocaleString()}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                      v.status === 'Available'
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-red-950 text-red-400'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries Panel */}
        <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm font-sans flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-red-500" />
              <span>LATEST INQUIRIES</span>
            </h3>
            <button
              onClick={() => onSelectTab('messages')}
              className="text-xs text-red-500 hover:text-red-400 font-bold uppercase flex items-center space-x-1"
            >
              <span>Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentMessages.slice(0, 4).map(msg => (
              <div
                key={msg.id}
                onClick={() => onSelectTab('messages')}
                className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer space-y-1 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-bold">{msg.name}</span>
                  {msg.status === 'New' && (
                    <span className="bg-red-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-neutral-400 text-xs line-clamp-2">
                  {msg.message}
                </p>
                <span className="text-neutral-500 text-[10px] block">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
