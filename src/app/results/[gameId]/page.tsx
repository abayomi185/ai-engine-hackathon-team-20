"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

export default function Results() {
  const router = useRouter();
  const params = useParams();
  const gameId = params?.gameId?.toString() ?? "";

  const { data, isLoading, error } = api.game.roundResults.useQuery(
    { gameId },
    {
      enabled: !!gameId,
    },
  );
  const nextRound = api.game.next.useMutation();
  const [nextLoading, setNextLoading] = useState(false);

  const handleNextRound = async () => {
    setNextLoading(true);
    try {
      await nextRound.mutateAsync({ gameId });
      router.refresh();
    } finally {
      setNextLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex w-full max-w-xl flex-col items-center rounded-xl bg-[#232045] p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">Round Results</h1>
        <p className="mb-6 text-center text-gray-300">
          See how everyone voted! Ready for the next round?
        </p>
        <p className="mb-6 text-center text-gray-300">
          {data?.gameRound.content}
        </p>
        {!gameId && <div className="p-4 text-red-500">No gameId provided.</div>}
        {isLoading && (
          <div className="p-4 text-gray-400">Loading results...</div>
        )}
        {error && (
          <div className="p-4 text-red-500">Error: {error.message}</div>
        )}
        {!isLoading && !error && (
          <>
            {data?.submissions.length === 0 ? (
              <div className="text-gray-500">No submissions yet.</div>
            ) : (
              <ul className="mb-4 grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
                {data?.submissions.map((sub) => (
                  <li
                    key={sub.id}
                    className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg"
                  >
                    <div className="relative aspect-video bg-gray-200">
                      {sub.result ? (
                        <video
                          width="320"
                          height="240"
                          autoPlay
                          loop
                          muted
                          preload="metadata"
                          className="h-full w-full object-cover"
                        >
                          <source src={sub.result} type="video/mp4" />
                        </video>
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-500">
                          No video
                        </div>
                      )}
                    </div>
                    <div className="p-4 text-black">
                      <p className="mb-2">{sub.content}</p>
                      <span className="inline-block rounded bg-[#a78bfa] px-2 py-1 text-sm text-[#232045]">
                        Votes: {data?.voteCountMap[sub.id] ?? 0}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Button
              className="mt-2 w-full cursor-pointer"
              onClick={handleNextRound}
              disabled={nextLoading}
            >
              {nextLoading ? "Advancing..." : "Next Round"}
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
