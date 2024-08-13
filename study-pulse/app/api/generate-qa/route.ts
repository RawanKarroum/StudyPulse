import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { pdfToText } from 'pdf-ts';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    let textContent = '';

    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer); 
      textContent = await pdfToText(buffer); 
      //console.log("Extracted text from PDF:", textContent.slice(0, 500)); 
    } else if (file.type === 'text/plain') {
      textContent = await file.text(); 
      //console.log("Extracted text from plain text file:", textContent.slice(0, 500));
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Based on the following course content: "${textContent}", generate a set of practice questions along with their answers. Make sure the questions cover the key topics and concepts.`,
        },
      ],
      max_tokens: 1000,
    });

    const generatedQnA = response.choices?.[0]?.message?.content?.split('\n\n').map(qna => qna.trim()) || [];
    console.log("Generated questions and answers:", generatedQnA);

    return NextResponse.json({ questionsAndAnswers: generatedQnA });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
