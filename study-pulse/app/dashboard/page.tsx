"use client";

import { ThemeProvider, CssBaseline, Container, Typography, Box, Button, useMediaQuery } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { createTheme } from '@mui/material/styles';
import { useUserData } from "../hooks/useUserData";

export default function Dashboard() {
  const { userData, isSignedIn } = useUserData();

  const theme = createTheme({
    palette: {
      primary: {
        main: '#651fff', // Lighter purple for buttons
      },
      secondary: {
        main: '#4615b2', // Darker purple for text
      },
      background: {
        default: '#f5f5f5',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h2: {
        fontWeight: 700,
        color: '#4615b2', // Darker purple for the title
      },
      h6: {
        fontWeight: 500,
        color: '#4615b2', // Darker purple for the description
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: 'linear-gradient(135deg, #4615b2 0%, #651fff 100%)', // Gradient background
            color: '#FFFFFF',
            overflow: 'hidden', // Prevent scrolling
          },
        },
      },
    },
  });

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isSignedIn) {
    return <p>Please sign in to access the dashboard.</p>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.secondary.main, // Use dark purple for text color
        }}
      >
        <Typography variant="h2" sx={{ marginBottom: 2 }}>
          Study Pulse
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: 6 }}>
          Your AI-powered flashcards app. Generate flashcards using AI or create them manually.
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            gap: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: 250,
              height: 250,
              fontSize: '1.5rem',
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: theme.palette.primary.main, // Use lighter purple for buttons
              color: '#fff',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#5117e0', // Slightly darker shade for hover
              },
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 50 }} /> {/* Increase icon size here */}
            Generate Flashcards
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: 250,
              height: 250,
              fontSize: '1.5rem',
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: theme.palette.primary.main, // Use lighter purple for buttons
              color: '#fff',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#5117e0', // Slightly darker shade for hover
              },
            }}
          >
            <CreateNewFolderIcon sx={{ fontSize: 50 }} /> {/* Increase icon size here */}
            Create Flashcards
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
