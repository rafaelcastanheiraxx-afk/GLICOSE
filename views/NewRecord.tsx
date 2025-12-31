
import React, { useState, useEffect } from 'react';
import { VitalType, VitalReading } from '../types';
import { X, Check, Bluetooth, ChevronRight, Loader2, Smartphone } from 'lucide-react';

interface NewRecordProps {
  onSave: (reading: Partial<VitalReading>) => void;
  onCancel: () => void;
  lang: 'en' | 'pt';
  t: any;
}

const NewRecord: React.FC<NewRecordProps> = ({ onSave, onCancel, lang, t }) => {
  const [type, setType] = useState<VitalType>(VitalType.GLUCOSE);
  const [value, setValue] = useState('');
  const [systolic, setSystolic] = useState('');
  const [mood, setMood] = useState('😊');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: idle, 1: scanning, 2: found, 3: connecting

  const emojis = ['😊', '😐', '😔', '😫', '🤢', '🤒'];
  const symptomList = lang === 'pt' 
    ? ['Fadiga', 'Tontura', 'Dor de Cabeça', 'Dor', 'Náusea']
    : ['Fatigue', 'Dizziness', 'Headache', 'Pain', 'Nausea'];

  const handleSave = () => {
    onSave({
      type,
      value: Number(value),
      systolic: type === VitalType.BLOOD_PRESSURE ? Number(systolic) : undefined,
      moodEmoji: mood,
      symptoms,
      unit: type === VitalType.GLUCOSE ? 'mg/dL' : type === VitalType.BLOOD_PRESSURE ? 'mmHg' : type === VitalType.HEART_RATE ? 'BPM' : (type === VitalType.OXYGEN ? '%' : '°C'),
    });
  };

  const simulateBluetooth = () => {
    setIsScanning(true);
    setScanStep(1);
    setTimeout(() => setScanStep(2), 2000);
    setTimeout(() => setScanStep(3), 3500);
    setTimeout(() => {
      setIsScanning(false);
      setScanStep(0);
      // Simulate receiving data
      if (type === VitalType.GLUCOSE) setValue('108');
      if (type === VitalType.BLOOD_PRESSURE) { setSystolic('115'); setValue('75'); }
    }, 5000);
  };

  const toggleSymptom = (s: string) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{t.newRecord}</h2>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
      </div>

      {isScanning && (
        <div className="fixed inset-0 z-50 bg-indigo-900/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] w-full max-w-xs p-8 text-center space-y-6 shadow-2xl">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping"></div>
              <div className="relative bg-indigo-600 w-20 h-20 rounded-full flex items-center justify-center text-white">
                <Bluetooth size={40} className={scanStep === 1 ? 'animate-pulse' : ''} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-lg">
                {scanStep === 1 && t.scanningBluetooth}
                {scanStep === 2 && t.deviceFound}
                {scanStep === 3 && t.pairing}
              </h3>
              <p className="text-sm text-slate-500">
                {scanStep === 1 && "Verifying sensors..."}
                {scanStep === 2 && "GlucaTrack Sensor v2.0"}
                {scanStep === 3 && "Secure encryption handshaking..."}
              </p>
            </div>
            {scanStep === 3 && <Loader2 className="mx-auto animate-spin text-indigo-600" size={24} />}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Type Selector */}
        <div className="grid grid-cols-2 gap-2">
          {Object.values(VitalType).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-all ${
                type === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-[1.02]' : 'bg-white text-slate-500 border-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="material-card p-6 space-y-4 border-2 border-transparent focus-within:border-indigo-100 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.inputValue}</span>
            <button 
              onClick={simulateBluetooth}
              className="text-indigo-600 text-[10px] flex items-center gap-1 font-bold uppercase tracking-wide bg-indigo-50 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Bluetooth size={12} /> {t.connectDevice}
            </button>
          </div>
          
          <div className="flex gap-4">
            {type === VitalType.BLOOD_PRESSURE && (
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Sys"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  className="w-full text-4xl font-bold text-slate-800 placeholder-slate-200 outline-none"
                />
                <div className="h-0.5 bg-slate-100 mt-2"></div>
                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">Systolic</p>
              </div>
            )}
            <div className="flex-1 text-center">
               <input
                type="number"
                placeholder="Val"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full text-4xl font-bold text-slate-800 placeholder-slate-200 outline-none"
              />
              <div className="h-0.5 bg-slate-100 mt-2"></div>
              <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">
                {type === VitalType.BLOOD_PRESSURE ? 'Diastolic' : 'Value'}
              </p>
            </div>
            <div className="shrink-0 pt-2">
              <span className="text-xl font-bold text-slate-300">
                 {type === VitalType.GLUCOSE ? 'mg/dL' : type === VitalType.BLOOD_PRESSURE ? 'mmHg' : type === VitalType.HEART_RATE ? 'BPM' : (type === VitalType.OXYGEN ? '%' : '°C')}
              </span>
            </div>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="material-card p-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t.howFeeling}</p>
          <div className="flex justify-between items-center">
            {emojis.map(e => (
              <button
                key={e}
                onClick={() => setMood(e)}
                className={`text-3xl p-3 rounded-[20px] transition-all duration-300 ${mood === e ? 'bg-indigo-600 shadow-indigo-200 shadow-xl scale-125 z-10' : 'grayscale opacity-30 hover:opacity-100 hover:grayscale-0'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div className="material-card p-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t.anySymptoms}</p>
          <div className="flex flex-wrap gap-2">
            {symptomList.map(s => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  symptoms.includes(s) 
                  ? 'bg-rose-50 text-rose-600 border-rose-100' 
                  : 'bg-slate-50 text-slate-500 border-transparent hover:border-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          disabled={!value}
          className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-bold text-lg shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale mt-4"
        >
          {t.save}
        </button>
      </div>
    </div>
  );
};

export default NewRecord;
