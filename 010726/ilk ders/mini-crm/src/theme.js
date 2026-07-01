import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? 'hsl(210, 82%, 47%)' : 'hsl(210, 75%, 37%)',
        dark: isDark ? 'hsl(210, 82%, 37%)' : 'hsl(210, 82%, 27%)',
        contrastText: '#ffffff',
      },
      secondary: {
        main: 'hsl(165, 76%, 25%)',
        dark: 'hsl(167, 82%, 17%)',
        light: 'hsl(159, 50%, 92%)',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? 'hsl(60, 3%, 11%)' : 'hsl(0, 0%, 98%)',
        paper: isDark ? 'hsl(60, 3%, 15%)' : 'hsl(0, 0%, 100%)',
      },
      text: {
        primary: isDark ? 'hsl(47, 24%, 93%)' : 'hsl(60, 2%, 17%)',
        secondary: isDark ? 'hsl(49, 7%, 68%)' : 'hsl(48, 3%, 36%)',
        disabled: 'hsl(52, 3%, 52%)',
      },
      divider: isDark ? 'hsl(60, 3%, 22%)' : 'hsl(210, 14%, 90%)',
    },
    typography: {
      fontFamily: "'Outfit', 'Inter', sans-serif",
      h1: {
        fontWeight: 600,
        letterSpacing: '-0.03em',
      },
      h2: {
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          containedPrimary: {
            backgroundColor: isDark ? 'hsl(210, 82%, 47%)' : 'hsl(210, 75%, 37%)',
            '&:hover': {
              backgroundColor: isDark ? 'hsl(210, 82%, 37%)' : 'hsl(210, 82%, 27%)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: isDark 
              ? '0 4px 20px rgba(0, 0, 0, 0.4)' 
              : '0 4px 20px rgba(0, 0, 0, 0.04)',
            border: `1px solid ${isDark ? 'hsl(60, 3%, 22%)' : 'hsl(210, 14%, 90%)'}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: isDark ? 'hsl(60, 3%, 8%)' : 'hsl(210, 20%, 98%)',
            color: isDark ? 'hsl(49, 7%, 68%)' : 'hsl(48, 3%, 36%)',
            borderBottom: `1px solid ${isDark ? 'hsl(60, 3%, 22%)' : 'hsl(210, 14%, 90%)'}`,
          },
          body: {
            borderBottom: `1px solid ${isDark ? 'hsl(60, 3%, 22%)' : 'hsl(210, 14%, 90%)'}`,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
    },
  });
};
