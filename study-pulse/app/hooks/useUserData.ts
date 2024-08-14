"use client";

import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export function useUserData() {
  const { userId, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const handleUserAuth = async () => {
      if (!isLoaded || !isSignedIn || !userId) {
        return;
      }

      try {
        // Try to fetch the user data from Firebase
        const response = await fetch(`/api/get-user-data?id=${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          console.log('User data fetched:', data);
        } else if (response.status === 404) {
          // User not found in Firebase, assume this is a new sign-up and add them
          const newUserData = {
            id: userId,
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.primaryEmailAddress?.emailAddress || '',
            membership: 'free',
          };
          const addResponse = await fetch('/api/sign-up', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
          });

          if (addResponse.ok) {
            console.log('User added to Firebase');
            setUserData(newUserData);
          } else {
            console.error('Failed to add user to Firebase:', await addResponse.json());
          }
        } else {
          console.error('Failed to fetch user data:', await response.json());
        }
      } catch (error) {
        console.error('Error in handling user authentication:', error);
      }
    };

    handleUserAuth();
  }, [isLoaded, isSignedIn, userId]);

  return { userData, isSignedIn, isLoaded };
}
