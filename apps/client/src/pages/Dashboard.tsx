import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiListWorkflows, Workflow } from "../lib/http";
import { jwtDecode } from "jwt-decode";
import { Plus, ExternalLink, Activity, Layers, ArrowRight, Home } from "lucide-react";

export const Dashboard = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isTokenExpired = (token: string | null) => {
    if (!token) return true;
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp) return true;
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token || isTokenExpired(token)) {
      navigate("/auth");
    } else {
      fetchWorkflows();
    }
  }, []);

  const fetchWorkflows = async () => {
    try {
      const data = await apiListWorkflows();
      setWorkflows(data);
    } catch (error) {
      console.error("Failed to fetch workflows:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-end justify-between mb-10 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Workflows
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage and monitor your automated trading sequences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* New Home Button */}
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>

            <Link
              to="/create-workflow"
              className="group flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Create New
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-sm font-medium">Fetching your automations...</p>
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Workflows Found</h3>
              <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
                Get started by building your first automated trading workflow.
              </p>
              <Link
                to="/create-workflow"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                Create your first workflow
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {workflows.map((wf) => (
                <div
                  key={wf._id}
                  className="group bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Workflow <span className="font-mono text-sm font-medium opacity-60">#{wf._id.toString().slice(-6)}</span>
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                          <Plus className="w-3 h-3" /> {wf.nodes.length} Nodes
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                          <Activity className="w-3 h-3" /> {wf.edges.length} Edges
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/workflow/${wf._id}`)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/workflow/executions/${wf._id}`)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all active:scale-95"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      Executions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};