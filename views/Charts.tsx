import React, { useMemo } from 'react';
import { VitalReading, VitalType } from '../types.ts';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ChartsProps {
  readings: VitalReading[];
  t: any;
}

const Charts: React.FC<ChartsProps> = ({ readings, t }) => {
  const chartData = useMemo(() => {
    return readings
      .filter(r => r.type === VitalType.GLUCOSE)
      .slice(0, 7)
      .reverse()
      .map(r => ({
        time: r.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: r.value
      }));
  }, [readings]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-bold text-slate-800">Visual Trends</h2>
        <select className="bg-slate-100 text-xs font-bold p-2 rounded-xl outline-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>

      <div className="material-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800">Glucose (mg/dL)</h3>
            <p className="text-xs text-slate-400">Average: 114 mg/dL</p>
          </div>
          <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
            STABLE
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" hide />
              <YAxis domain={['dataMin - 20', 'dataMax + 20']} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="material-card p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Blood Pressure</p>
          <p className="text-lg font-bold text-slate-800 mt-1">118/75</p>
          <div className="h-1 w-12 bg-emerald-400 rounded-full mt-2"></div>
        </div>
        <div className="material-card p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Highest Glucose</p>
          <p className="text-lg font-bold text-slate-800 mt-1">154</p>
          <div className="h-1 w-12 bg-rose-400 rounded-full mt-2"></div>
        </div>
      </div>
      
      <div className="material-card p-6">
        <h4 className="font-bold text-slate-800 mb-4">Export Reports</h4>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
            <span className="text-xs font-bold text-slate-600">PDF Report</span>
            <span className="text-[9px] text-slate-400 mt-1">FOR DOCTORS</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
            <span className="text-xs font-bold text-slate-600">CSV Data</span>
            <span className="text-[9px] text-slate-400 mt-1">RAW SPREADSHEET</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Charts;