'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import type { SpectrumData } from '@/mocks/spectrum';

// Viridis-like colour stops (r, g, b).
const STOPS = [
  [68, 1, 84],
  [59, 82, 139],
  [33, 145, 140],
  [94, 201, 98],
  [253, 231, 37],
];

function colour(t: number): number[] {
  const x = Math.min(Math.max(t, 0), 1) * (STOPS.length - 1);
  const i = Math.min(Math.floor(x), STOPS.length - 2);
  const f = x - i;
  return [0, 1, 2].map((k) => Math.round(STOPS[i][k] + (STOPS[i + 1][k] - STOPS[i][k]) * f));
}

export interface SpectrumHeatmapProps {
  data: SpectrumData;
  /** Colour scale limits in dB. Defaults to the data min/max. */
  dbMin?: number;
  dbMax?: number;
  height?: number;
  testId?: string;
}

/** Waterfall: frequency on x, time on y (oldest at top), power as colour. */
export function SpectrumHeatmap({
  data,
  dbMin,
  dbMax,
  height = 240,
  testId = 'spectrum-heatmap',
}: SpectrumHeatmapProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  const [lo, hi] = useMemo(() => {
    if (dbMin !== undefined && dbMax !== undefined) return [dbMin, dbMax];
    let min = Infinity;
    let max = -Infinity;
    for (const row of data.power) {
      for (const v of row) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    return [dbMin ?? min, dbMax ?? max];
  }, [data, dbMin, dbMax]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const nT = data.power.length;
    const nF = data.freqMHz.length;
    canvas.width = nF;
    canvas.height = nT;
    const img = ctx.createImageData(nF, nT);
    for (let t = 0; t < nT; t++) {
      for (let f = 0; f < nF; f++) {
        const [r, g, b] = colour((data.power[t][f] - lo) / (hi - lo || 1));
        const o = (t * nF + f) * 4;
        img.data[o] = r;
        img.data[o + 1] = g;
        img.data[o + 2] = b;
        img.data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [data, lo, hi]);

  const fMin = data.freqMHz[0];
  const fMax = data.freqMHz[data.freqMHz.length - 1];

  return (
    <Box data-testid={testId}>
      <canvas
        ref={ref}
        role="img"
        aria-label={`Spectrum waterfall, ${fMin} to ${fMax} MHz, ${data.power.length} time steps`}
        style={{ width: '100%', height, imageRendering: 'pixelated', display: 'block' }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption">{fMin.toFixed(0)} MHz</Typography>
        <Typography variant="caption">
          {lo.toFixed(0)} to {hi.toFixed(0)} dB, time runs top to bottom
        </Typography>
        <Typography variant="caption">{fMax.toFixed(0)} MHz</Typography>
      </Box>
    </Box>
  );
}
