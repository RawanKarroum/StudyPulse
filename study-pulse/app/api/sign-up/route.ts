import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  const { id, firstName, lastName, email, membership } = await request.json();

  try {
    // Add the user to Firestore
    await setDoc(doc(db, 'users', id), {
      firstName,
      lastName,
      email,
      createdAt: new Date(),
      membership
    });

    return NextResponse.json({ message: 'User added to Firebase' }, { status: 200 });
  } catch (error) {
    console.error('Error adding user to Firebase:', error);
    return NextResponse.json({ error: 'Error adding user to Firebase' }, { status: 500 });
  }
}
