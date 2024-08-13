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
    } else if (file.type === 'text/plain') {
      textContent = await file.text(); 
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Based on the following course content: "${textContent}", generate a set of practice questions along with their answers. 
          Format each question with the prefix 'Question: ' and each answer with the prefix 'Answer: ' so that they can be easily identified.`,
        },
      ],
      max_tokens: 1000,
    });

    const aiResponse = response.choices?.[0]?.message?.content || '';

    console.log("AI Response: ", aiResponse);

    const regex = /\*\*Question:\s*(.*?)\*\*\s*\*\*Answer:\s*(.*?)(?=\n---|\n?$)/gs;

    const questionsAndAnswers = [];
    let match;
    
    while ((match = regex.exec(aiResponse)) !== null) {
      const question = match[1].trim();
      let answer = match[2].trim();

      if (answer.endsWith('**')) {
        answer = answer.slice(0, -2);
      }

      questionsAndAnswers.push({ question, answer });
    }
    
    console.log("Extracted questions and answers:", questionsAndAnswers);

    return NextResponse.json({ questionsAndAnswers });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
