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
/Users/shayan/anaconda3/envs/genai/bin/python scripts/example_usage.py
```

**Note**: Due to PATH configuration, you may need to use the full path to the conda Python executable.

## Troubleshooting

If you encounter PATH issues with conda, you can add this to your shell configuration:
```bash
export PATH="/Users/shayan/anaconda3/envs/genai/bin:$PATH"
```

Then you can run scripts with:
```bash
conda activate genai
python scripts/example_usage.py
``` 