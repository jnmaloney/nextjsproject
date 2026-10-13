'use client';

import { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import type { SpectrumData } from '@/mocks/spectrum';

export interface SpectrumChartProps {
  data: SpectrumData;
  testId?: string;
}

const W = 600;
const H = 200;

/** Mean power (averaged over time) against frequency, drawn as a plain SVG line. */
export function SpectrumChart({ data, testId = 'spectrum-chart' }: SpectrumChartProps) {
  const theme = useTheme();

  const { path, lo, hi } = useMemo(() => {
    const nF = data.freqMHz.length;
    const mean = data.freqMHz.map(
      (_, f) => data.power.reduce((sum, row) => sum + row[f], 0) / data.power.length,
    );
    const min = Math.min(...mean);
    const max = Math.max(...mean);
    const d = mean
      .map((v, f) => {
        const x = (f / (nF - 1)) * W;
        const y = H - ((v - min) / (max - min || 1)) * H;
        return `${f === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    return { path: d, lo: min, hi: max };
  }, [data]);

  const fMin = data.freqMHz[0];
  const fMax = data.freqMHz[data.freqMHz.length - 1];

  return (
    <Box data-testid={testId}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Mean power spectrum, ${fMin} to ${fMax} MHz`}
        style={{ width: '100%', height: 200, display: 'block' }}
      >
        <rect width={W} height={H} fill="none" stroke={theme.palette.divider} />
        <path
          d={path}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption">{fMin.toFixed(0)} MHz</Typography>
        <Typography variant="caption">
          {lo.toFixed(0)} to {hi.toFixed(0)} dB
        </Typography>
        <Typography variant="caption">{fMax.toFixed(0)} MHz</Typography>
      </Box>
    </Box>
  );
}
