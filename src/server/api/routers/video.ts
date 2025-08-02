import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Schema for video data validation
const videoDataSchema = z.object({
  taskUUID: z.string().uuid(),
  videoURL: z.string().url(),
  cost: z.number().optional(),
  seed: z.number().optional(),
  status: z.string(),
  prompt: z.string(),
  model: z.string(),
  width: z.number(),
  height: z.number(),
});

export const videoRouter = createTRPCRouter({
  // Endpoint to receive video data from the inference script
  receiveVideo: publicProcedure
    .input(videoDataSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Log the received video data
        console.log("🎬 Received video data:", {
          taskUUID: input.taskUUID,
          videoURL: input.videoURL,
          status: input.status,
          model: input.model,
        });

        // Here you can add your logic to:
        // 1. Store the video data in your database
        // 2. Process the video URL
        // 3. Send notifications
        // 4. Update UI state
        // 5. etc.

        // For now, we'll just return a success response
        return {
          success: true,
          taskUUID: input.taskUUID,
          message: "Video data received successfully",
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error(" Error processing video data:", error);
        throw new Error("Failed to process video data");
      }
    }),

  // Endpoint to get video data by taskUUID
  getVideoByTaskUUID: publicProcedure
    .input(z.object({ taskUUID: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Here you would typically query your database
      // For now, we'll return a mock response
      return {
        taskUUID: input.taskUUID,
        videoURL: "https://example.com/video.mp4",
        status: "completed",
        model: "google:3@1",
        prompt: "A majestic eagle soaring through mountain peaks",
        width: 1280,
        height: 720,
        createdAt: new Date().toISOString(),
      };
    }),

  // Endpoint to list all videos
  listVideos: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      // Here you would typically query your database
      // For now, we'll return a mock response
      return {
        videos: [
          {
            taskUUID: "550e8400-e29b-41d4-a716-446655440000",
            videoURL: "https://example.com/video1.mp4",
            status: "completed",
            model: "google:3@1",
            prompt: "A majestic eagle soaring through mountain peaks",
            width: 1280,
            height: 720,
            createdAt: new Date().toISOString(),
          },
        ],
        total: 1,
        limit: input.limit,
        offset: input.offset,
      };
    }),
}); 