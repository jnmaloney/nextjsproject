'use client';

import { Chip } from '@mui/material';
import type { StationStatus } from '@/mocks/stations';

const colour: Record<StationStatus, 'success' | 'warning' | 'error'> = {
  ok: 'success',
  degraded: 'warning',
  offline: 'error',
};

export interface StatusBadgeProps {
  status: StationStatus;
  /** Defaults to the status name. */
  label?: string;
  testId?: string;
}

export function StatusBadge({ status, label, testId = 'status-badge' }: StatusBadgeProps) {
  return (
    <Chip
      size="small"
      color={colour[status]}
      label={label ?? status}
      data-testid={`${testId}-${status}`}
    />
  );
}
