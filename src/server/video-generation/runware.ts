import { Runware } from "@runware/sdk-js";

async function generateVideo(positivePrompt: string): Promise<string | undefined> {
  const runware = new Runware({ apiKey: process.env.RUNWARE_API_KEY! });

  const videos = await runware.videoInference({
    positivePrompt,
    model: "bytedance:1@1",
    width: 864,
    height: 480,
    duration: 5, // Duration of the video in seconds
    fps: 24, // Frames per second
  });

  if (videos && videos.length > 0) {
    return videos[0].videoURL;
  }
}

// Example usage:
const prompt = "A dog climbing a tree in mountain equipment";
generateVideo(prompt).then(videoUrl => {
  if (videoUrl) {
    console.log("Generated video:", videoUrl);
  } else {
    console.log("Failed to generate video.");
  }
});