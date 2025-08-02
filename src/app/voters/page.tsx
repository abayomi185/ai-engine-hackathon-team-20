"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetchVoteItems = async (): Promise<string[]> => {
  const res = await fetch("/api/vote-items");
  if (!res.ok) throw new Error("Failed to fetch vote items");
  const data = await res.json();
  return data.items || [];
};

export default function VoterPage() {
  const {
    data: prompts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["vote-items"],
    queryFn: fetchVoteItems,
  });
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const [hasVoted, setHasVoted] = useState(false);

  const voteForPrompt = (prompt: string) => {
    setVotes((prev) => ({
      ...prev,
      [prompt]: (prev[prompt] || 0) + 1,
    }));
    setHasVoted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Vote for Your Favorite Video Prompt!
          </CardTitle>
          <CardDescription>
            Select the prompt you think should win.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center">Loading prompts...</div>
          ) : error ? (
            <div className="text-center text-red-500">
              Failed to load prompts.
            </div>
          ) : !hasVoted ? (
            <div className="space-y-4">
              {prompts.map((prompt) => (
                <Card key={prompt} className="bg-muted">
                  <CardContent className="flex flex-col gap-2 p-4">
                    <span className="text-lg font-medium">{prompt}</span>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => voteForPrompt(prompt)}
                    >
                      Vote
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-semibold">Thanks for voting!</h2>
              <div className="space-y-2">
                {Object.entries(votes).map(([prompt, count]) => (
                  <div
                    key={prompt}
                    className="flex justify-between items-center bg-white/20 rounded-lg p-2"
                  >
                    <span>{prompt}</span>
                    <span className="font-bold">
                      {count} vote{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                className="mt-4"
                size="lg"
                onClick={() => {
                  setHasVoted(false);
                  setVotes({});
                }}
              >
                Vote Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
