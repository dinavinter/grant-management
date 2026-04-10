import { Link, useLocation } from "react-router";
import type { RunnerSuite } from "./types";

type Suite = {
  id: RunnerSuite;
  label: string;
  description: string;
  href: string;
};

const SUITES: Suite[] = [
  {
    id: "webcontainer",
    label: "WebContainer",
    description: "Run code directly in the browser via WebContainers API",
    href: "/runner/webcontainer",
  },
  {
    id: "docs",
    label: "Docs Runner",
    description: "Execute documentation examples and validate code snippets",
    href: "/runner/docs",
  },
];

export function SuiteSelector() {
  const location = useLocation();

  return (
    <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
      {SUITES.map((suite) => {
        const active = location.pathname === suite.href;
        return (
          <Link
            key={suite.id}
            to={suite.href}
            className={`suite-tab flex-1 px-4 py-2 rounded-md text-sm font-medium text-center transition-all no-underline ${
              active
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            {suite.label}
          </Link>
        );
      })}
    </div>
  );
}
