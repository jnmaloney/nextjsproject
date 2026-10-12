'use client';

import { Card, CardContent, Chip, LinearProgress, Typography } from '@mui/material';
import type { Station, StationStatus } from '@/mocks/stations';

const statusColour: Record<StationStatus, 'success' | 'warning' | 'error'> = {
  ok: 'success',
  degraded: 'warning',
  offline: 'error',
};

export interface StationCardProps {
  station: Station;
  /** Used as data-testid, following the SKA convention of a testId per component. */
  testId?: string;
}

export function StationCard({ station, testId = 'station-card' }: StationCardProps) {
  const pct = Math.round((station.antennasOnline / station.antennasTotal) * 100);
  return (
    <Card data-testid={`${testId}-${station.id}`} variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h3">{station.name}</Typography>
        <Chip
          size="small"
          label={station.status}
          color={statusColour[station.status]}
          sx={{ my: 1 }}
        />
        <Typography variant="body2">
          {station.antennasOnline} / {station.antennasTotal} antennas online
        </Typography>
        <LinearProgress
          variant="determinate"
          value={pct}
          color={statusColour[station.status]}
          aria-label={`${station.name} antennas online`}
          sx={{ my: 1 }}
        />
        <Typography variant="caption" color="text.secondary">
          Updated {station.lastUpdated}
        </Typography>
      </CardContent>
    </Card>
  );
}
