'use client';

import { useMemo } from 'react';
import { Alert, AlertTitle, Box, Typography } from '@mui/material';
import { SpectrumChart } from '@/components/SpectrumChart';
import { SpectrumHeatmap } from '@/components/SpectrumHeatmap';
import { StatusBadge } from '@/components/StatusBadge';
import { EXPECTED_DB, getSpectrum } from '@/mocks/spectrum';
import { FAULT_LABEL, FAULT_SEVERITY, hasFault, type Station } from '@/mocks/stations';

export function StationDetailView({ station }: { station: Station }) {
  const outOfRange = hasFault(station, 'out-of-range');
  const noData = hasFault(station, 'no-data') || station.status === 'offline';
  const stale = hasFault(station, 'network');

  const spectrum = useMemo(
    () => getSpectrum(station.id, 300, 60, { outOfRange }),
    [station.id, outOfRange],
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="h5" component="h2">
          {station.name}
        </Typography>
        <StatusBadge status={station.status} />
      </Box>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {station.antennasOnline} / {station.antennasTotal} antennas online, updated{' '}
        {station.lastUpdated}
      </Typography>

      {station.faults.map((f) => (
        <Alert key={f.type} severity={FAULT_SEVERITY[f.type]} sx={{ mb: 1 }}>
          <AlertTitle>{FAULT_LABEL[f.type]}</AlertTitle>
          {f.detail} (since {f.since})
        </Alert>
      ))}

      <Box sx={{ mt: 3 }}>
        {noData ? (
          <Alert severity="info">
            {station.status === 'offline'
              ? 'No spectrum data: this station is offline.'
              : 'No spectrum data to display.'}
          </Alert>
        ) : (
          <Box>
            {stale && (
              <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 1 }}>
                Stale: showing the last data received before the network issue.
              </Typography>
            )}
            <Box sx={{ opacity: stale ? 0.45 : 1 }} data-testid="spectrum-panel">
              <Typography variant="h6" component="h3" gutterBottom>
                Spectrum waterfall
              </Typography>
              <Box sx={{ mb: 4 }}>
                {/* Fixed colour scale so stations are comparable. */}
                <SpectrumHeatmap data={spectrum} dbMin={-80} dbMax={-30} />
              </Box>

              <Typography variant="h6" component="h3" gutterBottom>
                Mean spectrum
              </Typography>
              <SpectrumChart data={spectrum} limits={EXPECTED_DB} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
