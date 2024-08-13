"use client";
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { userId, isSignedIn, isLoaded } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const handleUserAuth = async () => {
      if (isLoaded && isSignedIn && userId) {
        try {
          // Try to fetch the user data from Firebase
          const response = await fetch(`/api/get-user-data?id=${userId}`);
          
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
            console.log('User data fetched:', data);
          } else if (response.status === 404) {
            // User not found in Firebase, assume this is a new sign-up and add them
            console.log('User not found, adding to Firebase:', userId);
            const addResponse = await fetch('/api/sign-up', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: userId,
                firstName: "FirstNamePlaceholder", // Replace with actual data
                lastName: "LastNamePlaceholder",   // Replace with actual data
                email: "EmailPlaceholder",         // Replace with actual data
              }),
            });

            if (addResponse.ok) {
              console.log('User added to Firebase');
              const newData = await addResponse.json();
              setUserData(newData);
            } else {
              console.error('Failed to add user to Firebase:', await addResponse.json());
            }
          } else {
            console.error('Failed to fetch user data:', await response.json());
          }
        } catch (error) {
          console.error('Error in handling user authentication:', error);
        }
      }
    };

    handleUserAuth();
  }, [isLoaded, isSignedIn, userId]);

  return (
    <main>
      {isSignedIn ? (
        <div>
          <h2>Welcome back, {userData?.firstName}!</h2>
          {/* Display more user data as needed */}
        </div>
      ) : (
        <div>
          <p>Please sign in or sign up to access your account.</p>
        </div>
      )}
    </main>
  );
}
