const voteItems = [
  "A cat wearing a superhero cape flying through space.",
  "A dog playing chess with a robot.",
];

export async function GET() {
  return Response.json({ items: voteItems });
}
