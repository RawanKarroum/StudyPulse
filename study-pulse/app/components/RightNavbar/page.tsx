import React from 'react';
import { Box, Switch, FormControlLabel } from '@mui/material';

interface NavbarProps {
    handleTimerToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
    timerOn: boolean;
  }

const Navbar: React.FC<NavbarProps> = ({ handleTimerToggle, timerOn }) => {
  return (
    <Box
      sx={{
        width: '150px',
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
        control={<Switch />}
        label="Track Progress"
        labelPlacement="start"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          '& .MuiTypography-root': {
            fontSize: '18px', 
          },
        }}
      />

      <FormControlLabel
        control={<Switch />}
        label="Randomize Cards"
        labelPlacement="start"
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
        labelPlacement="start"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          '& .MuiTypography-root': {
            fontSize: '18px',
          },
        }}
      />

      <FormControlLabel
        control={<Switch />}
        label="Quiz Me"
        labelPlacement="start"
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
