"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useUserData } from "../../hooks/useUserData";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";

export default function LandingPage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const { isSignedIn } = useUserData(); // Use the custom hook
  const router = useRouter();

  // Automatically redirect to dashboard if user is signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1>Welcome to Study Pulse</h1>
      {showSignUp ? (
        <>
          <SignUp forceRedirectUrl="/dashboard" />
          <p>
            Already have an account?{" "}
            <button onClick={() => setShowSignUp(false)}>Sign In</button>
          </p>
        </>
      ) : (
        <>
          <SignIn forceRedirectUrl="/dashboard" />
          <p>
            Don&apos;t have an account?{" "}
            <button onClick={() => setShowSignUp(true)}>Sign Up</button>
          </p>
        </>
      )}
    </Container>
  );
}
