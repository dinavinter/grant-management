export type RunnerSuite = "webcontainer" | "docs";

export type TerminalLine = {
  id: string;
  type: "ok" | "err" | "info" | "warn" | "cmd";
  text: string;
  ts: number;
};

export type RunStatus = "idle" | "running" | "pass" | "fail";

export type TestCase = {
  id: string;
  name: string;
  status: "pending" | "running" | "pass" | "fail" | "skip";
  duration?: number;
  error?: string;
};

export type TestSuite = {
  id: string;
  name: string;
  cases: TestCase[];
  status: "pending" | "running" | "pass" | "fail";
};

export type DocSection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
};
