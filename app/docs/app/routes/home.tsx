import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IR - Interactive Runner" },
    { name: "description", content: "Interactive runner with WebContainer and Docs suites" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">IR</span>
            <span className="text-slate-600 text-sm">Interactive Runner</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold text-white mb-3">
            Interactive Runner
          </h1>
          <p className="text-slate-400 mb-10">
            Select a runner suite to get started. Each suite is purpose-built for a different execution context.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <Link
              to="/runner/webcontainer"
              className="group block bg-slate-900 border border-slate-800 hover:border-blue-700 rounded-xl p-6 no-underline transition-all duration-200 hover:bg-slate-900/80"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-700/30 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-white font-semibold mb-1">WebContainer</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Run Node.js code directly in the browser using the WebContainers API. Execute scripts, install packages, and preview results in real time.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-blue-400">
                <span>Open suite</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              to="/runner/docs"
              className="group block bg-slate-900 border border-slate-800 hover:border-emerald-700 rounded-xl p-6 no-underline transition-all duration-200 hover:bg-slate-900/80"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-700/30 flex items-center justify-center mb-4 group-hover:bg-emerald-600/30 transition-colors">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-white font-semibold mb-1">Docs Runner</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Validate and execute code examples embedded in documentation. Test that all snippets are correct and up to date.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400">
                <span>Open suite</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
