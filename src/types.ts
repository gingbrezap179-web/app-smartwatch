export type SystemStatus = 'ready' | 'syncing' | 'error';

export interface Contact {
  id: string;
  name: string;
  photoUrl: string;
  phone: string;
  priority: number;
}

export interface WatchState {
  battery: number;
  isConnected: boolean;
  firmwareVersion: string;
  lastSync: string;
}

export interface SafeZone {
  id: string;
  name: string;
  address: string;
  radius: number; // in meters
  lat: number;
  lng: number;
}

export interface HapticSettings {
  intensity: 'low' | 'medium' | 'high';
  patterns: {
    leftTurn: string;
    rightTurn: string;
  };
}

export interface SensorSettings {
  fallSensitivity: 'low' | 'medium' | 'high';
  inactivityTimer: number; // in minutes
  sosCountdown: number; // in seconds
}

export interface BluetoothDevice {
  id: string;
  name: string;
  isPaired: boolean;
  signalStrength: number;
}
