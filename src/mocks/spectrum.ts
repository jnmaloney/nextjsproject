// Mock spectrum data (not real telescope data).
// Shape: power[time][frequency], in dB. Replace getSpectrum() with a real
// data source later; the components only depend on the SpectrumData type.

export const FREQ_MIN_MHZ = 50;
export const FREQ_MAX_MHZ = 350;

export interface SpectrumData {
  freqMHz: number[];
  timestamps: string[]; // ISO, one per row of `power`
  power: number[][]; // [time][frequency], dB
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Narrowband interference: centre (MHz), width (MHz), height (dB), fraction of time on.
const RFI = [
  { f: 100, w: 3, a: 18, duty: 1 },
  { f: 137, w: 0.6, a: 25, duty: 0.3 },
  { f: 240, w: 1, a: 15, duty: 0.15 },
];

export function getSpectrum(stationId: string, nFreq = 300, nTime = 60): SpectrumData {
  const rand = mulberry32(hash(stationId));
  const offset = (rand() - 0.5) * 4;
  const freqMHz = Array.from(
    { length: nFreq },
    (_, i) => FREQ_MIN_MHZ + (i / (nFreq - 1)) * (FREQ_MAX_MHZ - FREQ_MIN_MHZ),
  );
  const start = Date.parse('2026-10-13T00:00:00Z');
  const timestamps = Array.from({ length: nTime }, (_, t) =>
    new Date(start + t * 60_000).toISOString(),
  );
  const power = Array.from({ length: nTime }, () => {
    const active = RFI.map((r) => r.duty >= 1 || rand() < r.duty);
    return freqMHz.map((f) => {
      let p = -60 - 0.04 * (f - FREQ_MIN_MHZ) + offset + (rand() - 0.5) * 3;
      RFI.forEach((r, k) => {
        if (active[k]) p += r.a * Math.exp(-0.5 * ((f - r.f) / r.w) ** 2);
      });
      return p;
    });
  });
  return { freqMHz, timestamps, power };
}
