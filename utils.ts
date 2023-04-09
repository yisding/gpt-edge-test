export const prompt = `Write me an essay of 200 words about giving to others is the key to a happy life.`;

export const davinciModelConfig = {
  model: "text-davinci-003",
  prompt,
  max_tokens: 1000,
  temperature: 1,
  presence_penalty: 0,
  frequency_penalty: 0,
  n: 1,
  stream: false,
};

export const gpt4ModelConfig = {
  model: "gpt-4",
  messages: [{ role: "user", content: prompt }],
  max_tokens: 1000,
  temperature: 1,
  presence_penalty: 0,
  frequency_penalty: 0,
  n: 1,
  stream: false,
};
