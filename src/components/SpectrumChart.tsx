'use client';

import { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import type { SpectrumData } from '@/mocks/spectrum';

export interface SpectrumChartProps {
  data: SpectrumData;
  /** Expected range in dB, drawn as dashed lines. */
  limits?: { min: number; max: number };
  testId?: string;
}

const W = 600;
const H = 200;

/** Mean power (averaged over time) against frequency, drawn as a plain SVG line. */
export function SpectrumChart({ data, limits, testId = 'spectrum-chart' }: SpectrumChartProps) {
  const theme = useTheme();

  const { path, lo, hi, yMin, yMax } = useMemo(() => {
    const nF = data.freqMHz.length;
    const mean = data.freqMHz.map(
      (_, f) => data.power.reduce((sum, row) => sum + row[f], 0) / data.power.length,
    );
    const lo = Math.min(...mean);
    const hi = Math.max(...mean);
    // Include the limits in the scale so they are always visible.
    const yMin = limits ? Math.min(lo, limits.min) : lo;
    const yMax = limits ? Math.max(hi, limits.max) : hi;
    const d = mean
      .map((v, f) => {
        const x = (f / (nF - 1)) * W;
        const y = H - ((v - yMin) / (yMax - yMin || 1)) * H;
        return `${f === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    return { path: d, lo, hi, yMin, yMax };
  }, [data, limits]);

  const yOf = (v: number) => H - ((v - yMin) / (yMax - yMin || 1)) * H;
  const exceeds = limits ? hi > limits.max || lo < limits.min : false;

  const fMin = data.freqMHz[0];
  const fMax = data.freqMHz[data.freqMHz.length - 1];

  return (
    <Box data-testid={testId}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Mean power spectrum, ${fMin} to ${fMax} MHz${exceeds ? ', outside the expected range' : ''}`}
        style={{ width: '100%', height: 200, display: 'block' }}
      >
        <rect width={W} height={H} fill="none" stroke={theme.palette.divider} />
        {limits &&
          [limits.min, limits.max].map((v) => (
            <line
              key={v}
              x1={0}
              x2={W}
              y1={yOf(v)}
              y2={yOf(v)}
              stroke={theme.palette.warning.main}
              strokeDasharray="6 4"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        <path
          d={path}
          fill="none"
          stroke={exceeds ? theme.palette.error.main : theme.palette.primary.main}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption">{fMin.toFixed(0)} MHz</Typography>
        <Typography variant="caption">
          {limits
            ? `Dashed lines: expected range ${limits.min} to ${limits.max} dB`
            : `${lo.toFixed(0)} to ${hi.toFixed(0)} dB`}
        </Typography>
        <Typography variant="caption">{fMax.toFixed(0)} MHz</Typography>
      </Box>
    </Box>
  );
}
