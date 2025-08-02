import asyncio
import os
import uuid
import aiohttp
import json
from dotenv import load_dotenv

from runware import Runware, IVideoInference, IFrameImage, IKlingAIProviderSettings, IKlingCameraControl, IKlingCameraConfig

# Load environment variables from .env file
load_dotenv(override=True)


async def send_video_to_api(video_data, task_uuid, api_endpoint=None):
    """
    Send the generated video data to the API with taskUUID
    
    Args:
        video_data: Dictionary containing video information
        task_uuid: UUID v4 string for task identification
        api_endpoint: API endpoint URL (optional, can be set via environment)
    """
    if not api_endpoint:
        api_endpoint = os.getenv("VIDEO_API_ENDPOINT")
        if not api_endpoint:
            raise ValueError("VIDEO_API_ENDPOINT not found in environment variables. Please set it in your .env file.")
    
    # Prepare the payload with taskUUID
    payload = {
        "taskUUID": task_uuid,
        "videoURL": video_data.get("videoURL"),
        "cost": video_data.get("cost"),
        "seed": video_data.get("seed"),
        "status": video_data.get("status"),
        "prompt": video_data.get("prompt"),
        "model": video_data.get("model"),
        "width": video_data.get("width"),
        "height": video_data.get("height")
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                api_endpoint,
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    print(f"✅ Video data sent successfully to API")
                    print(f"   Task UUID: {task_uuid}")
                    print(f"   API Response: {result}")
                    return result
                else:
                    error_text = await response.text()
                    print(f"❌ Failed to send video data to API")
                    print(f"   Status Code: {response.status}")
                    print(f"   Error: {error_text}")
                    return None
    except Exception as e:
        print(f"❌ Error sending video data to API: {str(e)}")
        return None


async def main():
    # Get API key from environment
    api_key = os.getenv("RUNWARE_API_KEY")
    if not api_key:
        raise ValueError("RUNWARE_API_KEY not found in environment variables. Please check your .env file.")
    
    # Get API endpoint from environment (defaults to local development server)
    api_endpoint = os.getenv("VIDEO_API_ENDPOINT", "http://localhost:3000/api/videos")
    
    # Generate a unique taskUUID for this video generation task
    task_uuid = str(uuid.uuid4())
    print(f"🎬 Starting video generation with Task UUID: {task_uuid}")
    
    runware = Runware(
        api_key=api_key,
    )
    await runware.connect()

    request = IVideoInference(
        positivePrompt="A majestic eagle soaring through mountain peaks at golden hour, cinematic view",
        model="bytedance:1@1",
        width=640,
        height=640,
        # duration=5.0,
        numberResults=1,
        includeCost=True,
        # CFGScale=0.5,
    )

    print("🎥 Generating video...")
    videos = await runware.videoInference(requestVideo=request)
    
    for video in videos:
        print(f"\n📹 Video Generated Successfully!")
        print(f"   Video URL: {video.videoURL}")
        print(f"   Cost: {video.cost}")
        print(f"   Seed: {video.seed}")
        print(f"   Status: {video.status}")
        
        # Prepare video data for API
        video_data = {
            "videoURL": video.videoURL,
            "cost": video.cost,
            "seed": video.seed,
            "status": video.status,
            "prompt": request.positivePrompt,
            "model": request.model,
            "width": request.width,
            "height": request.height
        }
        
        # Send video data to API
        print(f"\n📤 Sending video data to API...")
        await send_video_to_api(video_data, task_uuid, api_endpoint)
    
    await runware.disconnect()


if __name__ == "__main__":
    asyncio.run(main())