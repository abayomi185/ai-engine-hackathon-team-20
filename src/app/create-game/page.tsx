"use client";

import { Suspense } from "react";

import { QRCodeSVG } from "qrcode.react";
import { api } from "~/trpc/react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3002";

function QRCodeSection() {
  const newGame = api.game.new.useQuery(undefined, { suspense: true });
  const gameId = newGame.data?.id ?? "";
  const qrValue = gameId ? `${baseUrl}/game/${gameId}` : "";

  return <QRCodeSVG value={qrValue} size={180} />;
}

export default function Results() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-xs">
        <Suspense fallback={<div>Loading QR Code...</div>}>
          <QRCodeSection />
        </Suspense>
      </div>
    </div>
  );
}
