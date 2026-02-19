import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TriggerSheet } from "./TriggerSheet";
import { PriceTrigger } from "@/nodes/triggers/PriceTrigger";
import { Timer } from "@/nodes/triggers/Timer";
import { Lighter } from "@/nodes/actions/Lighter";
import { ActionSheet } from "./ActionSheet";
import { Backpack } from "@/nodes/actions/Backpack";
import { Hyperliquid } from "@/nodes/actions/Hyperliquid";
import {
  TradingMetadata,
  PriceTriggerMetadata,
  TimerNodeMetadata,
} from "common/types";
import { apiCreateWorkflow } from "@/lib/http";
import { Rocket, LayoutDashboard, Share2, MousePointer2 } from "lucide-react";

// --- TYPES (Maintained as requested) ---
export type NodeMetaData =
  | TradingMetadata
  | PriceTriggerMetadata
  | TimerNodeMetadata;
export type NodeKind =
  | "price-trigger"
  | "timer"
  | "hyperliquid"
  | "backpack"
  | "lighter";

const nodeTypes = {
  "price-trigger": PriceTrigger,
  timer: Timer,
  lighter: Lighter,
  backpack: Backpack,
  hyperliquid: Hyperliquid,
};

type NodeType = TriggerNode | ActionNode;

interface BaseNode {
  id: string;
  type: NodeKind;
  position: { x: number; y: number };
}

interface TriggerNode extends BaseNode {
  data: {
    kind: "trigger";
    metadata: NodeMetaData;
  };
  credentials?: never; 
}

interface ActionNode extends BaseNode {
  data: {
    kind: "action";
    metadata: NodeMetaData;
  };
  credentials: {
    API_KEY: string;
    ACCOUNT_INDEX: number;
    API_KEY_INDEX: number;
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

export function CreateWorkflow() {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectAction, setSelectAction] = useState<{
    position: { x: number; y: number; };
    startingNodeId: string;
  } | null>(null);

  const navigate = useNavigate();

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const POSITION_OFFSET = 50;
  const onConnectEnd = useCallback((params: any, connectionInfo: any) => {
    if (!connectionInfo.isValid) {
      setSelectAction({
        startingNodeId: connectionInfo.fromNode.id,
        position: {
          x: connectionInfo.from.x + POSITION_OFFSET,
          y: connectionInfo.from.y + POSITION_OFFSET,
        },
      });
    }
  }, []);

  const workflowObject = () => {
    return {
      nodes: nodes.map((node) => {
        let credentialPayload: any[] = [];
        if (node.data.kind === "action" && node.credentials) {
          credentialPayload = [{
            API_KEY: node.credentials.API_KEY,
            ACCOUNT_INDEX: node.credentials.ACCOUNT_INDEX,
            API_KEY_INDEX: node.credentials.API_KEY_INDEX
          }];
        } else {
          credentialPayload = []; 
        }
        return {
          id: node.id,
          type: node.type,
          nodeId: "",
          position: { x: node.position.x, y: node.position.y },
          credentials: credentialPayload,
          data: {
            kind: node.data.kind.toUpperCase(),
            metadata: node.data.metadata,
          },
        };
      }),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    };
  };

  const publishWorkflow = async () => {
    const data = workflowObject();
    try {
      await apiCreateWorkflow(data);
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#F8FAFC] overflow-hidden flex flex-col font-sans selection:bg-indigo-100">
      
      {/* Refined Navigation Bar */}
      <nav className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center px-8 justify-between z-20 shadow-sm sticky top-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
          
          <div className="w-px h-6 bg-slate-200 hidden md:block" />
          
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              Automate your TRADE
              <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            </h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Workflow Designer
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-100 active:scale-95"
            onClick={publishWorkflow}
          >
            <Rocket className="w-3.5 h-3.5" />
            Publish
          </button>
        </div>
      </nav>

      {/* Builder Canvas Area */}
      <div className="flex-grow relative bg-[#F8FAFC]">
        {/* Helper Hint for empty canvas */}
        {!nodes.length && (
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="flex flex-col items-center gap-4">
              <MousePointer2 className="w-12 h-12 text-slate-300" />
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm">Drop a Trigger to Begin</p>
            </div>
          </div>
        )}

        {!nodes.length && (
          <TriggerSheet
            onSelect={async (type, metadata, credentials) => {
              const newNode: NodeType = {
                id: Math.random().toString(),
                type,
                data: { kind: "trigger", metadata },
                credentials,
                position: { x: 400, y: 300 },
              };
              setNodes((prev) => [...prev, newNode]);
            }}
          />
        )}

        {selectAction && (
          <ActionSheet
            onSelect={async (type, metadata, credentials) => {
              const newNodeId = Math.random().toString();
              const newNode: NodeType = {
                id: newNodeId,
                type,
                credentials,
                data: { kind: "action", metadata },
                position: selectAction.position,
              };
              const newEdge: Edge = {
                source: selectAction.startingNodeId,
                target: newNodeId,
                id: `${selectAction.startingNodeId}-${newNodeId}`,
              };
              setNodes((prev) => [...prev, newNode]);
              setEdges((prev) => [...prev, newEdge]);
              setSelectAction(null);
            }}
          />
        )}

        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectEnd={onConnectEnd}
          fitView
          className="bg-transparent"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="#E2E8F0"
          />
          <Controls 
            showInteractive={false}
            className="!bg-white !shadow-2xl !border-slate-100 !rounded-2xl !m-8 overflow-hidden !border-none" 
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default CreateWorkflow;