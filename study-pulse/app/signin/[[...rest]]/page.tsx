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
      <>
        <SignIn forceRedirectUrl="/dashboard" />
      </>
    </Container>
  );
}
