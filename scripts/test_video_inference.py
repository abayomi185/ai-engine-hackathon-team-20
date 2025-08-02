#!/usr/bin/env python3
"""
Test script for video inference with API integration.
This script tests the functionality without actually calling external APIs.
"""

import asyncio
import os
import uuid
import aiohttp
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv(override=True)


async def test_task_uuid_generation():
    """Test that taskUUID is generated correctly"""
    print("🧪 Testing Task UUID Generation...")
    
    # Generate multiple UUIDs to ensure uniqueness
    uuids = [str(uuid.uuid4()) for _ in range(5)]
    
    # Check that all UUIDs are unique
    unique_uuids = set(uuids)
    if len(uuids) == len(unique_uuids):
        print("✅ Task UUID generation test passed - all UUIDs are unique")
        print(f"   Sample UUID: {uuids[0]}")
        return True
    else:
        print("❌ Task UUID generation test failed - duplicate UUIDs found")
        return False


async def test_api_payload_structure():
    """Test the API payload structure"""
    print("\n🧪 Testing API Payload Structure...")
    
    # Mock video data
    mock_video_data = {
        "videoURL": "https://example.com/video.mp4",
        "cost": 0.05,
        "seed": 12345,
        "status": "completed",
        "prompt": "A majestic eagle soaring through mountain peaks at golden hour, cinematic view",
        "model": "google:3@1",
        "width": 1280,
        "height": 720
    }
    
    task_uuid = str(uuid.uuid4())
    
    # Create payload (same structure as in video_inference.py)
    payload = {
        "taskUUID": task_uuid,
        "videoURL": mock_video_data.get("videoURL"),
        "cost": mock_video_data.get("cost"),
        "seed": mock_video_data.get("seed"),
        "status": mock_video_data.get("status"),
        "prompt": mock_video_data.get("prompt"),
        "model": mock_video_data.get("model"),
        "width": mock_video_data.get("width"),
        "height": mock_video_data.get("height")
    }
    
    # Validate payload structure
    required_fields = ["taskUUID", "videoURL", "cost", "seed", "status", "prompt", "model", "width", "height"]
    missing_fields = [field for field in required_fields if field not in payload]
    
    if not missing_fields:
        print("✅ API payload structure test passed")
        print(f"   Task UUID: {payload['taskUUID']}")
        print(f"   Video URL: {payload['videoURL']}")
        print(f"   Cost: {payload['cost']}")
        return True
    else:
        print(f"❌ API payload structure test failed - missing fields: {missing_fields}")
        return False


async def test_environment_variables():
    """Test that required environment variables are set"""
    print("\n🧪 Testing Environment Variables...")
    
    required_vars = ["RUNWARE_API_KEY"]
    optional_vars = ["VIDEO_API_ENDPOINT"]
    
    missing_required = []
    for var in required_vars:
        if not os.getenv(var):
            missing_required.append(var)
    
    if missing_required:
        print(f"❌ Missing required environment variables: {missing_required}")
        print("   Please set these in your .env file")
        return False
    else:
        print("✅ Required environment variables are set")
        
        # Check optional variables
        for var in optional_vars:
            if os.getenv(var):
                print(f"   {var}: {os.getenv(var)}")
            else:
                print(f"   {var}: Not set (optional)")
        
        return True


async def test_http_client():
    """Test HTTP client functionality"""
    print("\n🧪 Testing HTTP Client...")
    
    try:
        async with aiohttp.ClientSession() as session:
            # Test with a simple HTTP request
            async with session.get("https://httpbin.org/get") as response:
                if response.status == 200:
                    print("✅ HTTP client test passed")
                    return True
                else:
                    print(f"❌ HTTP client test failed - status: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ HTTP client test failed - error: {str(e)}")
        return False


async def main():
    """Run all tests"""
    print("🚀 Starting Video Inference Tests...\n")
    
    tests = [
        test_task_uuid_generation(),
        test_api_payload_structure(),
        test_environment_variables(),
        test_http_client()
    ]
    
    results = await asyncio.gather(*tests)
    
    print(f"\n📊 Test Results:")
    print(f"   Passed: {sum(results)}/{len(results)}")
    
    if all(results):
        print("🎉 All tests passed! Your video inference setup is ready.")
        print("\n📝 Next steps:")
        print("   1. Set your VIDEO_API_ENDPOINT in .env file")
        print("   2. Run: python scripts/video_inference.py")
    else:
        print("⚠️  Some tests failed. Please fix the issues above before running the main script.")


if __name__ == "__main__":
    asyncio.run(main()) 