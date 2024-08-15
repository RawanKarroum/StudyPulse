"use client";

import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TextareaAutosize,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { createTheme } from "@mui/material/styles";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  setDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useUserData } from "../hooks/useUserData";

export default function Dashboard() {
  const { userData, isSignedIn } = useUserData();
  const [flashcardSets, setFlashcardSets] = useState<
    { title: string; terms: number }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const router = useRouter();

  const maxFreeFlashcards = 5;

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        if (userData?.id) {
          const q = query(
            collection(db, "flashcards"),
            where("userId", "==", userData.id)
          );
          const querySnapshot = await getDocs(q);
          const flashcards = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              title: doc.id,
              terms: data.flashcards?.length || 0,
            };
          });
          setFlashcardSets(flashcards);
        }
      } catch (error) {
        console.error("Error fetching flashcard sets: ", error);
      }
    };

    fetchFlashcardSets();
  }, [userData]);

  const handleCardClick = (title: string) => {
    router.push(`/flashcard-page/${encodeURIComponent(title)}`);
  };

  const handleClickOpen = () => {
    if (
      userData?.membership === "free" &&
      flashcardSets.length >= maxFreeFlashcards
    ) {
      setUploadStatus(
        `Upgrade to create more than ${maxFreeFlashcards} flashcard sets.`
      );
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(event.target.value);
    setFile(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    setFile(uploadedFile);
    setTextContent("");
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setUploadStatus("Please enter a title for your flashcard set.");
      return;
    }

    if (!textContent.trim() && !file) {
      setUploadStatus("Please enter text content or upload a file.");
      return;
    }

    let formData: FormData | null = null;
    let requestBody: any = null;
    let headers: HeadersInit = {};

    if (file) {
      formData = new FormData();
      formData.append("file", file);
    } else if (textContent.trim()) {
      headers = {
        "Content-Type": "application/json",
      };
      requestBody = JSON.stringify({ textContent });
    }

    try {
      const response = await fetch("/api/generate-qa", {
        method: "POST",
        body: formData || requestBody,
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setUploadStatus(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      setUploadStatus("Content processed successfully!");

      await setDoc(doc(db, "flashcards", title), {
        flashcards: data.questionsAndAnswers,
        userId: userData?.id,
      });

      router.push(
        `/flashcard-page/${encodeURIComponent(
          title
        )}?aiResponse=${encodeURIComponent(
          JSON.stringify(data.questionsAndAnswers)
        )}`
      );
    } catch (error) {
      setUploadStatus("Error processing content.");
      console.error("Upload Error:", error);
    }
  };

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
            height: "100%",
            background: "linear-gradient(135deg, #4615b2 0%, #651fff 100%)",
            color: "#FFFFFF",
            overflow: "hidden",
          },
        },
      },
    },
  });

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
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.secondary.main,
          padding: 4,
          overflow: "hidden",
        }}
      >
        <Box sx={{ textAlign: "center", marginBottom: 4 }}>
          <Typography variant="h2" sx={{ marginBottom: 2 }}>
            Study Pulse
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 6 }}>
            Your AI-powered flashcards app. Generate flashcards using AI or
            create them manually.
          </Typography>
        </Box>

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
              width: 300,
              height: 350,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
              borderRadius: 4,
              padding: 2,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#5117e0",
              },
            }}
            onClick={handleClickOpen}
          >
            <AutoAwesomeIcon sx={{ fontSize: 60, marginBottom: 2 }} />
            <Typography variant="h5">Generate Flashcards</Typography>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Automatically create flashcards from your notes.
            </Typography>
          </Box>

          <Box
            sx={{
              width: 300,
              height: 350,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
              borderRadius: 4,
              padding: 2,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#5117e0",
              },
            }}
            onClick={handleClickOpen}
          >
            <CreateNewFolderIcon sx={{ fontSize: 60, marginBottom: 2 }} />
            <Typography variant="h5">Create Flashcards</Typography>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Manually build your own flashcards.
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h5"
          sx={{ marginBottom: 2, color: theme.palette.secondary.main }}
        >
          Your Flashcard Sets
        </Typography>

        <Box sx={{ textAlign: "center", marginBottom: 4 }}>
          {userData?.membership === "free" ? (
            <Typography variant="h6">
              {flashcardSets.length}/{maxFreeFlashcards} Flashcard Sets Created
            </Typography>
          ) : (
            <Typography variant="h6">Unlimited Flashcard Sets</Typography>
          )}
        </Box>

        <Box
          sx={{
            width: "60%",
            maxHeight: "40%",
            overflowY: "auto",
            padding: 2,
            borderRadius: 4,
          }}
        >
          {flashcardSets.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {flashcardSets.map((flashcard, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 260,
                    height: 160,
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                    padding: 2,
                    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
                    borderRadius: 4,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#5117e0",
                    },
                    textAlign: "center",
                  }}
                  onClick={() => handleCardClick(flashcard.title)}
                >
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
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="h6">No flashcards available.</Typography>
          )}
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create Flashcard Set</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Flashcard Set Title"
              fullWidth
              variant="standard"
              value={title}
              onChange={handleTitleChange}
            />
            <TextareaAutosize
              minRows={6}
              placeholder="Paste your notes here..."
              value={textContent}
              onChange={handleTextChange}
              style={{ width: "100%", marginTop: "16px" }}
            />
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileChange}
              style={{ marginTop: "16px", width: "100%" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              disabled={
                userData?.membership === "free" &&
                flashcardSets.length >= maxFreeFlashcards
              }
            >
              Generate Flashcards
            </Button>
          </DialogActions>
        </Dialog>

        <p>{uploadStatus}</p>
      </Container>
    </ThemeProvider>
  );
}
