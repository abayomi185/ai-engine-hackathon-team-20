"use client";

import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export default function Prompt() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const submitGameMutation = api.game.submit.useMutation({
    onSuccess: (_data) => {
      void router.push("/vote");
    },
  });

  const handleSubmit = () => {
    submitGameMutation.mutate({ content: prompt });
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-[#232045] p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">Enter a Prompt</h1>
        <p className="mb-6 text-center text-gray-300">
          Describe what you want to generate below.
        </p>
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="prompt-input">Prompt</Label>
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
      </div>
    </main>
  );
}
