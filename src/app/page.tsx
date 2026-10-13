'use client';

import { Container, Grid, Typography } from '@mui/material';
import { Footer } from '@ska-telescope/ska-gui-components';
import { StationCard } from '@/components/StationCard';
import { stations } from '@/mocks/stations';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        SKA-Low component testbed
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom>
        StationCard
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stations.map((s) => (
          <Grid size={{ xs: 12, sm: 4 }} key={s.id}>
            <StationCard station={s} />
          </Grid>
        ))}
      </Grid>

      {/* From ska-gui-components, using the usage shown in its docs. */}
      <Footer testId="footer" version="0.1.0">
        <Typography variant="caption">Prototype, not for operational use</Typography>
      </Footer>
    </Container>
  );
}
