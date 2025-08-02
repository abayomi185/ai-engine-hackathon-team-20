# Video Inference with API Integration - Setup Guide

This guide will walk you through setting up the video inference script that generates videos and sends them to your API with a unique taskUUID.

## Step 1: Environment Setup

1. **Activate the conda environment:**
   ```bash
   conda activate genai
   ```

2. **Install additional dependencies:**
   ```bash
   conda env update -f ../environment.yml
   ```

## Step 2: Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Required: Your Runware API key
RUNWARE_API_KEY=your_runware_api_key_here

# Required: Your API endpoint where videos will be sent
VIDEO_API_ENDPOINT=https://your-api-endpoint.com/api/videos
```

## Step 3: Test the Setup

Run the test script to verify everything is working:

```bash
python scripts/test_video_inference.py
```

This will test:
- ✅ TaskUUID generation
- ✅ API payload structure
- ✅ Environment variables
- ✅ HTTP client functionality

## Step 4: Run the Video Inference

Once all tests pass, run the main script:

```bash
python scripts/video_inference.py
```

## What the Script Does

1. **Generates a unique taskUUID** for each video generation task
2. **Connects to Runware API** and generates a video
3. **Prepares the video data** with all relevant information
4. **Sends the data to your API** with the taskUUID included

## API Payload Structure

Your API will receive a JSON payload like this:

```json
{
  "taskUUID": "550e8400-e29b-41d4-a716-446655440000",
  "videoURL": "https://runware.com/videos/abc123.mp4",
  "cost": 0.05,
  "seed": 12345,
  "status": "completed",
  "prompt": "A majestic eagle soaring through mountain peaks at golden hour, cinematic view",
  "model": "google:3@1",
  "width": 1280,
  "height": 720
}
```

## Customization

You can modify the video generation parameters in `scripts/video_inference.py`:

```python
request = IVideoInference(
    positivePrompt="Your custom prompt here",
    model="google:3@1",
    width=1280,
    height=720,
    duration=5.0,  # Uncomment to set duration
    numberResults=1,
    includeCost=True,
    CFGScale=0.5,  # Uncomment to set CFG scale
)
```

## Troubleshooting

### Common Issues:

1. **Missing API Key:**
   - Make sure `RUNWARE_API_KEY` is set in your `.env` file

2. **Missing API Endpoint:**
   - Set `VIDEO_API_ENDPOINT` in your `.env` file

3. **Network Issues:**
   - Check your internet connection
   - Verify the API endpoint is accessible

4. **Dependencies Missing:**
   - Run `conda env update -f ../environment.yml` to install missing packages

### Getting Help:

- Run the test script: `python scripts/test_video_inference.py`
- Check the logs for detailed error messages
- Verify your environment variables are set correctly 