// Edge function version

import { davinciModelConfig } from "@/utils";
import fetchAdapter from "@vespaiach/axios-fetch-adapter"; // no XMLHTTPRequest in Edge
import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

export const config = {
  runtime: "edge", // this is a pre-requisite
};

type Data = {
  error?: string;
  essay?: string;
};

export default async function handler(req: NextRequest) {
  const { apiKey } = await req.json();

  if (!apiKey || typeof apiKey !== "string") {
    const responseData: Data = { error: "Invalid API key" };
    return new Response(JSON.stringify(responseData), {
      status: 503,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const openai = new OpenAIApi(
    new Configuration({
      apiKey,
    })
  );

  const { data } = await openai.createCompletion(
    davinciModelConfig,
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
