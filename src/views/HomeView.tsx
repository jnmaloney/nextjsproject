'use client';

import { Box, Typography } from '@mui/material';
import { FaultBadge } from '@/components/FaultBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { FAULT_LABEL, hasFault, stations, type FaultType } from '@/mocks/stations';

const FAULT_TYPES = Object.keys(FAULT_LABEL) as FaultType[];

export function HomeView() {
  const count = (s: 'ok' | 'degraded' | 'offline') =>
    stations.filter((x) => x.status === s).length;

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Overview
      </Typography>
      <Typography paragraph>
        Testbed for new SKA-Low UI components. All data here is mock data.
      </Typography>

      <Typography variant="subtitle2" gutterBottom>Status</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }} data-testid="home-summary">
        <StatusBadge status="ok" label={`${count('ok')} ok`} />
        <StatusBadge status="degraded" label={`${count('degraded')} degraded`} />
        <StatusBadge status="offline" label={`${count('offline')} offline`} />
      </Box>

      <Typography variant="subtitle2" gutterBottom>Faults</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }} data-testid="home-faults">
        {FAULT_TYPES.map((t) => {
          const n = stations.filter((s) => hasFault(s, t)).length;
          return <FaultBadge key={t} fault={{ type: t }} label={`${n} ${FAULT_LABEL[t].toLowerCase()}`} />;
        })}
      </Box>
    </Box>
  );
}
