'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

export default function Home() {
  const [textContent, setTextContent] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<string[]>([]);

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(event.target.value);
    setFile(null); 
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    console.log("File selected:", uploadedFile);
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
      console.log("Submitting file:", file);
    } else if (textContent.trim()) {
      headers = {
        'Content-Type': 'application/json',
      };
      requestBody = JSON.stringify({ textContent });
      console.log("Submitting text content:", textContent);
    }

    try {
      const response = await fetch('/api/generate-qa', {
        method: 'POST',
        body: formData || requestBody,
        headers: headers,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        setUploadStatus(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      console.log("Response data:", data);
      setUploadStatus('Content processed successfully!');
      setQuestionsAndAnswers(data.questionsAndAnswers);  
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
      </form>
      <p>{uploadStatus}</p>
      
      {questionsAndAnswers.length > 0 && (
        <div>
          <h2>Generated Questions and Answers</h2>
          <ul>
            {questionsAndAnswers.map((qa, index) => (
              <li key={index}>{qa}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
