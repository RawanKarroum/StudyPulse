"use client";

import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { createTheme } from "@mui/material/styles";
import { useUserData } from "../hooks/useUserData";

export default function Dashboard() {
  const { userData, isSignedIn } = useUserData();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#651fff", // Lighter purple for buttons
      },
      secondary: {
        main: "#4615b2", // Darker purple for text
      },
      background: {
        default: "#f5f5f5",
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h2: {
        fontWeight: 700,
        color: "#4615b2", // Darker purple for the title
      },
      h6: {
        fontWeight: 500,
        color: "#4615b2", // Darker purple for the description
      },
      body1: {
        fontWeight: 400,
        color: "#fff", // White text inside cards
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: "linear-gradient(135deg, #4615b2 0%, #651fff 100%)", // Gradient background
            color: "#FFFFFF",
            overflow: "hidden", // Prevent the entire page from scrolling
          },
        },
      },
    },
  });

  if (!isSignedIn) {
    return <p>Please sign in to access the dashboard.</p>;
  }

  console.log("User ID:", userData?.id);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh", // Ensure the container fills the entire viewport height
          textAlign: "center",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.secondary.main, // Use dark purple for text color
          padding: 4,
        }}
      >
        {/* Title and Description */}
        <Box sx={{ textAlign: "center", marginBottom: 4 }}>
          <Typography variant="h2" sx={{ marginBottom: 2 }}>
            Study Pulse
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 6 }}>
            Your AI-powered flashcards app. Generate flashcards using AI or
            create them manually.
          </Typography>
        </Box>

        {/* Top Row with Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 4,
            marginBottom: 6,
          }}
        >
          <Box
            sx={{
              width: 300, // Increased width
              height: 350, // Increased height for more vertical space
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.palette.primary.main, // Use lighter purple for buttons
              color: "#fff",
              boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
              borderRadius: 4,
              padding: 2,
              cursor: "pointer", // Make cursor a pointer
              "&:hover": {
                backgroundColor: "#5117e0", // Slightly darker shade for hover
              },
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 60, marginBottom: 2 }} /> {/* Increased icon size */}
            <Typography variant="h5">Generate Flashcards</Typography>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Automatically create flashcards from your notes.
            </Typography>
          </Box>

          <Box
            sx={{
              width: 300, // Increased width
              height: 350, // Increased height for more vertical space
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.palette.primary.main, // Use lighter purple for buttons
              color: "#fff",
              boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
              borderRadius: 4,
              padding: 2,
              cursor: "pointer", // Make cursor a pointer
              "&:hover": {
                backgroundColor: "#5117e0", // Slightly darker shade for hover
              },
            }}
          >
            <CreateNewFolderIcon sx={{ fontSize: 60, marginBottom: 2 }} /> {/* Increased icon size */}
            <Typography variant="h5">Create Flashcards</Typography>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Manually build your own flashcards.
            </Typography>
          </Box>
        </Box>

        {/* Flashcard Title */}
        <Typography
          variant="h5"
          sx={{
            marginBottom: 2,
            color: theme.palette.secondary.main,
          }}
        >
          Your Flashcard Sets
        </Typography>

        {/* Flashcard section below */}
        <Box
          sx={{
            width: "60%", // Container width
            maxHeight: "40%",
            overflowY: "auto", // Scroll if content exceeds maxHeight
            padding: 2,
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2, // Reduced gap between flashcards
              flexWrap: "wrap",
              justifyContent: "center", // Align cards in the center
            }}
          >
            {/* Example Flashcard Set */}
            <Box
              sx={{
                width: 260, // Increased width
                height: 160, // Increased height
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                padding: 2,
                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
                borderRadius: 4, // Rounded corners
                cursor: "pointer", // Make cursor a pointer
                "&:hover": {
                  backgroundColor: "#5117e0",
                },
                textAlign: "center",
              }}
            >
              <Typography variant="h6" component="div" sx={{ color: "#fff" }}>
                CEN800 Midterm
              </Typography>
              <Chip
                label="222 terms"
                sx={{
                  marginTop: 1,
                  backgroundColor: "#fff", // White background for the Chip
                  color: theme.palette.secondary.main, // Dark purple text for the Chip
                }}
              />
            </Box>

            {/* Additional flashcard examples */}
            <Box
              sx={{
                width: 260, // Increased width
                height: 160, // Increased height
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                padding: 2,
                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
                borderRadius: 4, // Rounded corners
                cursor: "pointer", // Make cursor a pointer
                "&:hover": {
                  backgroundColor: "#5117e0",
                },
                textAlign: "center",
              }}
            >
              <Typography variant="h6" component="div" sx={{ color: "#fff" }}>
                BIO101 Final Review
              </Typography>
              <Chip
                label="150 terms"
                sx={{
                  marginTop: 1,
                  backgroundColor: "#fff", // White background for the Chip
                  color: theme.palette.secondary.main, // Dark purple text for the Chip
                }}
              />
            </Box>

            <Box
              sx={{
                width: 260, // Increased width
                height: 160, // Increased height
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                padding: 2,
                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
                borderRadius: 4, // Rounded corners
                cursor: "pointer", // Make cursor a pointer
                "&:hover": {
                  backgroundColor: "#5117e0",
                },
                textAlign: "center",
              }}
            >
              <Typography variant="h6" component="div" sx={{ color: "#fff" }}>
                Physics 101
              </Typography>
              <Chip
                label="80 terms"
                sx={{
                  marginTop: 1,
                  backgroundColor: "#fff", // White background for the Chip
                  color: theme.palette.secondary.main, // Dark purple text for the Chip
                }}
              />
            </Box>
            
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
