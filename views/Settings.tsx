import React from 'react';
import { AppState } from '../types.ts';
import { User, Shield, Bell, Database, Info, LogOut, ChevronRight, Moon, MessageSquareQuote, Globe } from 'lucide-react';

interface SettingsProps {
  appState: AppState;
  t: any;
  onToggleBiblical: () => void;
  onToggleOnline: () => void;
  onToggleLang: () => void;
  currentLang: string;
}

const Settings: React.FC<SettingsProps> = ({ appState, t, onToggleBiblical, onToggleOnline, onToggleLang, currentLang }) => {
  const sections = [
    {
      title: 'Preferences',
      items: [
        { label: 'Language / Idioma', icon: Globe, value: currentLang.toUpperCase(), action: onToggleLang, color: 'text-blue-500' },
        { label: 'Push Notifications', icon: Bell, value: 'Daily', color: 'text-indigo-500' },
        { label: 'Dark Mode', icon: Moon, value: 'System', color: 'text-slate-500' },
      ]
    },
    {
      title: 'Health Features',
      items: [
        { 
          label: t.biblicalMessages, 
          icon: MessageSquareQuote, 
          action: onToggleBiblical, 
          toggle: appState.showBiblicalMessages,
          color: 'text-amber-500' 
        },
        { 
          label: t.onlineSync, 
          icon: Database, 
          action: onToggleOnline, 
          toggle: appState.isOnline,
          color: 'text-emerald-500' 
        },
      ]
    },
    {
      title: 'Safety & Privacy',
      items: [
        { label: 'Biometric Lock', icon: Shield, toggle: true, color: 'text-rose-500' },
        { label: 'SQLCipher Encryption', icon: Database, value: 'Active', color: 'text-blue-500' },
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold text-slate-800 px-1">{t.more}</h2>

      <div className="material-card p-6 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16"></div>
        <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white relative z-10 shadow-lg shadow-indigo-100">
          <User size={32} />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-slate-800">John Smith</h3>
          <p className="text-xs text-slate-500 font-medium">Free Account (Member)</p>
          <button className="text-indigo-600 text-[10px] font-bold mt-1 uppercase tracking-wider hover:underline">UPGRADE TO PRO</button>
        </div>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">{section.title}</h4>
          <div className="material-card overflow-hidden border border-slate-50">
            {section.items.map((item, i) => (
              <div 
                key={i} 
                onClick={item.action}
                className={`flex items-center justify-between p-4 border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors cursor-pointer group`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-slate-50 ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-600">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.toggle !== undefined ? (
                    <div className={`w-12 h-6 rounded-full relative transition-all ${item.toggle ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.toggle ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400 font-bold uppercase">{item.value}</span>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="py-4 space-y-4">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <Info size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest tracking-tighter">VERSION 1.2.0-MVP-GOLD</span>
        </div>
        <button className="w-full py-5 rounded-[24px] bg-white border border-rose-100 text-rose-500 font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-rose-50 active:scale-95 transition-all">
          <LogOut size={18} />
          Sign Out / Sair
        </button>
      </div>
    </div>
  );
};

export default Settings;