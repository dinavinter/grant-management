import { Link, Outlet, useLocation } from "react-router";
import { SuiteSelector } from "../ir/SuiteSelector";
import type { Route } from "./+types/runner";

export function meta({}: Route.MetaArgs) {
  return [{ title: "IR - Runner" }];
}

export default function RunnerLayout() {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col">
      <header className="border-b border-slate-800 px-6 py-3 shrink-0">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 no-underline group"
            >
              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
              <span className="text-slate-400 text-sm group-hover:text-slate-200 transition-colors">
                IR
              </span>
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300 text-sm font-medium">Runner</span>
          </div>

          <div className="w-72">
            <SuiteSelector />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
