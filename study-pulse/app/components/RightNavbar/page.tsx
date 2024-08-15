"use client";

import React from "react";
import { Box, Switch, FormControlLabel } from "@mui/material";

interface NavbarProps {
    handleTimerToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
    timerOn: boolean;
    handleRandomizeToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleTimerToggle, timerOn, handleRandomizeToggle }) => {
    return (
        <Box
            sx={{
                width: '180px',
                height: '500px',
                backgroundColor: '#f0f0f0',
                borderRadius: '12px',
                padding: '16px',
                position: 'absolute',
                top: '25%',
                right: '5%',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                justifyContent: 'space-evenly',
            }}
        >
            <FormControlLabel
                control={<Switch onChange={handleRandomizeToggle} />}
                label="Randomize Cards"
                labelPlacement="end"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    '& .MuiTypography-root': {
                        fontSize: '18px',
                    },
                }}
            />

            <FormControlLabel
                control={<Switch checked={timerOn} onChange={handleTimerToggle} />}
                label="Timer"
                labelPlacement="end"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    '& .MuiTypography-root': {
                        fontSize: '18px',
                    },
                }}
            />
        </Box>
    );
};

export default Navbar;
