import type { TestSuite } from "./types";

type Props = {
  suites: TestSuite[];
};

const caseIcon: Record<string, string> = {
  pending: "○",
  running: "◎",
  pass: "✓",
  fail: "✗",
  skip: "–",
};

const caseColor: Record<string, string> = {
  pending: "text-slate-500",
  running: "text-blue-400",
  pass: "text-green-400",
  fail: "text-red-400",
  skip: "text-slate-600",
};

export function TestResults({ suites }: Props) {
  if (suites.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-600 text-sm">
        No tests loaded
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto h-full pr-1">
      {suites.map((suite) => {
        const passed = suite.cases.filter((c) => c.status === "pass").length;
        const failed = suite.cases.filter((c) => c.status === "fail").length;
        const total = suite.cases.length;

        return (
          <div
            key={suite.id}
            className="bg-slate-900/60 border border-slate-800 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <span className="text-sm font-medium text-slate-200">
                {suite.name}
              </span>
              <div className="flex items-center gap-3 text-xs">
                {failed > 0 && (
                  <span className="text-red-400">{failed} failed</span>
                )}
                <span className="text-slate-400">
                  {passed}/{total} passed
                </span>
              </div>
            </div>
            <div className="divide-y divide-slate-800/50">
              {suite.cases.map((tc) => (
                <div key={tc.id} className="px-4 py-2.5">
                  <div className="flex items-start gap-2">
                    <span
                      className={`ir-terminal text-sm mt-px ${caseColor[tc.status]}`}
                    >
                      {caseIcon[tc.status]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-sm ${
                          tc.status === "fail"
                            ? "text-slate-200"
                            : "text-slate-400"
                        }`}
                      >
                        {tc.name}
                      </span>
                      {tc.duration !== undefined && (
                        <span className="ml-2 text-xs text-slate-600">
                          {tc.duration}ms
                        </span>
                      )}
                      {tc.error && (
                        <pre className="mt-1.5 text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded p-2 overflow-x-auto ir-terminal">
                          {tc.error}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
