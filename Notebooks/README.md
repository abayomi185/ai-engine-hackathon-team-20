# Notebooks Directory

This directory contains Jupyter notebooks for the AI Engine Hackathon project.

## Notebooks

### video_generate.ipynb
A Jupyter notebook for video generation experiments and demonstrations.

## Setup

1. **Install Dependencies**: Make sure you have the conda environment set up:
   ```bash
   conda env create -f ../environment.yml
   conda activate genai
   ```

2. **Install Jupyter**: If not already installed, add Jupyter to your environment:
   ```bash
   conda activate genai
   conda install jupyter
   ```

3. **Environment Variables**: Create a `.env` file in the project root with your API keys:
   ```
   RUNWARE_API_KEY=your_api_key_here
   ```

## Usage

Start Jupyter from the project root:
```bash
conda activate genai
jupyter notebook
```

Then navigate to the `Notebooks/` directory and open `video_generate.ipynb`. 