import { NodeKind } from "./CreateWorkflow";
import { NodeMetaData } from "./CreateWorkflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PriceTriggerMetadata, TimerNodeMetadata } from "common/types";
import { SUPPORTED_ASSETS } from "common/types";
import { Clock, Zap, Target } from "lucide-react"; // Simple icons for visual cues

const SUPPORTED_TRIGGERS = [
  {
    id: "timer",
    title: "Timer",
    description: "Run every X seconds",
    icon: <Clock className="w-4 h-4 text-blue-500" />,
  },
  {
    id: "price-trigger",
    title: "Price Trigger",
    description: "Run based on asset price",
    icon: <Target className="w-4 h-4 text-emerald-500" />,
  },
];

export const TriggerSheet = ({
  onSelect
}: {
  onSelect: (kind: NodeKind, metadata: NodeMetaData, credentials: any) => void;
}) => {
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState<PriceTriggerMetadata | TimerNodeMetadata>({
    time: 0.0,
  });
  const [selectedTrigger, setSelectedTrigger] = useState<string>("timer");
  const [open, setOpen] = useState<boolean>(true);

  const credentials = undefined;

  return (
    <Sheet open={open} onOpenChange={(v) => { setOpen(v); if (!v) navigate('/dashboard'); }}>
      <SheetContent className="bg-white border-l shadow-2xl sm:max-w-md p-0 flex flex-col">
        {/* Header with soft background accent */}
        <div className="p-8 bg-slate-50/50 border-b border-slate-100">
          <SheetHeader className="text-left">
            <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight">Setup Trigger</SheetTitle>
            <SheetDescription className="text-slate-500 text-sm mt-1">
              Choose how your automation starts.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="p-8 space-y-8 flex-grow">
          {/* Trigger Type Selection */}
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Trigger Type
            </Label>
            <Select
              value={selectedTrigger}
              onValueChange={(value) => {
                setSelectedTrigger(value);
                if (value === "timer") {
                  setMetadata({ time: 0.0 });
                }
              }}
            >
              <SelectTrigger className="w-full h-12 bg-white border-slate-200 rounded-xl px-4 hover:border-blue-300 transition-all">
                <SelectValue placeholder="Select a trigger" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectGroup>
                  {SUPPORTED_TRIGGERS.map(({ id, title, icon }) => (
                    <SelectItem key={id} value={id} className="py-3 cursor-pointer">
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className="font-medium">{title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Configuration Area */}
          <div className="space-y-6">
            {selectedTrigger === "timer" && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Interval (Seconds)
                </Label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="number"
                    className="h-12 pl-12 bg-slate-50 border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white transition-all"
                    placeholder="0.0"
                    value={String((metadata as TimerNodeMetadata)?.time ?? "")}
                    onChange={(e) => setMetadata(m => ({
                      ...m, 
                      time: Number(e.target.value)
                    }))} 
                  />
                </div>
              </div>
            )}

            {selectedTrigger === "price-trigger" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Price Target
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">$</span>
                    <Input 
                      className="h-12 pl-8 font-mono text-emerald-600 font-bold bg-slate-50 border-slate-200 rounded-xl"
                      placeholder="0.00"
                      type="number" 
                      onChange={(e) => setMetadata(m => ({
                        ...m,
                        price: Number(e.target.value) 
                      }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Asset to Monitor
                  </Label>
                  <Select
                    value={(metadata as PriceTriggerMetadata)?.asset}
                    onValueChange={(value) => setMetadata(m => ({
                      ...m,
                      asset: value
                    }))}
                  >
                    <SelectTrigger className="w-full h-12 bg-slate-50 border-slate-200 rounded-xl">
                      <SelectValue placeholder="Select an asset" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectGroup>
                        {SUPPORTED_ASSETS.map((id) => (
                          <SelectItem key={id} value={id} className="py-2">{id}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="p-8 border-t border-slate-100 bg-slate-50/50">
          <Button
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl transition-all shadow-lg shadow-blue-100 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
            onClick={() => onSelect(selectedTrigger as NodeKind, metadata, credentials as any)}
            disabled={selectedTrigger === "timer" ? !(metadata as TimerNodeMetadata)?.time : !(metadata as PriceTriggerMetadata)?.price}
            type="submit"
          >
            Create Trigger 
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};