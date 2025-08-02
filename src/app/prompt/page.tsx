"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input"; // shadcn input
import { Label } from "~/components/ui/label"; // shadcn label
import { Button } from "~/components/ui/button"; // shadcn button
import { api } from "~/trpc/react";

export function Prompt() {
  // State to hold the value of the input box
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    // This is where you would handle the prompt submission,
    // for example, by calling an API.
    console.log("Submitted prompt:", prompt);
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-2">
      <Label htmlFor="prompt-input">Enter your prompt</Label>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          id="prompt-input"
          placeholder="e.g., A kangaroo doing a front flip..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button type="submit" onClick={handleSubmit}>
          Generate
        </Button>
      </div>
    </div>
  );
}
