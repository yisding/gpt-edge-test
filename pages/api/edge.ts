// Edge function version

import fetchAdapter from "@vespaiach/axios-fetch-adapter"; // no XMLHTTPRequest in Edge
import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

export const config = {
  runtime: "edge", // this is a pre-requisite
};

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

type Data = {
  error?: string;
  essay?: string;
};

export default async function handler(req: NextRequest) {
  const prompt = `Write me an essay of 300 words about giving to others is the key to a happy life.`;

  const { data } = await openai.createCompletion(
    {
      model: "text-davinci-003",
      prompt,
      max_tokens: 1000,
      temperature: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
      n: 1,
      stream: false,
    },
    { adapter: fetchAdapter }
  );

  const responseEssay = data.choices[0].text;

  if (!responseEssay) {
    const responseData: Data = { error: "No response" };
    return new Response(JSON.stringify(responseData), {
      status: 503,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const responseData: Data = { essay: responseEssay };

  return NextResponse.json(responseData);
}
