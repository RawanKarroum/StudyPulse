'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { Box, Card, CardContent, Typography, IconButton, ThemeProvider, CssBaseline, LinearProgress } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material'; 
import TimerModal from '../../components/TimerModal/page';
import Navbar from '../../components/RightNavbar/page';
import CountdownTimer from '../../components/CountdownTimer/page';
import { createTheme } from '@mui/material/styles';
import LeftNavbar from '../../components/LeftNavbar/page'; 

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

    // Shuffle function
    const shuffleArray = (array: { question: string, answer: string }[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // Fetch flashcards
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

    useEffect(() => {
        fetchFlashcards();
    }, [title]);

    // Handle randomize toggle
    const handleRandomizeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const shuffledFlashcards = [...questionsAndAnswers];
            shuffleArray(shuffledFlashcards);
            setQuestionsAndAnswers(shuffledFlashcards);
            setCurrentCardIndex(0);
        } else {
            fetchFlashcards(); // Reset to original order if needed
        }
    };

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
    const progressValue = ((currentCardIndex + 1) / questionsAndAnswers.length) * 100;

    const theme = createTheme({
        palette: {
            primary: {
                main: '#651fff', 
            },
            secondary: {
                main: '#4615b2', 
            },
            background: {
                default: '#f5f5f5',
            },
        },
        typography: {
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            h4: {
                fontWeight: 700,
                color: '#4615b2', 
            },
            body1: {
                fontWeight: 500,
                color: '#4615b2',
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        background: 'linear-gradient(135deg, #4615b2 0%, #651fff 100%)', 
                        color: '#FFFFFF',
                        overflow: 'hidden', 
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', height: '100vh', position: 'relative' }}>
                <LeftNavbar />
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    sx={{
                        padding: '16px',
                        backgroundColor: theme.palette.background.default,
                        flexGrow: 1,
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
                                width: '800px', 
                                height: '450px',
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

                        <Box display="flex" alignItems="center" mt={2}>
                            <IconButton onClick={handlePrev} sx={{ zIndex: 1 }}>
                                <ChevronLeft sx={{ fontSize: 50, color: theme.palette.primary.main }} />
                            </IconButton>
                            <Typography variant="body2" sx={{ fontSize: 24, marginX: 2, color: theme.palette.primary.main }}>
                                {currentCardIndex + 1} / {questionsAndAnswers.length}
                            </Typography>
                            <IconButton onClick={handleNext} sx={{ zIndex: 1 }}>
                                <ChevronRight sx={{ fontSize: 50, color: theme.palette.primary.main }} />
                            </IconButton>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={progressValue}
                            sx={{
                                width: '100%',
                                height: '8px',
                                borderRadius: '5px',
                                marginTop: '16px',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: theme.palette.primary.main,
                                },
                            }}
                        />
                    </Box>

                    <Navbar 
                        handleTimerToggle={handleToggleTimer} 
                        timerOn={timerOn} 
                        handleRandomizeToggle={handleRandomizeToggle} 
                    />

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
            </Box>
        </ThemeProvider>
    );
};

export default FlashcardPage;
