import React, { useState, useEffect } from 'react';
import { VitalReading, AppState, BiblicalMessage } from '../types.ts';
import { getHealthObservations, getDailyVerse } from '../services/geminiService.ts';
import { Sparkles, Quote, Info, RefreshCw, BookOpen, Loader2 } from 'lucide-react';

interface InsightsProps {
  appState: AppState;
  t: any;
  lang: 'pt' | 'en';
}

const Insights: React.FC<InsightsProps> = ({ appState, t, lang }) => {
  const [observation, setObservation] = useState<string>('');
  const [verse, setVerse] = useState<BiblicalMessage | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const obs = await getHealthObservations(appState.readings, lang);
    setObservation(obs);
    
    if (appState.showBiblicalMessages) {
      const v = await getDailyVerse(appState.isOnline, lang);
      setVerse(v);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [appState.readings, appState.showBiblicalMessages, appState.isOnline, lang]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-bold text-slate-800">{t.ai}</h2>
        <button 
          onClick={loadData} 
          disabled={loading}
          className={`p-2 text-indigo-600 bg-white rounded-xl shadow-sm border border-slate-100 ${loading ? 'opacity-50' : ''}`}
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {appState.showBiblicalMessages && verse && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-[32px] border border-amber-100 relative overflow-hidden shadow-sm">
          <Quote className="absolute -top-2 -left-2 text-amber-200/50 w-24 h-24" />
          <div className="relative z-10 text-center space-y-3">
            <BookOpen className="mx-auto text-amber-600 mb-2" size={24} />
            <p className="text-amber-900 font-serif italic text-lg leading-relaxed">
              "{verse.verse}"
            </p>
            <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest">
              — {verse.reference}
            </p>
          </div>
        </div>
      )}

      <div className="material-card p-0 overflow-hidden border-indigo-100">
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <span className="font-black text-[10px] uppercase tracking-widest">Smart Observer AI</span>
          </div>
          {loading && <Loader2 size={16} className="animate-spin" />}
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Sparkles className="text-indigo-600" size={24} />
            </div>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              {loading ? (lang === 'pt' ? 'Analisando padrões...' : 'Analyzing patterns...') : observation}
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl flex gap-3 items-start border border-slate-100">
            <Info className="text-slate-400 shrink-0" size={16} />
            <p className="text-[10px] text-slate-500 leading-tight font-medium">
              {t.observationalDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;