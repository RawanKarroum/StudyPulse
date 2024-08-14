'use client';

import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { setDoc, doc, collection, getDocs } from 'firebase/firestore';
import { db } from './config/firebase'; 
import { Box, Card, CardContent, Typography, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, TextareaAutosize } from '@mui/material';

const HomePage: React.FC = () => {
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

  // useEffect(() => {
  //   // Automatically redirect to the landing page
  //   router.push('/signin');
  // }, [router]);

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

  return (
    <Box sx={{ padding: '16px' }}>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Create Flashcard Set
      </Button>

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
    </Box>
  );
};

export default HomePage;
