import { Handle, Position } from "@xyflow/react";
import {TimerNodeMetadata} from "common/types";



export function Timer({
  data,
  isConnectable,
}: {
  data: {
    metadata: TimerNodeMetadata;
  };
  isConnectable: boolean;
}) {
  return (
    <div className="min-w-[150px] rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Trigger
        </span>
        <div className="text-sm font-medium text-slate-700">
          Every <span className="font-bold text-blue-600">{data.metadata.time}</span> seconds
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="!h-3 !w-3 !border-2 !border-white !bg-blue-500 transition-colors hover:!bg-blue-600"
      />
    </div>
  );
}