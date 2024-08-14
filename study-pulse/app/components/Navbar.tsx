"use client";

import { AppBar, Toolbar, Tabs, Tab, Box, Button } from "@mui/material";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";

export default function Navbar() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#651fff' }}>
      <Toolbar>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="primary"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'white', // Change the underline to white
            },
            '& .Mui-selected': {
              color: 'white', // Ensure selected tab text is white
            },
          }}
        >
          <Tab label="Dashboard" sx={{ color: 'white', fontWeight: 'bold' }} />
          <Tab label="Browse Sets" sx={{ color: 'white', fontWeight: 'bold' }} />
        </Tabs>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'white', // Set background color to white
            color: '#4615b2', // Dark purple text
            padding: '8px 16px',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            borderRadius: '20px', // Rounded corners
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
            marginRight: 2,
            '&:hover': {
              backgroundColor: '#f0f0f0', // Slightly darker white on hover
            },
          }}
        >
          Upgrade to Study Pulse Plus
        </Button>
        <UserButton />
      </Toolbar>
    </AppBar>
  );
}
