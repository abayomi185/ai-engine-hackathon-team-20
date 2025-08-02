const RANDOM_WORDS = [
  "Neuron",
  "Tensor",
  "Algorithm",
  "Model",
  "Prompt",
  "Dataset",
  "Inference",
  "Gradient",
  "Epoch",
  "Vision",
  "Agent",
  "Transformer",
  "Embedding",
  "Optimizer",
  "Latent",
  "Classifier",
  "Generator",
  "Reinforce",
  "Token",
  "Sequence",
];

export const getRandomWord = () => {
  const idx = Math.floor(Math.random() * RANDOM_WORDS.length);
  return RANDOM_WORDS[idx];
};
