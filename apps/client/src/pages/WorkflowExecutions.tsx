import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGetExecutions, Execution } from "../lib/http";
import { ArrowLeft, RefreshCw, CheckCircle2, Clock, XCircle } from "lucide-react";

export const WorkflowExecutions = () => {
  const { id } = useParams<{ id: string }>();
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        const response = await apiGetExecutions(id!);
        if (response) setExecutions(response);
      } catch (e) {
        console.error("Failed to get executions", e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExecutions();
  }, [id]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-100",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: "SUCCESS"
        };
      case "PENDING":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-100",
          icon: <Clock className="w-3.5 h-3.5 animate-pulse" />,
          label: "PENDING"
        };
      default:
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-100",
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: "FAILURE"
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 font-sans selection:bg-indigo-100">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-all mb-4"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Execution History
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Workflow ID</span>
              <span className="text-sm font-mono text-slate-500">{id}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Execution Cards */}
        <div className="space-y-4">
          {loading ? (
             <div className="bg-white border border-slate-200 rounded-2xl p-20 flex flex-col items-center">
                <div className="w-10 h-10 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-medium italic">Retrieving history...</p>
             </div>
          ) : executions.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-20 text-center">
              <p className="text-slate-400">No execution data found.</p>
            </div>
          ) : (
            executions.map((exe, idx) => {
              const config = getStatusConfig(exe.status);
              return (
                <div 
                  key={idx}
                  className="relative bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:border-slate-300 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-4">
                      {/* ID Header */}
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Execution Instance</span>
                        <span className="text-sm font-bold text-slate-800 font-mono">
                          ID: <span className="text-indigo-600">{exe._id?.toString() || `EXE-${idx + 1}`}</span>
                        </span>
                      </div>
                      
                      {/* Time Grid */}
                      <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter mb-0.5">Started</span>
                          <span className="text-xs font-medium text-slate-600">
                            {new Date(exe.startTime).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter mb-0.5">Ended</span>
                          <span className="text-xs font-medium text-slate-600">
                            {exe.endTime ? new Date(exe.endTime).toLocaleString() : '--'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge - Moved to Right Corner */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${config.bg} ${config.text} ${config.border} text-[11px] font-bold shadow-sm`}>
                      {config.icon}
                      {config.label}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};