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
   ```

## Scripts

### example_usage.py
A demonstration script showing how to use the Runware API to generate videos.

**Usage:**
```bash
# From the project root directory
conda activate genai
python scripts/example_usage.py
```
