'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Button } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';

const FlashcardPage: React.FC = () => {
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<{ question: string, answer: string }[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const aiResponse = searchParams.get('aiResponse');

    if (aiResponse) {
      try {
        const data = JSON.parse(aiResponse);
        setQuestionsAndAnswers(data); 
        console.log("Questions and Answers received:", data); 
      } catch (error) {
        console.error('Error parsing AI response:', error);
      }
    }
  }, [searchParams]);

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
    return <Typography variant="h6">No questions and answers available.</Typography>;
  }

  const currentQA = questionsAndAnswers[currentCardIndex];

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
