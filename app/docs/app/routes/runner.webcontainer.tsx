import { useCallback, useEffect, useRef, useState } from "react";
import { StatusBadge } from "../ir/StatusBadge";
import { Terminal } from "../ir/Terminal";
import type { RunStatus, TerminalLine } from "../ir/types";
import type { Route } from "./+types/runner.webcontainer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IR - WebContainer Suite" },
    { name: "description", content: "Run Node.js in the browser with WebContainers" },
  ];
}

const STARTER_CODE = `// WebContainer interactive runner
// Edit and run code directly in the browser

const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from WebContainer!\\n');
});

server.listen(3111, () => {
  console.log('Server running on port 3111');
});
`;

const PACKAGE_JSON = JSON.stringify(
  {
    name: "wc-runner",
    version: "1.0.0",
    type: "commonjs",
    scripts: {
      start: "node index.js",
    },
  },
  null,
  2
);

let uid = 0;
function makeId() {
  return `line-${++uid}`;
}

export default function WebContainerSuite() {
  const [status, setStatus] = useState<RunStatus>("idle");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [code, setCode] = useState(STARTER_CODE);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [wcReady, setWcReady] = useState(false);
  const [wcUnsupported, setWcUnsupported] = useState(false);
  const wcRef = useRef<import("@webcontainer/api").WebContainer | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function addLine(type: TerminalLine["type"], text: string) {
    setLines((prev) => [
      ...prev,
      { id: makeId(), type, text, ts: Date.now() },
    ]);
  }

  useEffect(() => {
    async function boot() {
      try {
        addLine("info", "Booting WebContainer...");
        const { WebContainer } = await import("@webcontainer/api");
        const wc = await WebContainer.boot();
        wcRef.current = wc;

        wc.on("server-ready", (port, url) => {
          addLine("ok", `Server ready at ${url} (port ${port})`);
          setPreviewUrl(url);
        });

        addLine("ok", "WebContainer ready");
        setWcReady(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("cross-origin") || msg.includes("SharedArrayBuffer")) {
          setWcUnsupported(true);
          addLine(
            "warn",
            "WebContainer requires COOP/COEP headers. In dev mode, start the server with the correct headers set."
          );
        } else {
          addLine("err", `Boot error: ${msg}`);
        }
      }
    }
    boot();
  }, []);

  const run = useCallback(async () => {
    if (!wcRef.current) {
      addLine("err", "WebContainer not ready");
      return;
    }
    setStatus("running");
    setPreviewUrl(null);
    addLine("cmd", "$ Writing files...");

    try {
      const wc = wcRef.current;

      await wc.mount({
        "package.json": { file: { contents: PACKAGE_JSON } },
        "index.js": { file: { contents: code } },
      });

      addLine("cmd", "$ node index.js");

      const proc = await wc.spawn("node", ["index.js"]);

      proc.output.pipeTo(
        new WritableStream({
          write(chunk) {
            const text = String(chunk).trimEnd();
            if (!text) return;
            for (const line of text.split("\n")) {
              const lower = line.toLowerCase();
              if (lower.includes("error") || lower.startsWith("throw")) {
                addLine("err", line);
              } else {
                addLine("ok", line);
              }
            }
          },
        })
      );

      const code_ = await proc.exit;
      if (code_ === 0 || code_ === null) {
        setStatus("pass");
        if (!previewUrl) addLine("ok", "Process exited successfully");
      } else {
        setStatus("fail");
        addLine("err", `Process exited with code ${code_}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLine("err", `Run error: ${msg}`);
      setStatus("fail");
    }
  }, [code, previewUrl]);

  const stop = useCallback(async () => {
    if (!wcRef.current) return;
    await wcRef.current.teardown();
    wcRef.current = null;
    setStatus("idle");
    setPreviewUrl(null);
    setWcReady(false);
    addLine("warn", "WebContainer stopped");
  }, []);

  return (
    <div className="h-[calc(100vh-53px)] flex flex-col p-4 gap-4 max-w-screen-2xl mx-auto w-full">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium text-slate-300">WebContainer Suite</h2>
          <StatusBadge status={status} />
          {wcUnsupported && (
            <span className="text-xs text-yellow-500 bg-yellow-950/40 border border-yellow-800/40 px-2 py-0.5 rounded">
              COOP/COEP headers required
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLines([])}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 rounded transition-colors cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={stop}
            disabled={status !== "running" && status !== "pass"}
            className="px-3 py-1.5 text-xs text-slate-300 border border-slate-700 rounded hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Stop
          </button>
          <button
            onClick={run}
            disabled={!wcReady || status === "running"}
            className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors cursor-pointer"
          >
            {status === "running" ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col gap-4 min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <label className="text-xs text-slate-500 mb-1.5">index.js</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full bg-[#060a14] border border-slate-800 rounded-lg p-3 ir-terminal text-slate-200 resize-none focus:outline-none focus:border-slate-600 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <label className="text-xs text-slate-500 mb-1.5 block">Terminal</label>
            <div className="h-full">
              <Terminal lines={lines} onClear={() => setLines([])} />
            </div>
          </div>

          {previewUrl && (
            <div className="h-48 shrink-0">
              <label className="text-xs text-slate-500 mb-1.5 block">
                Preview &mdash; {previewUrl}
              </label>
              <iframe
                ref={iframeRef}
                src={previewUrl}
                className="webcontainer-frame w-full h-full"
                title="WebContainer preview"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
