
import React from 'react';
import { VitalReading, VitalType } from '../types';
import { Activity, Droplets, Thermometer, Heart, User, Wind } from 'lucide-react';

interface DashboardProps {
  readings: VitalReading[];
  t: any;
}

const Dashboard: React.FC<DashboardProps> = ({ readings, t }) => {
  const getLatest = (type: VitalType) => readings.find(r => r.type === type);

  const stats = [
    { type: VitalType.GLUCOSE, icon: Droplets, color: 'text-rose-500', bg: 'bg-rose-50' },
    { type: VitalType.BLOOD_PRESSURE, icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { type: VitalType.HEART_RATE, icon: Heart, color: 'text-orange-500', bg: 'bg-orange-50' },
    { type: VitalType.TEMPERATURE, icon: Thermometer, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { type: VitalType.OXYGEN, icon: Wind, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <div className="bg-indigo-600 p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm opacity-90">{t.goodMorning},</p>
          <h2 className="text-2xl font-bold">John Smith</h2>
          <div className="mt-4 flex gap-4">
            <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
              <Activity size={12} /> Diabetic Type 1
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
              <ShieldCheck size={12} /> Pro Member
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Vital Cards Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {stats.map((stat) => {
          const reading = getLatest(stat.type);
          return (
            <div key={stat.type} className="material-card p-4 flex flex-col justify-between min-w-[140px] h-36 shrink-0">
              <div className="flex justify-between items-start">
                <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                  <stat.icon size={18} />
                </div>
                {reading && <span className="text-lg">{reading.moodEmoji}</span>}
              </div>
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.type}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-800">
                    {reading 
                      ? (reading.type === VitalType.BLOOD_PRESSURE ? `${reading.systolic}/${reading.value}` : reading.value)
                      : '--'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{reading?.unit || ''}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent History Preview */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-800 uppercase tracking-wide text-xs">{t.recentRecords}</h3>
          <button className="text-indigo-600 text-xs font-bold uppercase tracking-wider">{t.seeAll}</button>
        </div>
        <div className="space-y-3">
          {readings.slice(0, 3).map((r) => (
            <div key={r.id} className="material-card p-4 flex items-center justify-between border border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-xl shadow-inner">
                  {r.moodEmoji}
                </div>
                <div>
                  <p className="font-bold text-slate-700 text-sm">{r.type}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">
                    {r.timestamp.toLocaleDateString()} • {r.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">
                  {r.type === VitalType.BLOOD_PRESSURE ? `${r.systolic}/${r.value}` : r.value}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{r.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mock missing icon
const ShieldCheck = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;

export default Dashboard;
