"use client";

import { getCookie } from "cookies-next/client";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";

export default function Vote() {
  const gameId = getCookie("gameId")?.toString() ?? "";
  const sessionId = getCookie("sessionId")?.toString() ?? "";
  const [votedSubmissionId, setVotedSubmissionId] = useState<string | null>(
    null,
  );

  const gameStatus = api.game.status.useQuery(
    { gameId },
    {
      refetchInterval: 10000,
    },
  );
  const roundResults = api.game.roundResults.useQuery(
    { gameId },
    {
      enabled: !!sessionId,
      refetchInterval: 10000,
    },
  );

  useEffect(() => {
    console.log("Round results updated:", roundResults.data);
  }, [roundResults.data]);

  const voteMutation = api.game.vote.useMutation({
    onSuccess: (_, variables) => {
      setVotedSubmissionId(variables.submissionId);
    },
    onError: (error) => {
      console.error("Vote failed:", error.message);
    },
  });

  const handleVote = (submissionId: string) => {
    if (votedSubmissionId) return; // Already voted
    voteMutation.mutate({ submissionId });
  };

  // Consistent loading state
  if (gameStatus.isLoading || roundResults.isLoading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-[#232045] p-8 shadow-lg">
          <div className="text-center text-lg text-gray-300">Loading...</div>
        </div>
      </main>
    );
  }

  // Consistent error state
  if (gameStatus.error || roundResults.error) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-[#232045] p-8 shadow-lg">
          <div className="text-center text-red-500">
            Error: {gameStatus.error?.message ?? roundResults.error?.message}
          </div>
        </div>
      </main>
    );
  }

  if (!gameStatus.data?.isActive) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-[#232045] p-8 shadow-lg">
          <div className="text-center text-lg text-gray-300">
            Game is not active
          </div>
        </div>
      </main>
    );
  }

  const currentRound = gameStatus.data.gameRound;

  if (!currentRound) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-[#232045] p-8 shadow-lg">
          <div className="text-center text-lg text-gray-300">
            No active round found
          </div>
        </div>
      </main>
    );
  }

  // Get submissions for current round (assuming they're in roundResults)
  const submissions = roundResults.data?.submissions ?? [];

  if (submissions.length < 3) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-[#232045] p-8 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-white">
            Waiting for submissions...
          </h2>
          <p className="text-gray-300">
            Round prompt: &quot;{currentRound.content}&quot;
          </p>
          <p className="mt-2 text-sm text-gray-400">
            {submissions.length}/2 submissions received
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex w-full max-w-2xl flex-col items-center rounded-xl bg-[#232045] p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Vote for Your Favorite
        </h1>
        <p className="mb-6 text-center text-gray-300">
          Round prompt: &quot;{currentRound.content}&quot;
        </p>
        {votedSubmissionId && (
          <p className="mb-4 text-center font-medium text-green-400">
            Vote submitted!
          </p>
        )}
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
          {submissions.slice(0, 2).map((submission, index) => (
            <div
              key={submission.id}
              className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg"
            >
              <div className="relative aspect-video bg-gray-200">
                {/* Video placeholder - replace with actual video component */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <video
                      width="320"
                      height="240"
                      autoPlay
                      loop
                      muted
                      preload="metadata"
                    >
                      <source src={submission.result!} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <button
                  onClick={() => handleVote(submission.id)}
                  disabled={!!votedSubmissionId || voteMutation.isPending}
                  className={`w-full rounded-lg px-6 py-3 font-medium transition-colors ${
                    votedSubmissionId === submission.id
                      ? "bg-green-500 text-white"
                      : votedSubmissionId
                        ? "cursor-not-allowed bg-gray-300 text-gray-500"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {voteMutation.isPending &&
                  voteMutation.variables?.submissionId === submission.id
                    ? "Voting..."
                    : votedSubmissionId === submission.id
                      ? "Voted!"
                      : votedSubmissionId
                        ? "Vote Cast"
                        : "Vote for This"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
