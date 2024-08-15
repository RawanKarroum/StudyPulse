// app/public-flash-cards/page.tsx
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "../../config/firebase"; // Update the import path according to your project structure
import PublicCards from "../components/PublicCards";
import { collection, getDocs } from "firebase/firestore";

export default async function PublicFlashCardsPage() {
  const querySnapshot = await getDocs(collection(db, "flashcards"));
  const flashcards = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data();

      // Proceed even if the userId is missing
      let userName = "Anonymous";
      let userPhoto = "";

      if (data.userId) {
        try {
          const user = await clerkClient.users.getUser(data.userId);
          userName = `${user.firstName || "Anonymous"} ${user.lastName || ""}`;
          userPhoto = user.imageUrl || "";
        } catch (error) {
          console.error("Error fetching user data from Clerk:", error);
        }
      }

      return {
        title: doc.id,
        terms: data.flashcards?.length || 0,
        userId: data.userId || "Unknown",
        userName,
        userPhoto,
      };
    })
  );

  return <PublicCards flashcardSets={flashcards} />;
}
