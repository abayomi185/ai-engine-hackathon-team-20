"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import { api } from "~/trpc/react";
import { setCookie } from "cookies-next/client";

export default function JoinGame() {
  const router = useRouter();

  const params = useParams();
  const gameId = params?.gameId?.toString() ?? "";
  const gameStatus = api.game.status.useQuery({ gameId });
  const [playerName, setPlayerName] = useState("");

  const isLoading = gameStatus.isLoading;
  const error = gameStatus.error;
  const gameName = gameStatus.data?.game.name ?? "";

  const joinGameMutation = api.game.join.useMutation({
    onSuccess: (data) => {
      if (!data) return;

      setCookie("sessionId", data.id, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        path: "/",
      });
      setCookie("gameId", data.gameId, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        path: "/",
      });

      // Redirect to the game page after joining
      if (data?.isPlayer) {
        router.push(`/prompt`);
        return;
      }
      router.push("/vote");
    },
  });

  const joinGameHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    joinGameMutation.mutate({ gameId, name: playerName });
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-[#232045] p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">Join Game</h1>
        <p className="mb-6 text-center text-gray-300">
          Enter your name to join the game.
        </p>
        {isLoading && (
          <div className="mb-4 text-center text-gray-400">
            Loading game info...
          </div>
        )}
        {error && (
          <div className="mb-4 text-center text-red-500">
            Failed to load game info.
          </div>
        )}
        {!isLoading && !error && (
          <div className="mb-4 w-full text-center">
            <div className="text-lg font-semibold">
              Game: <span className="text-[#a78bfa]">{gameName}</span>
            </div>
            <div className="text-sm text-gray-400">Game ID: {gameId}</div>
          </div>
        )}
        <Input
          type="text"
          placeholder="e.g., John Doe"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="mb-4"
        />
        <Button
          className="mt-2 w-full cursor-pointer"
          disabled={!playerName}
          onClick={joinGameHandler}
        >
          Join Game
        </Button>
      </div>
    </main>
  );
}
