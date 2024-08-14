"use client";

import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { setDoc, doc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ThemeProvider, CssBaseline, Container, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, TextareaAutosize, Grid, Card, CardContent, useMediaQuery } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { createTheme } from '@mui/material/styles';
import { useUserData } from "../hooks/useUserData";

export default function Dashboard() {
  const { userData, isSignedIn } = useUserData();
  const [flashcardSets, setFlashcardSets] = useState<{ title: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "flashcards"));
        const flashcards = querySnapshot.docs.map(doc => ({
          title: doc.id,
        }));
        setFlashcardSets(flashcards);
      } catch (error) {
        console.error("Error fetching flashcard sets: ", error);
      }
    };

    fetchFlashcardSets();
  }, []);

  const handleCardClick = (title: string) => {
    router.push(`/flashcard-page/${encodeURIComponent(title)}`);
  };

  const handleClickOpen = () => {
    setOpen(true);
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
    setTextContent('');
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setUploadStatus('Please enter a title for your flashcard set.');
      return;
    }

    if (!textContent.trim() && !file) {
      setUploadStatus('Please enter text content or upload a file.');
      return;
    }

    let formData: FormData | null = null;
    let requestBody: any = null;
    let headers: HeadersInit = {};

    if (file) {
      formData = new FormData();
      formData.append('file', file);
    } else if (textContent.trim()) {
      headers = {
        'Content-Type': 'application/json',
      };
      requestBody = JSON.stringify({ textContent });
    }

    try {
      const response = await fetch('/api/generate-qa', {
        method: 'POST',
        body: formData || requestBody,
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setUploadStatus(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      setUploadStatus('Content processed successfully!');

      await setDoc(doc(db, 'flashcards', title), {
        flashcards: data.questionsAndAnswers
      });

      router.push(`/flashcard-page/${encodeURIComponent(title)}?aiResponse=${encodeURIComponent(JSON.stringify(data.questionsAndAnswers))}`);
    } catch (error) {
      setUploadStatus('Error processing content.');
      console.error('Upload Error:', error);
    }
  };

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
            onClick={handleClickOpen} // Open dialog on click
          >
            <AutoAwesomeIcon sx={{ fontSize: 50 }} />
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
            <CreateNewFolderIcon sx={{ fontSize: 50 }} />
            Create Flashcards
          </Button>
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
              style={{ width: '100%', marginTop: '16px' }}
            />
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileChange}
              style={{ marginTop: '16px', width: '100%' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Generate Flashcards
            </Button>
          </DialogActions>
        </Dialog>

        <p>{uploadStatus}</p>

        {flashcardSets.length === 0 ? (
          <Typography variant="h6">No flashcards found.</Typography>
        ) : (
          <Grid container spacing={2} sx={{ marginTop: '16px' }}>
            {flashcardSets.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleCardClick(flashcard.title)}
                >
                  <CardContent>
                    <Typography variant="h6">{flashcard.title}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
}
