export type ChickenState = 'normal' | 'ill' | 'eating' | 'sleeping' | 'panicked';

export interface Chicken {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  state: ChickenState;
  energy: number;
  size: number;
  color: string;
  name: string;
  ageDays: number;
  weightKg: number;
}

export interface Telemetry {
  totalChickens: number;
  activeCount: number;
  inactiveCount: number;
  avgMovementIndex: number; // 0 to 100
  temperature: number;      // °C
  humidity: number;         // % RH
  ammoniaLevel: number;     // ppm
  lastUpdated: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'normal';
export type AlertCategory = 'health' | 'hardware' | 'environment';

export interface Alert {
  id: string;
  timestamp: string;
  category: AlertCategory;
  severity: AlertSeverity;
  message: string;
  status: 'active' | 'resolved';
  location: string;
}

export interface CameraDevice {
  id: string;
  name: string;
  location: string;
  ipAddress: string;
  status: 'online' | 'offline';
  resolution: string;
}

export interface SystemSettings {
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  ammoniaMax: number;
  activityThreshold: number; // Minimum movement index to consider healthy
  audioAlert: boolean;
  alertWebhook: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
