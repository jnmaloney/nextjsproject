'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Placeholder theme. Swap in the SKA theme if the library exposes one.
const theme = createTheme();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
