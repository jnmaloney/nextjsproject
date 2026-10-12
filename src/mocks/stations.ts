export type StationStatus = 'ok' | 'degraded' | 'offline';

export interface Station {
  id: string;
  name: string;
  status: StationStatus;
  antennasOnline: number;
  antennasTotal: number;
  lastUpdated: string; // ISO timestamp
}

// SKA-Low stations have 256 antennas each. Values below are made up.
export const stations: Station[] = [
  { id: 's001', name: 'Station 001', status: 'ok', antennasOnline: 256, antennasTotal: 256, lastUpdated: '2026-10-13T02:00:00Z' },
  { id: 's002', name: 'Station 002', status: 'degraded', antennasOnline: 231, antennasTotal: 256, lastUpdated: '2026-10-13T02:00:00Z' },
  { id: 's003', name: 'Station 003', status: 'offline', antennasOnline: 0, antennasTotal: 256, lastUpdated: '2026-10-12T21:14:00Z' },
];
