"use client";

import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Box,
  Chip,
  Avatar,
  Grid,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useUserData } from "../hooks/useUserData"; // Adjust the import according to your file structure

interface FlashcardSet {
  title: string;
  terms: number;
  userId: string;
  userName: string;
  userPhoto: string;
}

export default function PublicCards({
  flashcardSets,
}: {
  flashcardSets: FlashcardSet[];
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { userData, isSignedIn } = useUserData(); // Use userData to check membership level

  useEffect(() => {
    if (userData?.membership === "free") {
      router.push("/dashboard"); // Redirect to dashboard if membership is "free"
    }
  }, [userData, router]);

  const handleCardClick = (title: string) => {
    router.push(`/flashcard-page/${encodeURIComponent(title)}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredFlashcards = flashcardSets.filter(
    (flashcard) =>
      flashcard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flashcard.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const theme = createTheme({
    palette: {
      primary: {
        main: "#651fff",
      },
      secondary: {
        main: "#4615b2",
      },
      background: {
        default: "#f5f5f5",
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h2: {
        fontWeight: 700,
        color: "#4615b2",
      },
      h6: {
        fontWeight: 500,
        color: "#4615b2",
      },
      body1: {
        fontWeight: 400,
        color: "#fff",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            height: "100%",
            overflow: "hidden",
          },
          body: {
            background: "linear-gradient(135deg, #4615b2 0%, #651fff 100%)",
            color: "#FFFFFF",
            overflow: "hidden", // Prevent scrolling on the entire page
            height: "100%",
          },
        },
      },
    },
  });

  if (!isSignedIn) {
    router.push("/signin");
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.secondary.main,
          padding: 4,
          height: "100vh", // Ensure the container fills the entire viewport height
          overflow: "hidden", // Prevent scrolling inside the container
        }}
      >
        <Typography variant="h2" sx={{ marginBottom: 4 }}>
          Public Flashcards
        </Typography>

        <TextField
          label="Search by title or name"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          sx={{
            marginBottom: 4,
            maxWidth: "600px",
            "& .MuiInputLabel-root": {
              color: theme.palette.secondary.main, // Dark purple label color
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.secondary.main, // Dark purple outline
            },
          }}
          InputLabelProps={{
            style: { color: theme.palette.secondary.main }, // Dark purple label color
          }}
        />

        <Box
          sx={{
            width: "80%", // Set the width of the container
            height: "70vh",
            overflowY: "auto", // Make it scrollable when it reaches max height
            padding: 2,
            borderRadius: 4,
          }}
        >
          <Grid
            container
            spacing={4}
            sx={{
              justifyContent: "center",
            }}
          >
            {filteredFlashcards.length > 0 ? (
              filteredFlashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      width: "100%", // Reduced width
                      height: 220, // Reduced height
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                      padding: 2,
                      boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
                      borderRadius: 4,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      "&:hover": {
                        backgroundColor: "#5117e0",
                      },
                    }}
                    onClick={() => handleCardClick(flashcard.title)}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ color: "#fff" }}
                      >
                        {flashcard.title}
                      </Typography>
                      <Chip
                        label={`${flashcard.terms} terms`}
                        sx={{
                          marginTop: 1,
                          backgroundColor: "#fff",
                          color: theme.palette.secondary.main,
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: 2,
                        }}
                      >
                        <Avatar
                          src={flashcard.userPhoto}
                          alt={flashcard.userName}
                        />
                        <Typography variant="body1" sx={{ marginLeft: 2 }}>
                          {flashcard.userName}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" sx={{ marginTop: 4 }}>
                No flashcards found
              </Typography>
            )}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
