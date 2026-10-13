'use client';

import { Box, Typography } from '@mui/material';
import { StatusBadge } from '@/components/StatusBadge';
import { stations } from '@/mocks/stations';

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
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }} data-testid="home-summary">
        <StatusBadge status="ok" label={`${count('ok')} ok`} />
        <StatusBadge status="degraded" label={`${count('degraded')} degraded`} />
        <StatusBadge status="offline" label={`${count('offline')} offline`} />
      </Box>
    </Box>
  );
}
