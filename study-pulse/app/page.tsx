'use client'

import Image from "next/image";
import { db } from "./config/firebase"; 
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
  const addTestData = async () => {
    try {
      const docRef = await addDoc(collection(db, "testCollection"), {
        name: "Test Entry",
        description: "This is a test entry for Firestore"
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <button onClick={addTestData}>Add Test Data</button>
    </div>
  );
}
