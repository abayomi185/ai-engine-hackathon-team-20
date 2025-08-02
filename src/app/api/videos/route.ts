import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the data
    const validatedData = videoDataSchema.parse(body);
    
    // Log the received video data
    console.log("🎬 Received video data via REST API:", {
      taskUUID: validatedData.taskUUID,
      videoURL: validatedData.videoURL,
      status: validatedData.status,
      model: validatedData.model,
    });

    // Here you can add your logic to:
    // 1. Store the video data in your database
    // 2. Process the video URL
    // 3. Send notifications
    // 4. Update UI state
    // 5. etc.

    // Return success response
    return NextResponse.json({
      success: true,
      taskUUID: validatedData.taskUUID,
      message: "Video data received successfully",
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    console.error(" Error processing video data:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Invalid data format",
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskUUID = searchParams.get("taskUUID");

    if (taskUUID) {
      // Return specific video data
      return NextResponse.json({
        taskUUID,
        videoURL: "https://example.com/video.mp4",
        status: "completed",
        model: "google:3@1",
        prompt: "A majestic eagle soaring through mountain peaks",
        width: 1280,
        height: 720,
        createdAt: new Date().toISOString(),
      });
    } else {
      // Return list of videos
      return NextResponse.json({
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
      });
    }
  } catch (error) {
    console.error(" Error retrieving video data:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
} 