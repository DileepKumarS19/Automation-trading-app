import { Link } from "react-router-dom";
import { Zap, LayoutDashboard, PlusCircle, ArrowRight, Activity } from "lucide-react";

export function Landing() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#F8FAFC]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl my-5">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <Activity className="w-3 h-3" />
          Powered by Nexa Trading Engine
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150">
          Automate Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 ">
            Trading Alpha
          </span>
        </h1>

        {/* Description */}
       

        {/* Action Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500 mt-5">
          <Link 
            to="/auth" 
            className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:scale-95"
          >
            Get Started
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link 
            to="/create-workflow" 
            className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            Build
          </Link>
        </div>

        {/* Mini Preview Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
          <div className="flex flex-col items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Low Latency</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[8px] text-white font-bold">MERN</div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Stack</span>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cloud Nodes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;