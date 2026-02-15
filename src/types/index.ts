export type SymptomCategory = 'Physical' | 'Emotional' | 'Flow' | 'Other';

export interface Symptom {
  id: string;
  label: string;
  category: SymptomCategory;
}

export interface Cycle {
  id: string;
  startDate: string; // ISO Date YYYY-MM-DD
  endDate?: string; // ISO Date YYYY-MM-DD
  length?: number; // Calculated length in days
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  symptoms: string[]; // Array of symptom IDs
  flow?: 'Light' | 'Medium' | 'Heavy' | 'Spotting';
  notes?: string;
  basalTemperature?: number;
  mood?: string;
}

export interface UserSettings {
  avgCycleLength: number;
  avgPeriodLength: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  settings: UserSettings;
}
