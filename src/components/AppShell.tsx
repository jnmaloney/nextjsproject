'use client';

import { useState } from 'react';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import { Footer } from '@ska-telescope/ska-gui-components';
import { HomeView } from '@/views/HomeView';
import { StationDetailView } from '@/views/StationDetailView';
import { StationsView } from '@/views/StationsView';
import { stations } from '@/mocks/stations';

function TabPanel(props: { value: number; index: number; children: React.ReactNode }) {
  const { value, index, children } = props;
  // Only the active panel is mounted, so heavy components don't render in the background.
  return (
    <Box role="tabpanel" id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} sx={{ py: 3 }}>
      {value === index ? children : null}
    </Box>
  );
}

export function AppShell() {
  const [tab, setTab] = useState(0);
  const [selectedId, setSelectedId] = useState(stations[0].id);
  const selected = stations.find((s) => s.id === selectedId) ?? stations[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setTab(2);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        SKA-Low component testbed
      </Typography>

      <Tabs value={tab} onChange={(_, v: number) => setTab(v)} aria-label="Testbed sections">
        <Tab label="Home" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Stations" id="tab-1" aria-controls="tabpanel-1" />
        <Tab label={`Station: ${selected.name}`} id="tab-2" aria-controls="tabpanel-2" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <HomeView />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <StationsView onSelect={handleSelect} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <StationDetailView station={selected} />
      </TabPanel>

      {/* From ska-gui-components */}
      <Footer testId="footer" version="0.1.0">
        <Typography variant="caption">Prototype, not for operational use</Typography>
      </Footer>
    </Container>
  );
}
