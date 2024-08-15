'use client';

import {
  Box,
  Button,
  Container,
  Typography,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from 'next/navigation';

export default function Cancel() {
  const router = useRouter();

  const handleRetry = () => {
    router.push('/subscription');
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#4615b2",
      },
      secondary: {
        main: "#651fff",
      },
      background: {
        default: "#f5f5f5",
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        color: "#ff1744", // Red color for a "canceled" theme
      },
      body1: {
        fontWeight: 500,
        fontSize: "1.25rem", // Larger text size
        color: "#333",
        marginBottom: "20px", // Spacing between title and body text
      },
      body2: {
        fontWeight: 400,
        fontSize: "1.15rem", // Slightly larger text for details
        color: "#555",
        marginBottom: "40px", // Spacing between body text and button
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            height: "100%",
            overflow: "hidden", // Prevent scrolling
          },
          body: {
            height: "100%",
            overflow: "hidden", // Prevent scrolling
            margin: 0,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          backgroundColor: theme.palette.background.default,
          padding: 4,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h1" gutterBottom>
            Payment Canceled
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your payment was not processed.
          </Typography>
          <Typography variant="body2" gutterBottom>
            If you would like to try again, click the button below.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleRetry}
            sx={{
              padding: "12px 24px",
              borderRadius: "30px",
              fontWeight: "bold",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: theme.palette.secondary.main,
              },
            }}
          >
            Retry Payment
          </Button>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
