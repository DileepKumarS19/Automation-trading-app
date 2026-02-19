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
import {
  TradingMetadata,
  CredentailTypes,
} from "common/types";
import { Activity, ShieldCheck, Coins } from "lucide-react";

const SUPPORTED_ACTIONS = [
  {
    id: "hyperliquid",
    title: "Hyper liquid",
    description: "Place a trade on hyperliquid",
  },
  {
    id: "lighter",
    title: "Lighter",
    description: "Place a trade on lighter",
  },
  {
    id: "backpack",
    title: "Backpack",
    description: "Place a trade on Backpack",
  },
];

const SUPPORTED_ASSETS = ["BTC", "SOL", "ETH"];

export const ActionSheet = ({
  onSelect,
}: {
  onSelect: (kind: NodeKind, metadata: NodeMetaData, credential: CredentailTypes) => void;
}) => {
  const [metadata, setMetadata] = useState<TradingMetadata>({
    type: "LONG",
    qty: 0,
    asset: "BTC",
  });

  const [selectedAction, setSelectedAction] = useState(SUPPORTED_ACTIONS[1].id);
  const [credentials, setCredentials] = useState<CredentailTypes>({
    API_KEY: "",
    ACCOUNT_INDEX: 0,
    API_KEY_INDEX: 0,
  });

  const isFormValid = metadata.qty > 0 && credentials.API_KEY.trim() !== "";

  return (
    <Sheet open={true}>
      <SheetContent className="bg-white border-l shadow-2xl sm:max-w-md p-0 flex flex-col overflow-y-auto font-sans">
        
        {/* Header Section */}
        <div className="p-8 bg-slate-50/50 border-b border-slate-100">
          <SheetHeader className="text-left">
            <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight">Configure Action</SheetTitle>
            <SheetDescription className="text-slate-500 text-sm mt-1">
              Set your trading parameters and platform credentials.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="p-8 space-y-6 flex-grow">
          {/* Platform Selection */}
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Platform</Label>
            <Select
              value={selectedAction}
              onValueChange={(value) => setSelectedAction(value)}
            >
              <SelectTrigger className="w-full h-12 bg-white border-slate-200 rounded-xl px-4 hover:border-indigo-300 transition-all">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl">
                <SelectGroup>
                  {SUPPORTED_ACTIONS.map(({ id, title }) => (
                    <SelectItem key={id} value={id} className="py-3 cursor-pointer font-medium">
                      {title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Trade Parameters */}
          {(selectedAction === "hyperliquid" ||
            selectedAction === "backpack" ||
            selectedAction === "lighter") && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Type</Label>
                  <Select
                    value={metadata.type}
                    onValueChange={(value) => {
                      setMetadata((metadata) => ({
                        ...metadata,
                        type: value as "LONG" | "SHORT",
                      }));
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="LONG" className="text-emerald-600 font-bold">LONG</SelectItem>
                      <SelectItem value="SHORT" className="text-rose-600 font-bold">SHORT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Asset</Label>
                  <Select
                    value={metadata.asset}
                    onValueChange={(value) => {
                      setMetadata((metadata) => ({
                        ...metadata,
                        asset: value,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {SUPPORTED_ASSETS.map((asset) => (
                        <SelectItem key={asset} value={asset} className="font-medium">
                          {asset}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Quantity</Label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="number"
                    className="h-12 pl-12 bg-slate-50 border-slate-200 rounded-xl font-mono focus:bg-white transition-all"
                    placeholder="0.00"
                    value={metadata.qty}
                    onChange={(e) =>
                      setMetadata((m) => ({
                        ...m,
                        qty: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              {/* Security/Credentials Block */}
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">

                <div className="space-y-2">
                  <Label className="text-[11px] font-medium text-slate-500 ml-1">API Key</Label>
                  <Input
                    className="h-10 bg-white border-slate-200 rounded-lg font-mono text-xs"
                    placeholder="Enter key"
                    type="text"
                    value={credentials.API_KEY}
                    onChange={(e) =>
                      setCredentials((c) => ({
                        ...c,
                        API_KEY: String(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-medium text-slate-500 ml-1">Account Index</Label>
                    <Input
                      className="h-10 bg-white border-slate-200 rounded-lg text-xs"
                      type="number"
                      value={credentials.ACCOUNT_INDEX}
                      onChange={(e) =>
                        setCredentials((c) => ({
                          ...c,
                          ACCOUNT_INDEX: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-medium text-slate-500 ml-1">Key Index</Label>
                    <Input
                      className="h-10 bg-white border-slate-200 rounded-lg text-xs"
                      type="number"
                      value={credentials.API_KEY_INDEX}
                      onChange={(e) =>
                        setCredentials((c) => ({
                          ...c,
                          API_KEY_INDEX: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="p-8 border-t border-slate-100 bg-slate-50/50">
          <Button
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
            onClick={() => {
              onSelect(selectedAction as NodeKind, metadata, credentials as CredentailTypes);
            }}
            disabled={!isFormValid}
            type="submit"
          >
            Create Action 
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};