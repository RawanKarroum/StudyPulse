"use client";

import { AppBar, Toolbar, Tabs, Tab, Box, Button } from "@mui/material";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter(); // Initialize the router

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  const handleBrowseClick = () => {
    router.push('/public-flash-cards');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#651fff' }}>
      <Toolbar>
        <Tabs
        >
          <Tab label="Dashboard" onClick={handleDashboardClick} sx={{ color: 'white',  }}/>
          <Tab label="Browse Sets" onClick={handleBrowseClick} sx={{ color: 'white', }}/>
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
