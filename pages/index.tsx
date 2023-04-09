import Head from "next/head";
import { useRef, useState } from "react";

interface TestBackendProps {
  apiKey: string;
  apiKeyRef: React.RefObject<HTMLInputElement>;
  buttonDisabled: boolean;
  setButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  results: { essay: string; ms: number }[];
  setResults: React.Dispatch<
    React.SetStateAction<{ essay: string; ms: number }[]>
  >;
  url: string;
  title: string;
}

function TestBackend(props: TestBackendProps) {
  const {
    apiKey,
    apiKeyRef,
    buttonDisabled,
    setButtonDisabled,
    results,
    setResults,
    url,
    title,
  } = props;

  return (
    <div className="flex-1 border border-slate-800">
      <div className="h-full w-full text-center">
        <button
          className="rounded-full bg-blue-500 p-2 text-white"
          disabled={buttonDisabled}
          onClick={async () => {
            if (!apiKey) {
              apiKeyRef.current?.focus();
              return;
            }
            setButtonDisabled(true);
            const start = Date.now();
            const res = await fetch(url, {
              headers: { "Content-Type": "application/json" },
              method: "POST",
              body: JSON.stringify({ apiKey }),
            });
            const end = Date.now();
            const data = await res.json();
            setResults((r) => [...r, { essay: data.essay, ms: end - start }]);
            setButtonDisabled(false);
          }}
        >
          {title}
        </button>
        <div className="p-4">
          {results.map((result, index) => (
            <div className="m-4" key={index}>
              <div className="text-center">Milliseconds: {result.ms}</div>
              <pre className="whitespace-pre-wrap rounded-md bg-blue-800 p-1 text-white">
                {result.essay}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [apiKey, setApiKey] = useState<string>("");
  const apiKeyRef = useRef<HTMLInputElement>(null);

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
      <main className="flex h-full w-full flex-col">
        <div>
          Open AI Key:{" "}
          <input
            ref={apiKeyRef}
            className="border"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            size={55}
          />
        </div>
        <div className="flex w-full flex-1 flex-col lg:flex-row">
          <TestBackend
            apiKey={apiKey}
            apiKeyRef={apiKeyRef}
            buttonDisabled={serverlessButtonDisabled}
            setButtonDisabled={setServerlessButtonDisabled}
            results={serverlessResults}
            setResults={setServerlessResults}
            url="/api/serverless"
            title="Test Serverless"
          />
          <TestBackend
            apiKey={apiKey}
            apiKeyRef={apiKeyRef}
            buttonDisabled={edgeButtonDisabled}
            setButtonDisabled={setEdgeButtonDisabled}
            results={edgeResults}
            setResults={setEdgeResults}
            url="/api/edge"
            title="Test Edge"
          />
        </div>
      </main>
    </>
  );
}
