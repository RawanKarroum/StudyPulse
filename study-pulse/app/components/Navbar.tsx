"use client";

import { AppBar, Toolbar, Tabs, Tab, Box, Button, Tooltip } from "@mui/material";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useUserData } from '../hooks/useUserData'; // Adjust the import according to your file structure

export default function Navbar() {
  const router = useRouter(); // Initialize the router
  const { userData } = useUserData(); // Assuming useUserData provides user information including membership

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  const handleSubscriptionClick = () => {
    router.push('/subscription');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#651fff' }}>
      <Toolbar>
        <Tabs>
          <Tab label="Dashboard" onClick={handleDashboardClick} sx={{ color: 'white' }}/>
          {userData?.membership === 'free' ? (
            <Tooltip title="Buy the membership to access" arrow>
              <span>
                <Tab
                  label="Browse Sets"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)', // Less visible
                    pointerEvents: 'none', // Make it unclickable
                  }}
                />
              </span>
            </Tooltip>
          ) : (
            <Tab
              label="Browse Sets"
              onClick={() => router.push('/public-flash-cards')}
              sx={{ color: 'white' }}
            />
          )}
        </Tabs>
        <Box sx={{ flexGrow: 1 }} />
        {userData?.membership === 'free' && (
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
            onClick={handleSubscriptionClick}
          >
            Upgrade to Study Pulse Plus
          </Button>
        )}
        <UserButton afterSignOutUrl="/signin" />
      </Toolbar>
    </AppBar>
  );
}
