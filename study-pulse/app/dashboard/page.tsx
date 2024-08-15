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
  IconButton,
  CircularProgress,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Upload } from "@mui/icons-material";
import { createTheme } from "@mui/material/styles";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
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

interface FlashcardSet {
  title: string;
  terms: number;
}

interface Flashcard {
  question: string;
  answer: string;
}

export default function Dashboard() {
  const { userData, isSignedIn } = useUserData();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { question: "", answer: "" },
  ]);
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

  const handleClickOpenGenerate = () => {
    if (
      userData?.membership === "free" &&
      flashcardSets.length >= maxFreeFlashcards
    ) {
      setUploadStatus(
        `Upgrade to create more than ${maxFreeFlashcards} flashcard sets.`
      );
    } else {
      setOpenGenerate(true);
    }
  };

  const handleClickOpenCreate = () => {
    if (
      userData?.membership === "free" &&
      flashcardSets.length >= maxFreeFlashcards
    ) {
      setUploadStatus(
        `Upgrade to create more than ${maxFreeFlashcards} flashcard sets.`
      );
    } else {
      setOpenCreate(true);
    }
  };

  const handleCloseGenerate = () => {
    setOpenGenerate(false);
    setUploadStatus("");
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setTitle("");
    setFlashcards([{ question: "", answer: "" }]);
    setUploadStatus("");
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleFlashcardChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
    field: "question" | "answer"
  ) => {
    const newFlashcards = [...flashcards];
    newFlashcards[index][field] = event.target.value;
    setFlashcards(newFlashcards);
  };

  const addFlashcard = () => {
    setFlashcards([...flashcards, { question: "", answer: "" }]);
  };

  const handleSubmitCreate = async () => {
    if (!title.trim()) {
      setUploadStatus("Please enter a title for your flashcard set.");
      return;
    }

    if (flashcards.some((fc) => !fc.question.trim() || !fc.answer.trim())) {
      setUploadStatus("Please complete all flashcards before submitting.");
      return;
    }

    try {
      await setDoc(doc(db, "flashcards", title), {
        flashcards: flashcards,
        userId: userData?.id,
      });

      setUploadStatus("Flashcard set created successfully!");
      handleCloseCreate();

      // Use a full page reload as a fallback
      window.location.reload();
    } catch (error) {
      setUploadStatus("Error creating flashcard set.");
      console.error("Upload Error:", error);
    }
  };

  const handleSubmitGenerate = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setUploadStatus("Please enter a title for your flashcard set.");
      return;
    }

    if (!textContent.trim() && !file) {
      setUploadStatus("Please enter text content or upload a file.");
      return;
    }

    setUploadStatus(""); // Clear any previous status
    setLoading(true); // Start the loading indicator

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

      setLoading(false); // Stop the loading indicator

      if (!response.ok) {
        const errorData = await response.json();
        setUploadStatus(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();

      if (!data.questionsAndAnswers || data.questionsAndAnswers.length === 0) {
        setUploadStatus(
          "Error: No flashcards were generated. Please try again."
        );
        return;
      }

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
      setLoading(false); // Stop the loading indicator
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
            onClick={handleClickOpenGenerate}
          >
            <AutoAwesomeIcon sx={{ fontSize: 60, marginBottom: 2 }} />
            <Typography variant="h5">Generate Flashcards</Typography>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Automatically create flashcards from notes.
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
            onClick={handleClickOpenCreate}
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
            ""
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

        {/* Modal for Creating Flashcards */}
        <Dialog
          open={openCreate}
          onClose={handleCloseCreate}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              textAlign: "center",
              fontWeight: 700,
              padding: 2,
            }}
          >
            Create Flashcard Set
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: theme.palette.background.default,
              padding: 3,
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              label="Flashcard Set Title"
              fullWidth
              variant="outlined"
              value={title}
              onChange={handleTitleChange}
              sx={{
                marginBottom: 3,
                "& .MuiInputLabel-root": {
                  color: theme.palette.secondary.main, // Dark purple label color
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.secondary.main,
                },
                "& .MuiInputBase-input": {
                  color: theme.palette.secondary.main, // Dark purple text color
                },
                "& .MuiInputBase-input::placeholder": {
                  color: theme.palette.secondary.main, // Dark purple placeholder text
                  opacity: 1,
                },
              }}
              placeholder="Enter the title of your flashcard set"
            />
            {flashcards.map((flashcard, index) => (
              <Box
                key={index}
                sx={{
                  padding: 2,
                  marginBottom: 2,
                  border: `1px solid ${theme.palette.secondary.main}`, // Dark purple border
                  borderRadius: 4,
                }}
              >
                <TextField
                  label={`Question ${index + 1}`}
                  fullWidth
                  variant="outlined"
                  value={flashcard.question}
                  onChange={(e: any) =>
                    handleFlashcardChange(index, e, "question")
                  }
                  sx={{
                    marginBottom: 2,
                    "& .MuiInputLabel-root": {
                      color: theme.palette.secondary.main, // Dark purple label color for the question
                    },
                    "& .MuiInputBase-input": {
                      color: theme.palette.secondary.main, // Dark purple text color
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: theme.palette.secondary.main, // Dark purple placeholder text
                      opacity: 1,
                    },
                  }}
                  placeholder="Enter the question"
                />
                <TextField
                  label={`Answer ${index + 1}`}
                  fullWidth
                  variant="outlined"
                  value={flashcard.answer}
                  onChange={(e: any) =>
                    handleFlashcardChange(index, e, "answer")
                  }
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: theme.palette.secondary.main, // Dark purple label color for the answer
                    },
                    "& .MuiInputBase-input": {
                      color: theme.palette.secondary.main, // Dark purple text color
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: theme.palette.secondary.main, // Dark purple placeholder text
                      opacity: 1,
                    },
                  }}
                  placeholder="Enter the answer"
                />
              </Box>
            ))}
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <IconButton
                color="primary"
                onClick={addFlashcard}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#5117e0",
                  },
                }}
              >
                <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: theme.palette.background.default,
              padding: 2,
              justifyContent: "center",
            }}
          >
            <Button
              onClick={handleCloseCreate}
              color="secondary"
              sx={{ marginRight: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await handleSubmitCreate();
                router.refresh(); // Refresh the page after submission
              }}
              color="primary"
              variant="contained"
              disabled={
                userData?.membership === "free" &&
                flashcardSets.length >= maxFreeFlashcards
              }
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "30px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor: "#5117e0",
                },
              }}
            >
              Create Flashcard Set
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal for Generating Flashcards */}
        <Dialog
          open={openGenerate}
          onClose={handleCloseGenerate}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              textAlign: "center",
              fontWeight: 700,
              padding: 2,
            }}
          >
            Generate Flashcard Set
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: theme.palette.background.default,
              padding: 3,
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              label="Flashcard Set Title"
              fullWidth
              variant="outlined"
              value={title}
              onChange={handleTitleChange}
              sx={{
                marginBottom: 3,
                "& .MuiInputLabel-root": {
                  color: theme.palette.secondary.main,
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.secondary.main,
                },
              }}
            />
            <TextareaAutosize
              minRows={6}
              placeholder="Paste your notes here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "16px",
                borderRadius: "4px",
                borderColor: theme.palette.secondary.main,
                fontFamily:
                  '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: "1rem",
              }}
            />
            <Box sx={{ marginTop: 3, display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<Upload />}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "30px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    backgroundColor: "#5117e0",
                  },
                }}
              >
                Upload File
                <input
                  type="file"
                  accept=".txt,.pdf"
                  hidden
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                />
              </Button>
              {file && (
                <Typography
                  variant="body2"
                  sx={{
                    marginLeft: 2,
                    color: theme.palette.secondary.main,
                    fontWeight: 500,
                  }}
                >
                  {file.name}
                </Typography>
              )}
            </Box>
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
              </Box>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: theme.palette.background.default,
              padding: 2,
              justifyContent: "center",
            }}
          >
            <Button
              onClick={handleCloseGenerate}
              color="secondary"
              sx={{ marginRight: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitGenerate}
              color="primary"
              variant="contained"
              disabled={
                userData?.membership === "free" &&
                flashcardSets.length >= maxFreeFlashcards
              }
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "30px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor: "#5117e0",
                },
              }}
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
