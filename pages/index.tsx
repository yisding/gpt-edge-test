import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [serverlessButtonDisabled, setServerlessButtonDisabled] =
    useState<boolean>(false);
  const [edgeButtonDisabled, setEdgeButtonDisabled] = useState<boolean>(false);

  const [serverlessResults, setServerlessResults] = useState<
    { essay: string; ms: number }[]
  >([]);
  const [edgeResults, setEdgeResults] = useState<
    { essay: string; ms: number }[]
  >([]);

  return (
    <>
      <Head>
        <title>Vercel GPT Cost Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full w-full flex-row">
        <div className="flex-1 border border-slate-800">
          <div className="h-full w-full text-center">
            <button
              className="rounded-full bg-blue-500 p-2 text-white"
              disabled={serverlessButtonDisabled}
              onClick={async () => {
                setServerlessButtonDisabled(true);
                const res = await fetch("/api/serverless");
                const data = await res.json();
                setServerlessResults((sr) => [
                  ...sr,
                  { essay: data.essay, ms: 0 },
                ]);
                setServerlessButtonDisabled(false);
              }}
            >
              Test Serverless
            </button>
            <div className="p-4">
              {serverlessResults.map((result, index) => (
                <div key={index}>
                  <pre className="m-4 whitespace-pre-wrap rounded-md bg-blue-800 p-1 text-white">
                    {result.essay}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 border border-slate-800">
          <div className="h-full w-full text-center">
            <button
              className="rounded-full bg-blue-500 p-2 text-white"
              disabled={edgeButtonDisabled}
              onClick={async () => {
                setEdgeButtonDisabled(true);
                const res = await fetch("/api/edge");
                const data = await res.json();
                setEdgeResults((er) => [...er, { essay: data.essay, ms: 0 }]);
                setEdgeButtonDisabled(false);
              }}
            >
              Test Edge
            </button>
            <div className="h-full w-full p-4">
              {edgeResults.map((result, index) => (
                <div key={index}>
                  <pre className="m-4 whitespace-pre-wrap rounded-md bg-blue-800 p-1 text-white">
                    {result.essay}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
