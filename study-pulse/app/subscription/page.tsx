'use client';

import {
  Box,
  Button,
  Container,
  Typography,
  CssBaseline,
} from "@mui/material";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
    });
    const { id } = await response.json();
    await stripe?.redirectToCheckout({ sessionId: id });
    setLoading(false);
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
        color: "#4615b2",
      },
      body1: {
        fontWeight: 500,
        fontSize: "1.25rem", // Increase the size of the text under the title
        color: "#333",
      },
      body2: {
        fontWeight: 400,
        fontSize: "1.15rem", // Slightly larger for the list items
        color: "#555",
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
            Study Pulse Plus Membership
          </Typography>
          <Typography variant="body1" gutterBottom>
            For just a <strong>$5 one-time payment</strong>, you&apos;ll get:
          </Typography>
          <Box sx={{ mt: 2, mb: 4 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              &#10003; <strong>Unlimited Flashcard Sets</strong>: Create as many as you need.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              &#10003; <strong>Access to Public Flashcard Database</strong>: Use and share flashcards with the community.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCheckout}
            disabled={loading}
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
            {loading ? "Processing..." : "Buy Now"}
          </Button>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
