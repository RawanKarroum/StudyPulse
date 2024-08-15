'use client';

import {
  Box,
  Button,
  Container,
  Typography,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase'; // Adjust the path to your Firebase config
import { useUserData } from '../hooks/useUserData'; // Assuming you have a hook to get user data

export default function Success() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData } = useUserData();

  useEffect(() => {
    const updateMembership = async () => {
      const sessionId = searchParams.get('session_id');
      if (sessionId && userData?.id) {
        try {
          // Update user's membership in Firestore
          const userRef = doc(db, 'users', userData.id);
          await updateDoc(userRef, { membership: 'member' });

          // Redirect to dashboard or show success message
          router.push('/dashboard');
        } catch (error) {
          console.error('Error updating membership:', error);
        }
      }
    };

    updateMembership();
  }, [searchParams, userData, router]);

  const handleContinue = () => {
    router.push('/dashboard');
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#4615b2", // Purple color for the button
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
        color: "#4caf50", // Green color for success
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
            Payment Successful!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Thank you for your purchase.
          </Typography>
          <Typography variant="body2" gutterBottom>
            You can now access your unlimited flashcard sets and the public flashcard database.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleContinue}
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
            Go to Dashboard
          </Button>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
