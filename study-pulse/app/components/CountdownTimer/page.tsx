import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

interface CountdownTimerProps {
    countdown: number;
    onTimerEnd: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ countdown, onTimerEnd }) => {
    const [timeLeft, setTimeLeft] = useState(countdown);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimerEnd();
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, onTimerEnd]);

    const formatTime = (value: number) => value.toString().padStart(2, '0');

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 20px',
                backgroundColor: '#333',
                color: '#fff',
                borderRadius: '8px',
                boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                position: 'fixed',
                top: '20%',
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
                }}
            >
                <Box sx={{ textAlign: 'center', margin: '0 4px' }}>
                    <Typography
                        variant="h5"
                        sx={{
                            background: 'linear-gradient(to bottom, #fdfdfd 50%, #edebeb 50%)',
                            borderRadius: '5px',
                            padding: '10px',
                            width: '40px',
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
                            background: 'linear-gradient(to bottom, #fdfdfd 50%, #edebeb 50%)',
                            borderRadius: '5px',
                            padding: '10px',
                            width: '40px',
                        }}
                    >
                        {formatTime(secs)}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: '5px' }}>
                        secs
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default CountdownTimer;
