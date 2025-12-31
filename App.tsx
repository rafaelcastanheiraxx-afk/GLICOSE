
import React, { useState, useEffect } from 'react';
import { View, AppState, VitalReading, VitalType } from './types';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import NewRecord from './views/NewRecord';
import Insights from './views/Insights';
import Charts from './views/Charts';
import Settings from './views/Settings';
import { translations, Language } from './translations';

const INITIAL_READINGS: VitalReading[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000),
    type: VitalType.GLUCOSE,
    value: 105,
    unit: 'mg/dL',
    moodEmoji: '😊',
    symptoms: [],
    isSyncing: false
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 7200000),
    type: VitalType.BLOOD_PRESSURE,
    systolic: 120,
    value: 80,
    unit: 'mmHg',
    moodEmoji: '😐',
    symptoms: ['Fadiga'],
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
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleNavigate = (view: View) => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  const handleAddRecord = (reading: Partial<VitalReading>) => {
    const newReading: VitalReading = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type: reading.type || VitalType.GLUCOSE,
      value: reading.value || 0,
      systolic: reading.systolic,
      unit: reading.unit || '',
      moodEmoji: reading.moodEmoji || '😊',
      symptoms: reading.symptoms || [],
      isSyncing: state.isOnline
    };

    setState(prev => ({
      ...prev,
      readings: [newReading, ...prev.readings],
      currentView: 'DASHBOARD'
    }));
  };

  const renderView = () => {
    switch (state.currentView) {
      case 'DASHBOARD':
        return <Dashboard readings={state.readings} t={t} />;
      case 'HISTORY':
        return (
          <div className="space-y-4 pb-24">
            <h2 className="text-2xl font-bold text-slate-800 px-1">{t.history}</h2>
            <div className="space-y-3">
              {state.readings.map(r => (
                <div key={r.id} className="material-card p-4 flex items-center justify-between border-l-4 border-l-indigo-500">
                   <div className="flex items-center gap-4">
                    <span className="text-3xl">{r.moodEmoji}</span>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{r.type}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase">{r.timestamp.toLocaleString()}</p>
                    </div>
                   </div>
                   <div className="text-right">
                    <p className="font-bold text-slate-700 text-lg">
                      {r.type === VitalType.BLOOD_PRESSURE ? `${r.systolic}/${r.value}` : r.value}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{r.unit}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'CHARTS':
        return <Charts readings={state.readings} t={t} />;
      case 'INSIGHTS':
        return <Insights appState={state} t={t} lang={lang} />;
      case 'SETTINGS':
        return (
          <Settings 
            appState={state} 
            t={t}
            onToggleBiblical={() => setState(prev => ({ ...prev, showBiblicalMessages: !prev.showBiblicalMessages }))}
            onToggleOnline={() => setState(prev => ({ ...prev, isOnline: !prev.isOnline }))}
            onToggleLang={() => setLang(l => l === 'en' ? 'pt' : 'en')}
            currentLang={lang}
          />
        );
      case 'NEW_RECORD':
        return <NewRecord onSave={handleAddRecord} onCancel={() => handleNavigate('DASHBOARD')} lang={lang} t={t} />;
      default:
        return <Dashboard readings={state.readings} t={t} />;
    }
  };

  return (
    <Layout 
      currentView={state.currentView} 
      onNavigate={handleNavigate} 
      isOnline={state.isOnline}
      t={t}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
