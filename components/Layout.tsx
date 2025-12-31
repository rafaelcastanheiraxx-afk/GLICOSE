
import React from 'react';
import { View } from '../types';
import { Home, History, BarChart3, BrainCircuit, Settings, Plus, CloudOff, Cloud, RefreshCw } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
  isOnline: boolean;
  t: any;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, isOnline, t }) => {
  const navItems = [
    { id: 'DASHBOARD' as View, icon: Home, label: t.dashboard },
    { id: 'HISTORY' as View, icon: History, label: t.history },
    { id: 'CHARTS' as View, icon: BarChart3, label: t.stats },
    { id: 'INSIGHTS' as View, icon: BrainCircuit, label: t.ai },
    { id: 'SETTINGS' as View, icon: Settings, label: t.more },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F8FAFC] relative overflow-hidden">
      {/* Top Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-white/90 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-50">
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-indigo-900 tracking-tight">{t.appName}</h1>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">SMART HEALTH MONITOR</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
             {isOnline ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Live Sync</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-full">
                 <CloudOff size={10} className="text-slate-400" />
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{t.offlineMode}</span>
              </div>
            )}
          </div>
          <div className="w-9 h-9 rounded-[14px] bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-indigo-50">
            <span className="text-indigo-600 font-black text-xs">JS</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-4 relative no-scrollbar">
        {children}
      </main>

      {/* Floating Action Button */}
      {currentView !== 'NEW_RECORD' && (
        <button
          onClick={() => onNavigate('NEW_RECORD')}
          className="absolute bottom-24 right-6 w-16 h-16 bg-indigo-600 text-white rounded-[24px] shadow-2xl shadow-indigo-300 flex items-center justify-center hover:bg-indigo-700 transition-all hover:scale-110 active:scale-90 z-50 border-4 border-white"
        >
          <Plus size={32} strokeWidth={3} />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex justify-around items-center sticky bottom-0 z-40 pb-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
              currentView === item.id ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <item.icon size={22} strokeWidth={currentView === item.id ? 2.5 : 2} />
            <span className={`text-[10px] font-black uppercase tracking-tighter transition-all ${currentView === item.id ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              {item.label}
            </span>
            {currentView === item.id && (
              <div className="absolute -top-1 w-1 h-1 bg-indigo-600 rounded-full"></div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
