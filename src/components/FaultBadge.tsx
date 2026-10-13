'use client';

import { Chip, Tooltip } from '@mui/material';
import { FAULT_LABEL, FAULT_SEVERITY, type Fault, type FaultType } from '@/mocks/stations';

export interface FaultBadgeProps {
  /** Pass a full fault to get its detail as a tooltip, or just a type. */
  fault: Fault | { type: FaultType; detail?: undefined };
  /** Defaults to the fault's name. */
  label?: string;
  testId?: string;
}

export function FaultBadge({ fault, label, testId = 'fault-badge' }: FaultBadgeProps) {
  const chip = (
    <Chip
      size="small"
      variant="outlined"
      color={FAULT_SEVERITY[fault.type]}
      label={label ?? FAULT_LABEL[fault.type]}
      data-testid={`${testId}-${fault.type}`}
    />
  );
  return fault.detail ? <Tooltip title={fault.detail}>{chip}</Tooltip> : chip;
}
