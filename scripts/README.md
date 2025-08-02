# Scripts Directory

This directory contains utility scripts for the AI Engine Hackathon project.

## Setup

1. **Install Dependencies**: Make sure you have the conda environment set up:
   ```bash
   conda env create -f ../environment.yml
   conda activate genai
   ```

2. **Environment Variables**: Create a `.env` file in the project root with your API keys:
   ```
   RUNWARE_API_KEY=your_api_key_here
   VIDEO_API_ENDPOINT=https://your-api-endpoint.com/api/videos
   ```

## Scripts

### video_inference.py
A script that generates videos using Runware API and sends the results to your API with a unique taskUUID.

**Features:**
- Generates videos using Runware API
- Creates a unique UUID v4 for each task
- Sends video data to your API endpoint with taskUUID
- Includes comprehensive error handling and logging

**Usage:**
```bash
# From the project root directory
conda activate genai
python scripts/video_inference.py
```

**Required Environment Variables:**
- `RUNWARE_API_KEY`: Your Runware API key
- `VIDEO_API_ENDPOINT`: The API endpoint where video data will be sent

**API Payload Structure:**
The script sends the following JSON payload to your API:
```json
{
  "taskUUID": "uuid-v4-string",
  "videoURL": "https://video-url.com/video.mp4",
  "cost": 0.05,
  "seed": 12345,
  "status": "completed",
  "prompt": "A majestic eagle soaring through mountain peaks...",
  "model": "google:3@1",
  "width": 1280,
  "height": 720
}
```

### test_video_inference.py
A test script to verify that the video inference functionality works correctly.

**Features:**
- Tests taskUUID generation
- Validates API payload structure
- Checks environment variables
- Tests HTTP client functionality

**Usage:**
```bash
# From the project root directory
conda activate genai
python scripts/test_video_inference.py
```

### example_usage.py
A demonstration script showing how to use the Runware API to generate videos.

**Usage:**
```bash
# From the project root directory
conda activate genai
python scripts/example_usage.py
```
