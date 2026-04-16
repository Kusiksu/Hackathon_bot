import { createTheme } from '@mui/material/styles';

/** Базовая тема MUI*/
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    error: {
      main: '#b91c1c',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});
