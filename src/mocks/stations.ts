export type StationStatus = 'ok' | 'degraded' | 'offline';

export type FaultType = 'no-data' | 'out-of-range' | 'network' | 'metric-alert';

export interface Fault {
  type: FaultType;
  since: string; // ISO timestamp
  detail: string;
}

export interface Station {
  id: string;
  name: string;
  status: StationStatus;
  antennasOnline: number;
  antennasTotal: number;
  lastUpdated: string; // ISO timestamp
  faults: Fault[];
}

export const FAULT_LABEL: Record<FaultType, string> = {
  'no-data': 'No data',
  'out-of-range': 'Out of range',
  network: 'Network issue',
  'metric-alert': 'Metric alert',
};

export const FAULT_SEVERITY: Record<FaultType, 'warning' | 'error'> = {
  'no-data': 'warning',
  'out-of-range': 'warning',
  network: 'error',
  'metric-alert': 'warning',
};

export function hasFault(station: Station, type: FaultType): boolean {
  return station.faults.some((f) => f.type === type);
}

const ANTENNAS_PER_STATION = 256;

// Faults layered on top of the base pattern below (by station number). All mock data.
const OVERLAY: Record<number, { status?: StationStatus; faults: Fault[] }> = {
  2: {
    status: 'degraded',
    faults: [{ type: 'metric-alert', since: '2026-10-13T01:20:00Z', detail: 'FPGA temperature 78 °C (limit 70 °C)' }],
  },
  4: {
    faults: [{ type: 'out-of-range', since: '2026-10-13T00:40:00Z', detail: 'Mean power above the expected range around 200 MHz' }],
  },
  5: {
    status: 'degraded',
    faults: [{ type: 'network', since: '2026-10-13T01:05:00Z', detail: 'No heartbeat for 55 min; showing last received data' }],
  },
  7: {
    faults: [{ type: 'no-data', since: '2026-10-12T21:14:00Z', detail: 'No spectrum data received for 4 h 46 min' }],
  },
  8: {
    faults: [{ type: 'metric-alert', since: '2026-10-13T01:45:00Z', detail: 'Packet loss 4.2 % (limit 1 %)' }],
  },
  11: {
    status: 'degraded',
    faults: [{ type: 'no-data', since: '2026-10-13T00:10:00Z', detail: 'Station is reporting, but no spectra have been received' }],
  },
  14: {
    faults: [{ type: 'network', since: '2026-10-12T22:30:00Z', detail: 'Station unreachable; link down since 22:30 UTC' }],
  },
};

// Base pattern: every 7th station offline, every 4th degraded (lost antennas).
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
  const overlay = OVERLAY[n];
  return {
    id: `s${String(n).padStart(3, '0')}`,
    name: `Station ${String(n).padStart(3, '0')}`,
    status: overlay?.status ?? status,
    antennasOnline,
    antennasTotal: ANTENNAS_PER_STATION,
    lastUpdated: status === 'offline' ? '2026-10-12T21:14:00Z' : '2026-10-13T02:00:00Z',
    faults: overlay?.faults ?? [],
  };
});
