import asyncio
import os
from dotenv import load_dotenv

from runware import Runware, IVideoInference, IFrameImage, IKlingAIProviderSettings, IKlingCameraControl, IKlingCameraConfig

# Load environment variables from .env file
load_dotenv(override=True)


async def main():
    # Get API key from environment
    api_key = os.getenv("RUNWARE_API_KEY")
    if not api_key:
        raise ValueError("RUNWARE_API_KEY not found in environment variables. Please check your .env file.")
    
    runware = Runware(
        api_key=api_key,
    )
    await runware.connect()

    request = IVideoInference(
        positivePrompt="A majestic eagle soaring through mountain peaks at golden hour, cinematic view",
        model="google:3@1",
        width=1280,
        height=720,
        # duration=5.0,
        numberResults=1,
        includeCost=True,
        # CFGScale=0.5,
    )

    videos = await runware.videoInference(requestVideo=request)
    for video in videos:
        print(f"Video URL: {video.videoURL}")
        print(f"Cost: {video.cost}")
        print(f"Seed: {video.seed}")
        print(f"Status: {video.status}")


if __name__ == "__main__":
    asyncio.run(main())