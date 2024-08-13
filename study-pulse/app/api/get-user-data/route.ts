import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', id));

    if (userDoc.exists()) {
      return NextResponse.json(userDoc.data(), { status: 200 });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Error fetching user data' }, { status: 500 });
  }
}
