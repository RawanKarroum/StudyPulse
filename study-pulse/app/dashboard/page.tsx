"use client";

import { useUserData } from "../hooks/useUserData";

export default function Dashboard() {
  const { userData, isSignedIn } = useUserData(); // Fetch user data using the custom hook

  if (!isSignedIn) {
    return <p>Please sign in to access the dashboard.</p>;
  }

  return (
    <div>
      <h2>Hello, {userData?.firstName}!</h2>
      {/* Display more user data as needed */}
      <p>Welcome to your dashboard.</p>
    </div>
  );
}
