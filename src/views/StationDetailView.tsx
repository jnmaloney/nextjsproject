'use client';

import { useMemo } from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { SpectrumChart } from '@/components/SpectrumChart';
import { SpectrumHeatmap } from '@/components/SpectrumHeatmap';
import { StatusBadge } from '@/components/StatusBadge';
import { getSpectrum } from '@/mocks/spectrum';
import type { Station } from '@/mocks/stations';

export function StationDetailView({ station }: { station: Station }) {
  const spectrum = useMemo(() => getSpectrum(station.id), [station.id]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="h5" component="h2">
          {station.name}
        </Typography>
        <StatusBadge status={station.status} />
      </Box>
      <Typography variant="body2" sx={{ mb: 3 }}>
        {station.antennasOnline} / {station.antennasTotal} antennas online, updated{' '}
        {station.lastUpdated}
      </Typography>

      {station.status === 'offline' ? (
        <Alert severity="info">No spectrum data: this station is offline.</Alert>
      ) : (
        <>
          <Typography variant="h6" component="h3" gutterBottom>
            Spectrum waterfall
          </Typography>
          <Box sx={{ mb: 4 }}>
            <SpectrumHeatmap data={spectrum} />
          </Box>

          <Typography variant="h6" component="h3" gutterBottom>
            Mean spectrum
          </Typography>
          <SpectrumChart data={spectrum} />
        </>
      )}
    </Box>
  );
}
