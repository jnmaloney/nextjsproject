'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { FaultBadge } from '@/components/FaultBadge';
import { StationCard } from '@/components/StationCard';
import { StatusBadge } from '@/components/StatusBadge';
import { stations } from '@/mocks/stations';

export interface StationsViewProps {
  onSelect: (stationId: string) => void;
}

export function StationsView({ onSelect }: StationsViewProps) {
  const [mode, setMode] = useState<'grid' | 'list'>('grid');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Stations
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={mode}
          onChange={(_, v) => v && setMode(v)}
          aria-label="Station layout"
        >
          <ToggleButton value="grid">Grid</ToggleButton>
          <ToggleButton value="list">List</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {mode === 'grid' ? (
        <Grid container spacing={2}>
          {stations.map((s) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.id}>
              <StationCard station={s} onSelect={onSelect} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Table size="small" aria-label="Station list">
          <TableHead>
            <TableRow>
              <TableCell>Station</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Faults</TableCell>
              <TableCell align="right">Antennas online</TableCell>
              <TableCell>Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stations.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell>
                  <Link component="button" onClick={() => onSelect(s.id)}>
                    {s.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge status={s.status} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {s.faults.map((f) => (
                      <FaultBadge key={f.type} fault={f} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {s.antennasOnline} / {s.antennasTotal}
                </TableCell>
                <TableCell>{s.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}
