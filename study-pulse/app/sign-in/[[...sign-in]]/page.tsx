// import { SignIn } from '@clerk/nextjs'

// export default function Page() {
//   return <SignIn />
// }
import { SignIn, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const { userId, isSignedIn } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn && userId) {
        try {
          const response = await fetch(`/api/get-user-data?id=${userId}`);

          if (response.ok) {
            const data = await response.json();
            setUserData(data);
            console.log('User data fetched:', data);
          } else {
            console.error('Failed to fetch user data:', await response.json());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [isSignedIn, userId]);

  return (
      <SignIn />
  );
}
