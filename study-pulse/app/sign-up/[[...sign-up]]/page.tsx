// import { SignUp } from '@clerk/nextjs'

// export default function Page() {
//   return <SignUp />
// }

import { SignUp, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SignUpPage() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

  useEffect(() => {
    const addUserToFirebase = async () => {
      if (isLoaded && signUp?.status === 'complete') {
        const { id, firstName, lastName, emailAddress } = signUp;

        // Call the API route to add the user to Firebase
        await fetch('/api/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            firstName,
            lastName,
            email: emailAddress,
          }),
        });

        // Redirect after successful sign-up
        router.push('/'); // Or any other page you want to redirect to
      }
    };

    addUserToFirebase();
  }, [isLoaded, signUp, router]);

  return <SignUp />;
}
