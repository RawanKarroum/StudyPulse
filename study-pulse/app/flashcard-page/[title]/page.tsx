'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { Box, Card, CardContent, Typography, IconButton, Button } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const FlashcardPage: React.FC = () => {
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<{ question: string, answer: string }[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { title } = useParams();
  const router = useRouter();

useEffect(() => {
  const fetchFlashcards = async () => {
    try {
      const docRef = doc(db, "flashcards", decodeURIComponent(title as string));
      console.log("Fetching document with title:", decodeURIComponent(title as string)); 
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data()); 
        setQuestionsAndAnswers(docSnap.data().flashcards);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  fetchFlashcards();
}, [title]);


  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % questionsAndAnswers.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? questionsAndAnswers.length - 1 : prevIndex - 1
    );
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (!questionsAndAnswers.length) {
    return <Typography variant="h6">No flashcards found.</Typography>;
  }

  const currentQA = questionsAndAnswers[currentCardIndex];
  const decodedTitle = decodeURIComponent(title as string);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
      sx={{
        padding: '16px',
        backgroundColor: '#ffffff',
      }}
    >
      <Typography variant="h4" gutterBottom>
        {decodedTitle}
      </Typography>

      <Box display="flex" alignItems="center">
        <IconButton onClick={handlePrev} sx={{ zIndex: 1 }}>
          <ArrowBackIos sx={{ fontSize: 40 }} />
        </IconButton>
        
        <Card
          onClick={handleFlip}
          sx={{
            width: 400,
            height: 250,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            marginX: 2,
            backgroundColor: '#f0f0f0',
          }}
        >
          <CardContent>
            <Typography variant="h5">
              {isFlipped ? currentQA?.answer : currentQA?.question}
            </Typography>
          </CardContent>
        </Card>

        <IconButton onClick={handleNext} sx={{ zIndex: 1 }}>
          <ArrowForwardIos sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        onClick={handleFlip}
        sx={{
          mt: 2,
          backgroundColor: '#1976d2',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#115293',
          },
          zIndex: 1,
        }}
      >
        Flip Card
      </Button>
    </Box>
  );
};

export default FlashcardPage;
