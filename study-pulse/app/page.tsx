'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [textContent, setTextContent] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const router = useRouter();

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(event.target.value);
    setFile(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    setFile(uploadedFile);
    setTextContent('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!textContent.trim() && !file) {
      setUploadStatus('Please enter text content or upload a file.');
      return;
    }

    let formData: FormData | null = null;
    let requestBody: any = null;
    let headers: HeadersInit = {};

    if (file) {
      formData = new FormData();
      formData.append('file', file);
    } else if (textContent.trim()) {
      headers = {
        'Content-Type': 'application/json',
      };
      requestBody = JSON.stringify({ textContent });
    }

    try {
      const response = await fetch('/api/generate-qa', {
        method: 'POST',
        body: formData || requestBody,
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setUploadStatus(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      setUploadStatus('Content processed successfully!');

      router.push(`/flashcard-page?aiResponse=${encodeURIComponent(JSON.stringify(data.questionsAndAnswers))}`);
    } catch (error) {
      setUploadStatus('Error processing content.');
      console.error('Upload Error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={10}
          cols={50}
          value={textContent}
          onChange={handleTextChange}
          placeholder="Enter your course content here..."
        />
        <br />
        <input type="file" accept=".txt,.pdf" onChange={handleFileChange} />
        <br />
        <button type="submit">Generate Questions</button>
        <p>{uploadStatus}</p>
      </form>
    </div>
  );
}
