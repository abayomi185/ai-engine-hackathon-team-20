"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Video, Vote } from "lucide-react";

interface Player {
  id: string;
  name: string;
  isHost?: boolean;
}

export default function LobbyPage() {
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Alex", isHost: true },
    { id: "2", name: "Sam" },
    { id: "3", name: "Jordan" },
  ]);
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const joinGame = () => {
    if (playerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: playerName.trim(),
      };
      setPlayers([...players, newPlayer]);
      setPlayerName("");
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  if (gameStarted) {
    return <GameInterface players={players} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            VideoLash
          </CardTitle>
          <CardDescription className="text-lg">
            The hilarious video generation party game!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Video className="h-4 w-4" />
            <span>
              Players submit prompts • AI generates videos • Everyone votes!
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h3 className="font-semibold">
                Players in Lobby ({players.length})
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {player.name[0].toUpperCase()}
                  </div>
                  <span className="font-medium">{player.name}</span>
                  {player.isHost && <Badge variant="secondary">Host</Badge>}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your name to join..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && joinGame()}
              />
              <Button onClick={joinGame} disabled={!playerName.trim()}>
                Join Game
              </Button>
            </div>

            {players.length >= 3 && (
              <Button onClick={startGame} className="w-full" size="lg">
                Start Game
              </Button>
            )}

            {players.length < 3 && (
              <p className="text-sm text-muted-foreground text-center">
                Need at least 3 players to start the game
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GameInterface({ players }: { players: Player[] }) {
  const [gamePhase, setGamePhase] = useState<
    "prompts" | "generating" | "voting" | "results"
  >("prompts");
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});

  if (gamePhase === "prompts") {
    return (
      <PromptSubmission
        players={players}
        onPromptsComplete={(submittedPrompts) => {
          setPrompts(submittedPrompts);
          setGamePhase("generating");
        }}
      />
    );
  }

  if (gamePhase === "generating") {
    return <GeneratingScreen onComplete={() => setGamePhase("voting")} />;
  }

  if (gamePhase === "voting") {
    return (
      <VotingInterface
        prompts={prompts}
        onVotingComplete={(voteResults) => {
          setVotes(voteResults);
          setGamePhase("results");
        }}
      />
    );
  }

  return <ResultsScreen votes={votes} prompts={prompts} />;
}

function PromptSubmission({
  players,
  onPromptsComplete,
}: {
  players: Player[];
  onPromptsComplete: (prompts: string[]) => void;
}) {
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [submittedPrompts, setSubmittedPrompts] = useState<string[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const submitPrompt = () => {
    if (currentPrompt.trim()) {
      const newPrompts = [...submittedPrompts, currentPrompt.trim()];
      setSubmittedPrompts(newPrompts);
      setCurrentPrompt("");

      if (currentPlayerIndex < players.length - 1) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
      } else {
        onPromptsComplete(newPrompts);
      }
    }
  };

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Submit Your Video Prompt</CardTitle>
          <CardDescription>
            {currentPlayer.name}s turn ({currentPlayerIndex + 1} of{" "}
            {players.length})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
              {currentPlayer.name[0].toUpperCase()}
            </div>
            <h3 className="text-xl font-semibold">{currentPlayer.name}</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Describe a video you want to see generated:
              </label>
              <Input
                placeholder="e.g., A cat wearing a superhero cape flying through space..."
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && submitPrompt()}
                className="text-lg p-4 h-auto"
              />
            </div>

            <Button
              onClick={submitPrompt}
              disabled={!currentPrompt.trim()}
              className="w-full"
              size="lg"
            >
              Submit Prompt
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Be creative! The funnier and more unexpected, the better!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GeneratingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  // Simulate video generation progress
  useState(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => clearInterval(interval);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <CardTitle className="text-3xl">Generating Videos...</CardTitle>
          <CardDescription className="text-lg">
            Our AI is working hard to create hilarious videos from your prompts!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <div className="w-32 h-32 mx-auto">
              <div className="animate-spin rounded-full h-32 w-32 border-8 border-white border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-12 w-12 text-white animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-white/20 rounded-full h-4">
              <div
                className="bg-white h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-white/80">
              {progress < 30 && "Analyzing prompts..."}
              {progress >= 30 && progress < 60 && "Generating video content..."}
              {progress >= 60 && progress < 90 && "Adding special effects..."}
              {progress >= 90 && "Almost ready!"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function VotingInterface({
  prompts,
  onVotingComplete,
}: {
  prompts: string[];
  onVotingComplete: (votes: { [key: string]: number }) => void;
}) {
  const [currentMatchup, setCurrentMatchup] = useState(0);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});

  const matchups = [];
  for (let i = 0; i < prompts.length; i += 2) {
    if (i + 1 < prompts.length) {
      matchups.push([prompts[i], prompts[i + 1]]);
    }
  }

  const vote = (promptIndex: number) => {
    const prompt = matchups[currentMatchup][promptIndex];
    const newVotes = { ...votes };
    newVotes[prompt] = (newVotes[prompt] || 0) + 1;
    setVotes(newVotes);

    if (currentMatchup < matchups.length - 1) {
      setCurrentMatchup(currentMatchup + 1);
    } else {
      onVotingComplete(newVotes);
    }
  };

  if (matchups.length === 0) {
    onVotingComplete(votes);
    return null;
  }

  const [prompt1, prompt2] = matchups[currentMatchup];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl flex items-center justify-center gap-2">
            <Vote className="h-8 w-8" />
            Vote for Your Favorite!
          </CardTitle>
          <CardDescription className="text-lg">
            Round {currentMatchup + 1} of {matchups.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => vote(0)}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Video className="h-16 w-16 text-white" />
                </div>
                <p className="text-lg font-medium">{prompt1}</p>
                <Button className="w-full" size="lg">
                  Vote for This Video
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => vote(1)}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-full h-48 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center">
                  <Video className="h-16 w-16 text-white" />
                </div>
                <p className="text-lg font-medium">{prompt2}</p>
                <Button className="w-full" size="lg">
                  Vote for This Video
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResultsScreen({
  votes,
  prompts,
}: {
  votes: { [key: string]: number };
  prompts: string[];
}) {
  const sortedResults = Object.entries(votes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl">🏆 Results!</CardTitle>
          <CardDescription className="text-lg">
            Here are the crowd favorites
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sortedResults.map(([prompt, voteCount], index) => (
            <Card
              key={prompt}
              className={`${index === 0 ? "border-yellow-400 bg-yellow-50" : ""}`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center ${
                    index === 0
                      ? "bg-yellow-400 text-yellow-900"
                      : index === 1
                        ? "bg-gray-300 text-gray-700"
                        : "bg-orange-300 text-orange-700"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{prompt}</p>
                  <p className="text-sm text-muted-foreground">
                    {voteCount} vote{voteCount !== 1 ? "s" : ""}
                  </p>
                </div>
                {index === 0 && <span className="text-2xl">👑</span>}
              </CardContent>
            </Card>
          ))}

          <Button
            className="w-full"
            size="lg"
            onClick={() => window.location.reload()}
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
