import React from 'react';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddButton: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '20%', 
        transform: 'translateY(-50%)', 
        zIndex: 1000, 
      }}
    >
      <IconButton
        sx={{
          color: '#fff', 
          backgroundColor: '#651fff', 
          borderRadius: '50%',
          padding: '16px',
          '&:hover': {
            backgroundColor: '#7033f5',
            color: '#fff',
          },
        }}
      >
        <AddIcon sx={{ fontSize: 40 }} />
      </IconButton>
    </Box>
  );
};

export default AddButton;
