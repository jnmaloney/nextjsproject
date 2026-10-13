'use client';

import { Card, CardActionArea, CardContent, LinearProgress, Typography } from '@mui/material';
import type { Station } from '@/mocks/stations';
import { StatusBadge } from './StatusBadge';

const barColour = { ok: 'success', degraded: 'warning', offline: 'error' } as const;

export interface StationCardProps {
  station: Station;
  /** If provided, the whole card becomes clickable. */
  onSelect?: (stationId: string) => void;
  /** Used as data-testid, following the SKA convention of a testId per component. */
  testId?: string;
}

export function StationCard({ station, onSelect, testId = 'station-card' }: StationCardProps) {
  const pct = Math.round((station.antennasOnline / station.antennasTotal) * 100);
  const content = (
    <CardContent>
      <Typography variant="h6" component="h3">{station.name}</Typography>
      <StatusBadge status={station.status} />
      <Typography variant="body2" sx={{ mt: 1 }}>
        {station.antennasOnline} / {station.antennasTotal} antennas online
      </Typography>
      <LinearProgress
        variant="determinate"
        value={pct}
        color={barColour[station.status]}
        aria-label={`${station.name} antennas online`}
        sx={{ my: 1 }}
      />
      <Typography variant="caption" color="text.secondary">
        Updated {station.lastUpdated}
      </Typography>
    </CardContent>
  );
  return (
    <Card data-testid={`${testId}-${station.id}`} variant="outlined">
      {onSelect ? (
        <CardActionArea onClick={() => onSelect(station.id)}>{content}</CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
}
