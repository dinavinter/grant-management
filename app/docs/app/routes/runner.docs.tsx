import { useCallback, useRef, useState } from "react";
import { DOC_SECTIONS, buildTestSuites } from "../ir/docs-data";
import { StatusBadge } from "../ir/StatusBadge";
import { Terminal } from "../ir/Terminal";
import { TestResults } from "../ir/TestResults";
import type { RunStatus, TerminalLine, TestSuite } from "../ir/types";
import type { Route } from "./+types/runner.docs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IR - Docs Runner Suite" },
    { name: "description", content: "Execute and validate documentation code examples" },
  ];
}

let uid = 0;
function makeId() {
  return `line-${++uid}`;
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export default function DocsRunnerSuite() {
  const [status, setStatus] = useState<RunStatus>("idle");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [suites, setSuites] = useState<TestSuite[]>(buildTestSuites());
  const [selectedSection, setSelectedSection] = useState(DOC_SECTIONS[0].id);
  const [filter, setFilter] = useState("");
  const abortRef = useRef(false);

  function addLine(type: TerminalLine["type"], text: string) {
    setLines((prev) => [
      ...prev,
      { id: makeId(), type, text, ts: Date.now() },
    ]);
  }

  function updateCase(
    suiteId: string,
    caseId: string,
    patch: Partial<TestSuite["cases"][number]>
  ) {
    setSuites((prev) =>
      prev.map((s) => {
        if (s.id !== suiteId) return s;
        return {
          ...s,
          cases: s.cases.map((c) => (c.id === caseId ? { ...c, ...patch } : c)),
        };
      })
    );
  }

  function updateSuite(suiteId: string, patch: Partial<TestSuite>) {
    setSuites((prev) =>
      prev.map((s) => (s.id === suiteId ? { ...s, ...patch } : s))
    );
  }

  const runAll = useCallback(async () => {
    abortRef.current = false;
    setStatus("running");
    setLines([]);
    setSuites(buildTestSuites());
    addLine("cmd", "$ ir run --suite docs");
    await delay(120);

    let anyFail = false;

    for (const suite of buildTestSuites()) {
      if (abortRef.current) break;

      addLine("info", `Suite: ${suite.name}`);
      updateSuite(suite.id, { status: "running" });

      let suiteFail = false;

      for (const tc of suite.cases) {
        if (abortRef.current) break;

        updateCase(suite.id, tc.id, { status: "running" });
        await delay(180 + Math.random() * 220);

        const pass = Math.random() > 0.15;
        const duration = Math.round(80 + Math.random() * 240);

        if (pass) {
          updateCase(suite.id, tc.id, { status: "pass", duration });
          addLine("ok", `  ✓ ${tc.name} (${duration}ms)`);
        } else {
          suiteFail = true;
          anyFail = true;
          const errMsg = `Expected response status 200, got 401\n  at validateSnippet (ir/runner.ts:42)`;
          updateCase(suite.id, tc.id, {
            status: "fail",
            duration,
            error: errMsg,
          });
          addLine("err", `  ✗ ${tc.name} (${duration}ms)`);
          addLine("err", `    ${errMsg.split("\n")[0]}`);
        }
      }

      updateSuite(suite.id, { status: suiteFail ? "fail" : "pass" });
      await delay(80);
    }

    if (abortRef.current) {
      addLine("warn", "Run aborted");
      setStatus("idle");
    } else {
      addLine(anyFail ? "err" : "ok", anyFail ? "Some tests failed" : "All tests passed");
      setStatus(anyFail ? "fail" : "pass");
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current = true;
  }, []);

  const activeSection = DOC_SECTIONS.find((s) => s.id === selectedSection);

  const filteredSuites = filter
    ? suites.filter((s) =>
        s.name.toLowerCase().includes(filter.toLowerCase())
      )
    : suites;

  return (
    <div className="h-[calc(100vh-53px)] flex min-h-0">
      <aside className="w-56 shrink-0 border-r border-slate-800 flex flex-col">
        <div className="px-3 pt-4 pb-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Sections
          </p>
          <div className="space-y-0.5">
            {DOC_SECTIONS.map((section) => {
              const suite = suites.find((s) => s.id === section.id);
              return (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                    selectedSection === section.id
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <span className="truncate">{section.title}</span>
                  {suite && suite.status !== "pending" && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        suite.status === "pass"
                          ? "bg-green-400"
                          : suite.status === "fail"
                          ? "bg-red-400"
                          : suite.status === "running"
                          ? "bg-blue-400 animate-pulse"
                          : "bg-slate-600"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium text-slate-300">Docs Runner Suite</h2>
            <StatusBadge status={status} />
          </div>
          <div className="flex items-center gap-2">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter suites..."
              className="w-44 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-slate-600"
            />
            <button
              onClick={() => setLines([])}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 rounded transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={stop}
              disabled={status !== "running"}
              className="px-3 py-1.5 text-xs text-slate-300 border border-slate-700 rounded hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Stop
            </button>
            <button
              onClick={runAll}
              disabled={status === "running"}
              className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors cursor-pointer"
            >
              {status === "running" ? "Running..." : "Run All"}
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-0 min-h-0 overflow-hidden">
          <div className="border-r border-slate-800 flex flex-col min-h-0 overflow-hidden">
            <div className="flex gap-0 border-b border-slate-800 shrink-0">
              <button
                onClick={() => {}}
                className="px-4 py-2.5 text-xs font-medium text-slate-300 border-b-2 border-emerald-500"
              >
                Documentation
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {activeSection && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-white mb-1">
                      {activeSection.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{activeSection.description}</p>
                    <div className="flex gap-1.5 mt-2">
                      {activeSection.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded border border-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="prose-custom">
                    {activeSection.content.split("\n").map((line, i) => {
                      if (line.startsWith("## ")) {
                        return (
                          <h2 key={i} className="text-sm font-semibold text-white mt-4 mb-2">
                            {line.slice(3)}
                          </h2>
                        );
                      }
                      if (line.startsWith("### ")) {
                        return (
                          <h3 key={i} className="text-xs font-semibold text-slate-300 mt-3 mb-1.5">
                            {line.slice(4)}
                          </h3>
                        );
                      }
                      if (line.startsWith("```")) {
                        return null;
                      }
                      return (
                        <p key={i} className="text-sm text-slate-400 leading-relaxed">
                          {line}
                        </p>
                      );
                    })}
                    {activeSection.content
                      .split(/```(\w*)\n([\s\S]*?)```/g)
                      .reduce<React.ReactNode[]>((acc, part, i) => {
                        if (i % 3 === 2) {
                          const lang =
                            activeSection.content.split(/```(\w*)\n([\s\S]*?)```/g)[i - 1] || "";
                          acc.push(
                            <pre
                              key={`code-${i}`}
                              className="ir-terminal bg-[#060a14] border border-slate-800 rounded-lg p-3 overflow-x-auto text-slate-300 text-xs my-2"
                            >
                              <code>{part}</code>
                            </pre>
                          );
                        }
                        return acc;
                      }, [])}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col min-h-0 overflow-hidden">
            <div className="flex gap-0 border-b border-slate-800 shrink-0">
              <button className="px-4 py-2.5 text-xs font-medium text-slate-300 border-b-2 border-emerald-500">
                Test Results
              </button>
            </div>
            <div className="flex-1 grid grid-rows-[1fr_auto] min-h-0 overflow-hidden">
              <div className="overflow-y-auto p-3">
                <TestResults suites={filteredSuites} />
              </div>
              <div className="h-40 shrink-0 border-t border-slate-800 p-3">
                <Terminal lines={lines.slice(-30)} onClear={() => setLines([])} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
