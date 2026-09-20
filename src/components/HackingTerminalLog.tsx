import React, { useEffect, useRef } from 'react';

export interface LogEntry {
  id: string;
  time: string;
  type: 'info' | 'warn' | 'success' | 'danger';
  text: string;
}

interface HackingTerminalLogProps {
  logs: LogEntry[];
}

export const HackingTerminalLog: React.FC<HackingTerminalLogProps> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full rounded-xl border border-cyan-500/20 bg-[#070b12] p-3 font-mono text-[11px] leading-relaxed shadow-inner">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
        <span className="text-white/40 uppercase tracking-widest text-[10px] flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-cyan-400" />
          SESSION LOG STREAM (SANDBOX &amp; RPC)
        </span>
        <span className="text-[10px] text-white/30">TAIL: LIVE</span>
      </div>

      <div
        ref={containerRef}
        className="max-h-32 sm:max-h-36 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-cyan-500/30 pr-1"
      >
        {logs.map((log) => {
          const typeColor =
            log.type === 'success'
              ? 'text-emerald-400'
              : log.type === 'danger'
                ? 'text-rose-400'
                : log.type === 'warn'
                  ? 'text-amber-400'
                  : 'text-cyan-400/80';

          return (
            <div key={log.id} className="flex items-start gap-2">
              <span className="text-white/30 shrink-0">[{log.time}]</span>
              <span className={`break-all ${typeColor}`}>{log.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
