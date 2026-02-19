import { TradingMetadata } from "./Lighter";
import { Handle, Position } from "@xyflow/react";

export function Backpack({
  data,
}: {
  data: {
    metadata: TradingMetadata;
  };
}) {
  const isLong = data.metadata.type?.toLowerCase() === "long";

  return (
    <div className="min-w-[140px] rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-indigo-400">
      {/* Slim Header */}
      <div className="flex items-center justify-between border-b bg-slate-50 px-3 py-1.5 rounded-t-lg">
        <span className="text-[9px] font-bold uppercase tracking-tight text-slate-500">
          Backpack
        </span>
        <div className={`h-1.5 w-1.5 rounded-full ${isLong ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      </div>

      {/* Tight Content */}
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-medium">Asset</span>
          <span className="text-xs font-bold text-slate-800">{data.metadata.symbol}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-medium">Type</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            isLong ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {data.metadata.type?.toUpperCase()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-medium">Qty</span>
          <span className="text-xs font-mono font-semibold text-slate-700">{data.metadata.qty}</span>
        </div>
      </div>

      {/* Handles - Slightly smaller to match container */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!h-2.5 !w-2.5 !border-2 !border-white !bg-slate-300"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!h-2.5 !w-2.5 !border-2 !border-white !bg-indigo-500"
      />
    </div>
  );
}