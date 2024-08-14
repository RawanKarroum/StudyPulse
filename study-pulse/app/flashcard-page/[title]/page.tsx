'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import TimerModal from '../../components/TimerModal/page';
import Navbar from '../../components/RightNavbar/page'; 
import CountdownTimer from '../../components/CountdownTimer/page';

const FlashcardPage: React.FC = () => {
    const [questionsAndAnswers, setQuestionsAndAnswers] = useState<{ question: string, answer: string }[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [timerModalOpen, setTimerModalOpen] = useState(false);
    const [timerValue, setTimerValue] = useState<number | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [timerOn, setTimerOn] = useState(false); 
    const { title } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const docRef = doc(db, "flashcards", decodeURIComponent(title as string));
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
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

    const handleToggleTimer = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setTimerOn(isChecked);  
        setTimerModalOpen(isChecked);
        if (!isChecked) {
            setCountdown(null); 
            setTimerValue(null);
        }
    };

    const handleTimerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimerValue(Number(event.target.value));
    };

    const startTimer = () => {
        if (timerValue !== null && timerValue > 0) {
            setCountdown(timerValue * 60);
            setTimerModalOpen(false);
        }
    };

    const handleTimerEnd = () => {
        alert('Time is up!');
        setCountdown(null);
        setTimerValue(null);
        setTimerOn(false);  
        setTimerModalOpen(false);
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
            <Typography variant="h4" gutterBottom sx={{ position: 'absolute', top: '10%', textAlign: 'center' }}>
                {decodedTitle}
            </Typography>

            <Box
                sx={{
                    perspective: '1000px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
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

                <Typography variant="body1" sx={{ marginTop: '16px' }}>
                    {currentCardIndex + 1} / {questionsAndAnswers.length}
                </Typography>

                <Box display="flex" justifyContent="center" mt={2}>
                    <IconButton onClick={handlePrev} sx={{ zIndex: 1 }}>
                        <ArrowBackIos sx={{ fontSize: 40 }} />
                    </IconButton>
                    <Typography variant="body2" sx={{ fontSize: 24, marginX: 2 }}>
                        {currentCardIndex + 1} / {questionsAndAnswers.length}
                    </Typography>
                    <IconButton onClick={handleNext} sx={{ zIndex: 1 }}>
                        <ArrowForwardIos sx={{ fontSize: 40 }} />
                    </IconButton>
                </Box>
            </Box>

            <Navbar handleTimerToggle={handleToggleTimer} timerOn={timerOn} />

            <TimerModal
                open={timerModalOpen}
                onClose={() => setTimerModalOpen(false)}
                timerValue={timerValue}
                onTimerChange={handleTimerChange}
                startTimer={startTimer}
            />

            {countdown !== null && (
                <CountdownTimer countdown={countdown} onTimerEnd={handleTimerEnd} />
            )}
        </Box>
    );
};

export default FlashcardPage;
