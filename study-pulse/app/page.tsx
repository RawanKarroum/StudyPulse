'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TextareaAutosize,
} from '@mui/material';

export default function Home() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const router = useRouter();

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

      router.push(`/flashcard-page/${encodeURIComponent(title)}?aiResponse=${encodeURIComponent(JSON.stringify(data.questionsAndAnswers))}`);
    } catch (error) {
      setUploadStatus('Error processing content.');
      console.error('Upload Error:', error);
    }
  };

  return (
    <div>
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
    </div>
  );
}
