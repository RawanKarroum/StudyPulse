'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
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
        position: 'relative',
      }}
    >
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ position: 'absolute', top: '20%', textAlign: 'center' }} 
      >
        {decodedTitle}
      </Typography>

      <Box
        sx={{
          perspective: '1000px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: '10%', 
        }}
      >
        <Box
          onClick={handleFlip}
          sx={{
            width: '700px',  
            height: '400px',  
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateX(180deg)' : 'none',
          }}
        >
          <Card
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backfaceVisibility: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
            }}
          >
            <CardContent>
              <Typography variant="h5">
                {currentQA?.question}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backfaceVisibility: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              transform: 'rotateX(180deg)',
            }}
          >
            <CardContent>
              <Typography variant="h5">
                {currentQA?.answer}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <IconButton onClick={handlePrev} sx={{ zIndex: 1, mr: 2 }}>
            <ArrowBackIos sx={{ fontSize: 40 }} />
          </IconButton>
          <Typography variant="body1" sx={{ fontSize: '18px', mx: 2 }}>
            {currentCardIndex + 1} / {questionsAndAnswers.length}
          </Typography>
          <IconButton onClick={handleNext} sx={{ zIndex: 1, ml: 2 }}>
            <ArrowForwardIos sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default FlashcardPage;
