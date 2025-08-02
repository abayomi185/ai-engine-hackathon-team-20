# API Endpoint Setup Guide

This guide shows you how to create and use API endpoints to receive video data from your inference script.

## 🚀 Quick Start

### Option 1: REST API Endpoint (Recommended)

I've created a REST API endpoint at `/api/videos` that your Python script can easily call.

#### 1. Start your Next.js development server:
```bash
npm run dev
# or
pnpm dev
```

#### 2. Update your `.env` file:
```bash
RUNWARE_API_KEY=your_runware_api_key_here
VIDEO_API_ENDPOINT=http://localhost:3000/api/videos
```

#### 3. Run your video inference script:
```bash
python scripts/video_inference.py
```

### Option 2: tRPC Endpoint

If you prefer using tRPC, you can use the video router I created.

## 📋 API Endpoints Available

### REST API (`/api/videos`)

#### POST `/api/videos`
Receives video data from your Python script.

**Request Body:**
```json
{
  "taskUUID": "550e8400-e29b-41d4-a716-446655440000",
  "videoURL": "https://runware.com/videos/abc123.mp4",
  "cost": 0.05,
  "seed": 12345,
  "status": "completed",
  "prompt": "A majestic eagle soaring through mountain peaks",
  "model": "google:3@1",
  "width": 1280,
  "height": 720
}
```

**Response:**
```json
{
  "success": true,
  "taskUUID": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Video data received successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### GET `/api/videos`
Get all videos.

#### GET `/api/videos?taskUUID=uuid`
Get a specific video by taskUUID.

### tRPC Endpoints

#### `video.receiveVideo`
Receives video data (same as REST POST).

#### `video.getVideoByTaskUUID`
Get video by taskUUID.

#### `video.listVideos`
List all videos with pagination.

## 🔧 Customization

### Adding Database Storage

To store video data in your database, modify the API endpoint:

```typescript
// In src/app/api/videos/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = videoDataSchema.parse(body);
    
    // Store in database
    await db.insert(videos).values({
      taskUUID: validatedData.taskUUID,
      videoURL: validatedData.videoURL,
      cost: validatedData.cost,
      seed: validatedData.seed,
      status: validatedData.status,
      prompt: validatedData.prompt,
      model: validatedData.model,
      width: validatedData.width,
      height: validatedData.height,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      taskUUID: validatedData.taskUUID,
      message: "Video data stored successfully",
    });
  } catch (error) {
    // Handle error
  }
}
```

### Adding Notifications

```typescript
// Send notification when video is received
if (validatedData.status === "completed") {
  await sendNotification({
    title: "Video Generated!",
    message: `Video for task ${validatedData.taskUUID} is ready`,
    videoURL: validatedData.videoURL,
  });
}
```

### Adding WebSocket Updates

```typescript
// Send real-time updates to connected clients
if (io) {
  io.emit("video:completed", {
    taskUUID: validatedData.taskUUID,
    videoURL: validatedData.videoURL,
    status: validatedData.status,
  });
}
```

## 🧪 Testing the API

### Test with curl:
```bash
curl -X POST http://localhost:3000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "taskUUID": "550e8400-e29b-41d4-a716-446655440000",
    "videoURL": "https://example.com/video.mp4",
    "cost": 0.05,
    "seed": 12345,
    "status": "completed",
    "prompt": "A majestic eagle soaring through mountain peaks",
    "model": "google:3@1",
    "width": 1280,
    "height": 720
  }'
```

### Test with your Python script:
```bash
# Make sure your .env file has the correct endpoint
VIDEO_API_ENDPOINT=http://localhost:3000/api/videos

# Run the script
python scripts/video_inference.py
```

## 🔒 Security Considerations

### Add Authentication:
```typescript
// Add API key validation
const apiKey = request.headers.get("x-api-key");
if (apiKey !== process.env.API_KEY) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Add Rate Limiting:
```typescript
// Implement rate limiting
import { rateLimit } from "~/lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

const { success } = await limiter.check(request, 10, "VIDEO_API");
if (!success) {
  return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
}
```

## 📊 Monitoring

### Add Logging:
```typescript
// Log all video requests
console.log(`[${new Date().toISOString()}] Video received:`, {
  taskUUID: validatedData.taskUUID,
  status: validatedData.status,
  model: validatedData.model,
  ip: request.ip,
  userAgent: request.headers.get("user-agent"),
});
```

### Add Metrics:
```typescript
// Track video generation metrics
await incrementMetric("videos_generated", {
  model: validatedData.model,
  status: validatedData.status,
  cost: validatedData.cost,
});
```

## 🚀 Deployment

### For Production:
1. Update your `.env` file with production URLs:
   ```bash
   VIDEO_API_ENDPOINT=https://your-domain.com/api/videos
   ```

2. Deploy your Next.js app:
   ```bash
   npm run build
   npm start
   ```

3. Your Python script will now send data to your production API.

## 📝 Next Steps

1. **Add Database Schema**: Create a videos table in your database
2. **Add Authentication**: Secure your API endpoints
3. **Add Real-time Updates**: Use WebSockets for live updates
4. **Add File Storage**: Store video files in cloud storage
5. **Add Processing**: Add video processing/compression
6. **Add Analytics**: Track usage and performance metrics

Your API endpoint is now ready to receive video data from your Python script! 🎉 