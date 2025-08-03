import { Runware, type IVideoToImage } from "@runware/sdk-js";

export const generateVideo = async (
  positivePrompt: string,
): Promise<{
  success: boolean;
  url?: string;
}> => {
  console.log("Generating video with Runware...");
  const runware = new Runware({ apiKey: process.env.RUNWARE_API_KEY! });

  const videos = await runware.videoInference({
    positivePrompt,
    model: "bytedance:1@1",
    width: 864,
    height: 480,
    duration: 5, // Duration of the video in seconds
    fps: 24, // Frames per second
  });

  console.log("Generating video");

  let video: IVideoToImage;
  if (Array.isArray(videos) && videos.length > 0 && videos[0] !== undefined) {
    console.error("Video generation successful");
    video = videos[0];

    return {
      success: true,
      url: video.videoURL,
    };
  }

  return { success: false };
};
