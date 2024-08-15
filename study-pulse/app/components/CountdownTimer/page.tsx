'use client'

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface CountdownTimerProps {
    countdown: number;
    onTimerEnd: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ countdown, onTimerEnd }) => {
    const [timeLeft, setTimeLeft] = useState(countdown);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimerEnd();
            return;
        }

        if (!isPaused) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [timeLeft, isPaused, onTimerEnd]);

    const formatTime = (value: number) => value.toString().padStart(2, '0');

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    const handlePause = () => {
        setIsPaused(true);
    };

    const handleStart = () => {
        setIsPaused(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 24px',
                backgroundColor: '#651fff',
                color: '#fff',
                borderRadius: '12px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
                position: 'fixed',
                top: '10%',
                left: '20px',
            }}
        >
            <Typography variant="h6" gutterBottom>
                Time Remaining
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '16px',
                }}
            >
                <Box sx={{ textAlign: 'center', margin: '0 4px' }}>
                    <Typography
                        variant="h5"
                        sx={{
                            background: 'linear-gradient(to bottom, #d1c4e9 50%, #b39ddb 50%)',
                            borderRadius: '8px',
                            padding: '12px',
                            width: '50px',
                            color: '#4615b2',
                        }}
                    >
                        {formatTime(mins)}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: '5px' }}>
                        mins
                    </Typography>
                </Box>
                <Box sx={{ fontSize: '2rem', margin: '0 4px' }}>:</Box>
                <Box sx={{ textAlign: 'center', margin: '0 4px' }}>
                    <Typography
                        variant="h5"
                        sx={{
                            background: 'linear-gradient(to bottom, #d1c4e9 50%, #b39ddb 50%)',
                            borderRadius: '8px',
                            padding: '12px',
                            width: '50px',
                            color: '#4615b2',
                        }}
                    >
                        {formatTime(secs)}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: '5px' }}>
                        secs
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '12px' }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: isPaused ? '#651fff' : '#4615b2',
                        '&:hover': {
                            backgroundColor: isPaused ? '#573cce' : '#3b129f',
                        },
                        color: '#fff',
                    }}
                    onClick={isPaused ? handleStart : handlePause}
                >
                    {isPaused ? 'Start' : 'Pause'}
                </Button>
            </Box>
        </Box>
    );
};

export default CountdownTimer;
