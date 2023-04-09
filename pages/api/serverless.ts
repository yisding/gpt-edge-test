// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { davinciModelConfig } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type Data = {
  error?: string;
  essay?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { apiKey } = req.body;

  if (!apiKey || typeof apiKey !== "string") {
    const responseData: Data = { error: "Invalid API key" };
    res.status(503).json(responseData);
    return;
  }

  const openai = new OpenAIApi(
    new Configuration({
      apiKey,
    })
  );

  const { data } = await openai.createCompletion(davinciModelConfig);

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
