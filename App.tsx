import React, { useState, useEffect } from 'react';
import { View, AppState, VitalReading, VitalType } from './types.ts';
import Layout from './components/Layout.tsx';
import Dashboard from './views/Dashboard.tsx';
import NewRecord from './views/NewRecord.tsx';
import Insights from './views/Insights.tsx';
import Charts from './views/Charts.tsx';
import Settings from './views/Settings.tsx';
import { translations, Language } from './translations.ts';

const INITIAL_READINGS: VitalReading[] = [
  {
    id: '1',
    timestamp: new Date(),
    type: VitalType.GLUCOSE,
    value: 105,
    unit: 'mg/dL',
    moodEmoji: '😊',
    symptoms: [],
    isSyncing: false
  }
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('pt');
  const [state, setState] = useState<AppState>({
    isOnline: navigator.onLine,
    isSynced: true,
    readings: INITIAL_READINGS,
    showBiblicalMessages: true,
    currentView: 'DASHBOARD'
  });

  const t = translations[lang];

  useEffect(() => {
    const updateOnlineStatus = () => setState(s => ({ ...s, isOnline: navigator.onLine }));
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleAddRecord = (reading: Partial<VitalReading>) => {
    const newReading: VitalReading = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: reading.type || VitalType.GLUCOSE,
      value: reading.value || 0,
      systolic: reading.systolic,
      unit: reading.unit || '',
      moodEmoji: reading.moodEmoji || '😊',
      symptoms: reading.symptoms || [],
      isSyncing: state.isOnline
    };
    setState(s => ({ ...s, readings: [newReading, ...s.readings], currentView: 'DASHBOARD' }));
  };

  const renderView = () => {
    switch (state.currentView) {
      case 'DASHBOARD': return <Dashboard readings={state.readings} t={t} />;
      case 'HISTORY': return (
        <div className="space-y-4 pb-24">
          <h2 className="text-2xl font-black text-slate-800 px-1">{t.history}</h2>
          {state.readings.map(r => (
            <div key={r.id} className="material-card p-4 flex items-center justify-between border-l-4 border-l-indigo-500">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{r.moodEmoji}</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{r.type}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{r.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-700">{r.type === VitalType.BLOOD_PRESSURE ? `${r.systolic}/${r.value}` : r.value} {r.unit}</p>
              </div>
            </div>
          ))}
        </div>
      );
      case 'CHARTS': return <Charts readings={state.readings} t={t} />;
      case 'INSIGHTS': return <Insights appState={state} t={t} lang={lang} />;
      case 'SETTINGS': return (
        <Settings 
          appState={state} 
          t={t}
          onToggleBiblical={() => setState(s => ({ ...s, showBiblicalMessages: !s.showBiblicalMessages }))}
          onToggleOnline={() => setState(s => ({ ...s, isOnline: !s.isOnline }))}
          onToggleLang={() => setLang(l => l === 'en' ? 'pt' : 'en')}
          currentLang={lang}
        />
      );
      case 'NEW_RECORD': return <NewRecord onSave={handleAddRecord} onCancel={() => setState(s => ({ ...s, currentView: 'DASHBOARD' }))} lang={lang} t={t} />;
      default: return <Dashboard readings={state.readings} t={t} />;
    }
  };

  return (
    <Layout currentView={state.currentView} onNavigate={(v) => setState(s => ({ ...s, currentView: v }))} isOnline={state.isOnline} t={t}>
      {renderView()}
    </Layout>
  );
};

export default App;