
export enum VitalType {
  GLUCOSE = 'Glucose',
  BLOOD_PRESSURE = 'Blood Pressure',
  HEART_RATE = 'Heart Rate',
  OXYGEN = 'Oxygen',
  TEMPERATURE = 'Temperature'
}

export interface VitalReading {
  id: string;
  timestamp: Date;
  type: VitalType;
  value: number;
  unit: string;
  systolic?: number; // For Blood Pressure
  moodEmoji: string;
  symptoms: string[];
  isSyncing: boolean;
}

export type View = 'DASHBOARD' | 'HISTORY' | 'CHARTS' | 'INSIGHTS' | 'SETTINGS' | 'NEW_RECORD';

export interface AppState {
  isOnline: boolean;
  isSynced: boolean;
  readings: VitalReading[];
  showBiblicalMessages: boolean;
  currentView: View;
}

export interface BiblicalMessage {
  verse: string;
  reference: string;
}
