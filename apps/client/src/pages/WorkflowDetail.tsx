import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
} from "@xyflow/react";
import { 
  Activity, 
  LayoutDashboard, 
  Terminal, 
  ArrowLeft, 
  ShieldCheck, 
  Zap 
} from "lucide-react";
import "@xyflow/react/dist/style.css";

// --- CUSTOM NODE IMPORTS ---
import { Backpack } from "@/nodes/actions/Backpack";
import { Lighter } from "@/nodes/actions/Lighter";
import { Hyperliquid } from "@/nodes/actions/Hyperliquid";
import { Timer } from "@/nodes/triggers/Timer";
import { PriceTrigger } from "@/nodes/triggers/PriceTrigger";
import { apiGetWorkflow } from "@/lib/http";

const WorkflowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Register Custom Nodes (Memoized for performance)
  const nodeTypes = useMemo(
    () => ({
      backpack: Backpack,
      lighter: Lighter,
      hyperliquid: Hyperliquid,
      timer: Timer,
      "price-trigger": PriceTrigger,
    }),
    []
  );

  // 2. Data Fetching & Sanitization
  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await apiGetWorkflow(id!);

        if (response) {
          // Fix for the 'credentials' vs 'Credentials' casing issue found in DB logs
          const sanitizedNodes = (response.nodes || []).map((node: any) => ({
            ...node,
            data: {
              ...node.data,
              // Flattening credentials into the data object for easier component access
              credentials: node.credentials || node.Credentials || [],
            },
          }));

          setNodes(sanitizedNodes);
          setEdges(response.edges || []);
        }
      } catch (err) {
        console.error("Error fetching workflow:", err);
        setError("Failed to load workflow. Verify your connection or permissions.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchWorkflow();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-4">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">Building Visualization...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center max-w-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Error</h2>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F8FAFC]">
      {/* --- REFINED HEADER --- */}
      <header className="h-20 border-b bg-white/80 backdrop-blur-md flex items-center px-8 justify-between shadow-sm z-10 relative">
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100 shadow-sm"
          >
            <LayoutDashboard className="w-5 h-5" />
          </Link>
          
          <div className="flex flex-col">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Workflow Canvas
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Live System" />
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Instance ID</span>
              <span className="text-xs font-mono text-slate-400 font-medium">{id}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            to={`/workflow/executions/${id}`}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 text-xs font-bold px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-all border border-slate-100 shadow-sm"
          >
            <Activity className="w-4 h-4" />
            Executions
          </Link>
          <button className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 active:scale-95">
            <Zap className="w-4 h-4" />
            Edit
          </button>
        </div>
      </header>

      {/* --- READ-ONLY CANVAS --- */}
      <main className="flex-grow w-full h-full relative">
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          fitView
          // Read-only settings to prevent accidental modification
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          zoomOnScroll={true}
          className="bg-[#F8FAFC]"
        >
          <Background
            color="#E2E8F0"
            gap={24}
            size={1}
            variant={BackgroundVariant.Dots}
          />
          <Controls
            showInteractive={false}
            className="!bg-white !shadow-2xl !border-slate-100 !rounded-2xl !m-8 overflow-hidden"
          />
        </ReactFlow>
  
      </main>
    </div>
  );
};

export default WorkflowDetails;