'use client'; // Add this line if you are using React hooks like useState

import React from 'react';
// import Sidebar from '@/components/sidebar';
// import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function Dashboard() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleInputChange = (e: any) => {
    e.preventDefault();
    setInputText(e.target.value);
  };

  const handleSubmit = async () => {
    // Make async for potential API calls
    if (!inputText.trim()) return; // Prevent submitting empty prompts

    setIsLoading(true);
    setOutputText(''); // Clear previous output

    // --- Placeholder for AI interaction ---
    // Replace this with your actual API call
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = `AI Response to: "${inputText}"`; // Simulate response
      setOutputText(response);
      setInputText(''); // Clear input after successful submission
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setOutputText('Sorry, something went wrong. Please try again.'); // Display error message
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
    // --- End Placeholder ---
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Use theme variables */}
      {/* Sidebar */}
      {/* <Sidebar /> */}
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {' '}
        {/* Add padding and scroll */}
        <Card className="w-full max-w-3xl mx-auto shadow-lg">
          {' '}
          {/* Add shadow */}
          <CardHeader>
            <CardTitle className="text-2xl">AI Demo</CardTitle> {/* Larger title */}
            <CardDescription>Interact with a sample AI model.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {' '}
            {/* Increased gap */}
            <div className="grid gap-2">
              <Label htmlFor="input">Enter your prompt:</Label>
              <Textarea
                id="input"
                placeholder="Ask me anything..."
                value={inputText}
                onChange={handleInputChange}
                rows={4} // Set initial rows
                disabled={isLoading} // Disable input while loading
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="output">AI Response:</Label>
              <Textarea
                id="output"
                value={isLoading ? 'Generating response...' : outputText}
                readOnly
                rows={6} // Set initial rows for output
                placeholder="AI response will appear here..."
                className="bg-muted" // Slightly different background for output
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading || !inputText.trim()}>
              {isLoading ? 'Generating...' : 'Submit'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
