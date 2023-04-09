// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

type Data = {
  error?: string;
  essay?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prompt = `Write me an essay of 300 words about giving to others is the key to a happy life.`;

  // const { data } = await openai.createChatCompletion({
  //   model: "gpt-4",
  //   messages: [{ role: "user", content: prompt }],
  //   max_tokens: 1000,
  //   temperature: 1,
  //   presence_penalty: 0,
  //   frequency_penalty: 0,
  //   n: 1,
  //   stream: false,
  // });

  const { data } = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 1000,
    temperature: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    n: 1,
    stream: false,
  });

  // const responseEssay = data.choices[0].message?.content;
  const responseEssay = data.choices[0].text;

  if (!responseEssay) {
    const responseData: Data = { error: "No response" };
    res.status(503).json(responseData);
    return;
  }

  const responseData = { essay: responseEssay };

  res.status(200).json(responseData);
}
