import type { RunStatus } from "./types";

type Props = {
  status: RunStatus;
};

const config: Record<RunStatus, { label: string; classes: string; dot: string }> = {
  idle: {
    label: "Idle",
    classes: "bg-slate-800 text-slate-400 border-slate-700",
    dot: "bg-slate-500",
  },
  running: {
    label: "Running",
    classes: "bg-blue-950 text-blue-300 border-blue-800",
    dot: "bg-blue-400 animate-pulse",
  },
  pass: {
    label: "Passed",
    classes: "bg-green-950 text-green-300 border-green-800",
    dot: "bg-green-400",
  },
  fail: {
    label: "Failed",
    classes: "bg-red-950 text-red-300 border-red-800",
    dot: "bg-red-400",
  },
};

export function StatusBadge({ status }: Props) {
  const { label, classes, dot } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
