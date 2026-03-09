import { Lock, Unlock, Shield, TrendingUp, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface EscrowVisualizationProps {
  totalFunds: number;
  lockedFunds: number;
  releasedFunds: number;
  className?: string;
}

export function EscrowVisualization({
  totalFunds,
  lockedFunds,
  releasedFunds,
  className,
}: EscrowVisualizationProps) {
  const safeTotal = totalFunds || 1;
  const lockedPct = (lockedFunds / safeTotal) * 100;
  const releasedPct = (releasedFunds / safeTotal) * 100;
  const remainingPct = Math.max(0, 100 - lockedPct - releasedPct);

  return (
    <div className={cn("rounded-2xl border-2 border-sky-200/60 dark:border-sky-800/40 bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 shadow-lg shadow-sky-100/30 dark:shadow-sky-900/10 overflow-hidden", className)}>
      {/* Vault Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 px-5 py-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1 left-3 w-6 h-6 border border-white/20 rounded-full" />
          <div className="absolute bottom-1 right-6 w-10 h-10 border border-white/20 rounded-full" />
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">ESCROW VAULT</h3>
            <p className="text-[10px] text-sky-300/80 font-mono tracking-widest">SECURE FUND MANAGEMENT</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-green-300">ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30 relative overflow-hidden">
            <div className="absolute -right-2 -bottom-2 opacity-[0.06]"><Lock className="w-14 h-14" /></div>
            <div className="flex items-center gap-2 mb-1 relative">
              <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Locked</span>
            </div>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300 relative">₹{lockedFunds.toLocaleString("en-IN")}</p>
            <p className="text-[11px] text-blue-500 dark:text-blue-400/70 relative">{lockedPct.toFixed(1)}% of total</p>
          </div>
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/30 relative overflow-hidden">
            <div className="absolute -right-2 -bottom-2 opacity-[0.06]"><Unlock className="w-14 h-14" /></div>
            <div className="flex items-center gap-2 mb-1 relative">
              <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">Released</span>
            </div>
            <p className="text-lg font-bold text-green-700 dark:text-green-300 relative">₹{releasedFunds.toLocaleString("en-IN")}</p>
            <p className="text-[11px] text-green-500 dark:text-green-400/70 relative">{releasedPct.toFixed(1)}% of total</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30 relative overflow-hidden">
            <div className="absolute -right-2 -bottom-2 opacity-[0.06]"><Landmark className="w-14 h-14" /></div>
            <div className="flex items-center gap-2 mb-1 relative">
              <TrendingUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total</span>
            </div>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-300 relative">₹{totalFunds.toLocaleString("en-IN")}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400/70 relative">100%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-foreground">Fund Distribution</span>
            <span className="text-[10px] font-mono text-muted-foreground">{releasedPct.toFixed(1)}% released</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-5 overflow-hidden flex shadow-inner">
            {releasedPct > 0 && (
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-[10px] font-semibold transition-all duration-500"
                style={{ width: `${releasedPct}%` }}
              >
                {releasedPct > 8 && `${releasedPct.toFixed(0)}%`}
              </div>
            )}
            {lockedPct > 0 && (
              <div
                className="bg-gradient-to-r from-blue-500 to-sky-500 flex items-center justify-center text-white text-[10px] font-semibold transition-all duration-500"
                style={{ width: `${lockedPct}%` }}
              >
                {lockedPct > 8 && `${lockedPct.toFixed(0)}%`}
              </div>
            )}
            {remainingPct > 0 && (
              <div
                className="bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-[10px] font-semibold transition-all duration-500"
                style={{ width: `${remainingPct}%` }}
              />
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" /> Released</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-sky-500" /> Locked in Escrow</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" /> Remaining</span>
          </div>
        </div>

        {/* Escrow Protection Info */}
        <div className="p-4 bg-sky-50/60 dark:bg-sky-950/20 rounded-xl border border-sky-200/40 dark:border-sky-800/30">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-0.5">Escrow Protection Active</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Funds are locked in smart-contract escrow and released only when milestone proofs are verified by authorities.
                This ensures transparency and accountability for all stakeholders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
