'use client'

import React, { useState } from 'react';
import { Box, IconButton, Modal, Typography, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../../config/firebase';

const AddButton: React.FC<{ title: string, onAdd: (question: string, answer: string) => void }> = ({ title, onAdd }) => {
  const [open, setOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleAdd = async () => {
    onAdd(newQuestion, newAnswer);
    handleClose();
  };

  return (
    <>
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
          onClick={handleOpen}
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-question-modal"
        aria-describedby="add-question-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Add a New Question
          </Typography>
          <TextField
            fullWidth
            label="Question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Answer"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" onClick={handleAdd} sx={{ mt: 2 }}>
            Add Question
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AddButton;
