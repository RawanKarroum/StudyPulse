import React from 'react';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const LeftNavbar: React.FC = () => {
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
        left: '5%',  // Adjusted to align with the flashcard
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        justifyContent: 'space-evenly',
      }}
    >
      <IconButton
        sx={{
          color: '#4A90E2',
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '12px',
          '&:hover': {
            backgroundColor: '#4A90E2',
            color: '#fff',
          },
        }}
      >
        <AddIcon sx={{ fontSize: 32 }} />
      </IconButton>
      <IconButton
        sx={{
          color: '#fff',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: '#4A90E2',
            color: '#fff',
          },
        }}
      >
        <ShareIcon sx={{ fontSize: 28 }} />
      </IconButton>
      <IconButton
        sx={{
          color: '#fff',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: '#4A90E2',
            color: '#fff',
          },
        }}
      >
        <FileCopyIcon sx={{ fontSize: 28 }} />
      </IconButton>
    </Box>
  );
};

export default LeftNavbar;
