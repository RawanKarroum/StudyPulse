"use client";

import React from "react";
import { Box, Switch, FormControlLabel } from "@mui/material";

interface NavbarProps {
    handleTimerToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
    timerOn: boolean;
    handleRandomizeToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RightNavbar: React.FC<NavbarProps> = ({ handleTimerToggle, timerOn, handleRandomizeToggle }) => {
    return (
        <Box
            sx={{
                width: '180px',
                height: '300px',
                background: 'linear-gradient(135deg, #320e8d 0%, #5e18c1 50%, #651fff 100%)', 
                borderRadius: '12px',
                padding: '16px',
                position: 'absolute',
                top: '30%',
                right: '15%', 
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                justifyContent: 'space-evenly',
            }}
        >
            <FormControlLabel
                control={
                    <Switch 
                        onChange={handleRandomizeToggle} 
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#fff',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#fff',
                            },
                        }}
                    />
                }
                label="Randomize Cards"
                labelPlacement="start" 
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#fff',
                    fontWeight: 'bold',
                    alignItems: 'center',
                    '& .MuiTypography-root': {
                        fontSize: '18px',
                        color: '#fff',
                    },
                }}
            />

            <FormControlLabel
                control={
                    <Switch 
                        checked={timerOn} 
                        onChange={handleTimerToggle} 
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#fff',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#fff',
                            },
                        }}
                    />
                }
                label="Timer"
                labelPlacement="start" 
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#fff', 
                    fontWeight: 'bold',
                    alignItems: 'center',
                    '& .MuiTypography-root': {
                        fontSize: '18px',
                        color: '#fff',
                    },
                }}
            />
        </Box>
    );
};

export default RightNavbar;
