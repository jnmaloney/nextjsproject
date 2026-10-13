export type StationStatus = 'ok' | 'degraded' | 'offline';

export interface Station {
  id: string;
  name: string;
  status: StationStatus;
  antennasOnline: number;
  antennasTotal: number;
  lastUpdated: string; // ISO timestamp
}

const ANTENNAS_PER_STATION = 256;

// Mock data only. Every 7th station is offline, every 4th is degraded.
export const stations: Station[] = Array.from({ length: 24 }, (_, i) => {
  const n = i + 1;
  let status: StationStatus = 'ok';
  let antennasOnline = ANTENNAS_PER_STATION;
  if (n % 7 === 0) {
    status = 'offline';
    antennasOnline = 0;
  } else if (n % 4 === 0) {
    status = 'degraded';
    antennasOnline = ANTENNAS_PER_STATION - 5 - ((n * 3) % 40);
  }
  return {
    id: `s${String(n).padStart(3, '0')}`,
    name: `Station ${String(n).padStart(3, '0')}`,
    status,
    antennasOnline,
    antennasTotal: ANTENNAS_PER_STATION,
    lastUpdated: status === 'offline' ? '2026-10-12T21:14:00Z' : '2026-10-13T02:00:00Z',
  };
});
