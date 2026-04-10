import { useEffect, useRef } from "react";
import type { TerminalLine } from "./types";

type Props = {
  lines: TerminalLine[];
  onClear?: () => void;
};

export function Terminal({ lines, onClear }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const classForType: Record<TerminalLine["type"], string> = {
    ok: "line-ok",
    err: "line-err",
    info: "line-info",
    warn: "line-warn",
    cmd: "line-cmd",
  };

  return (
    <div className="relative h-full flex flex-col bg-[#060a14] rounded-lg border border-slate-800">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="text-slate-500 text-xs">terminal</span>
        {onClear && (
          <button
            onClick={onClear}
            className="text-slate-500 hover:text-slate-300 text-xs transition-colors cursor-pointer"
          >
            clear
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3 ir-terminal">
        {lines.length === 0 && (
          <span className="text-slate-600 text-xs">awaiting output...</span>
        )}
        {lines.map((line) => (
          <div key={line.id} className={`${classForType[line.type]} leading-6`}>
            <span className="text-slate-600 mr-2 select-none text-[11px]">
              {new Date(line.ts).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
