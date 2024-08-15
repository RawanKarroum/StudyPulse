import React from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

interface TimerModalProps {
  open: boolean;
  onClose: () => void;
  timerValue: number | null;
  onTimerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  startTimer: () => void;
}

const TimerModal: React.FC<TimerModalProps> = ({ open, onClose, timerValue, onTimerChange, startTimer }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <TextField
          label="Set Timer (minutes)"
          type="number"
          value={timerValue || ''}
          onChange={onTimerChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" color="primary" onClick={startTimer}>
          Start Timer
        </Button>
      </Box>
    </Modal>
  );
};

export default TimerModal;
