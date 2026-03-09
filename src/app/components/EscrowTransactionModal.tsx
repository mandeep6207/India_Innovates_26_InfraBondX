import { useState, useEffect } from "react";
import { Shield, Lock, Unlock, CheckCircle2, Loader2, ArrowRight, X, Landmark, BadgeCheck, Send } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface EscrowTransactionModalProps {
  open: boolean;
  milestoneTitle: string;
  releaseAmount: number;
  issuerName: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

const STEPS = [
  { label: "Unlocking money from Escrow Vault...", icon: Lock },
  { label: "Verifying issuer account details...", icon: Shield },
  { label: "Transferring funds securely...", icon: Send },
  { label: "Transaction recorded successfully", icon: CheckCircle2 },
];

export function EscrowTransactionModal({
  open,
  milestoneTitle,
  releaseAmount,
  issuerName,
  onConfirm,
  onClose,
}: EscrowTransactionModalProps) {
  const [phase, setPhase] = useState<"confirm" | "processing" | "success" | "error">("confirm");
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setPhase("confirm");
      setCurrentStep(0);
      setError("");
    }
  }, [open]);

  const runTransaction = async () => {
    setPhase("processing");
    setCurrentStep(0);

    // Animate through steps 0-2 with delays (3 processing steps)
    for (let i = 0; i < 3; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 1000 + Math.random() * 500));
    }

    try {
      await onConfirm();
      // Step 3 is the "recorded" confirmation step
      setCurrentStep(3);
      await new Promise((r) => setTimeout(r, 600));
      setPhase("success");
    } catch (e: any) {
      setError(e?.message || "Transaction failed");
      setPhase("error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-lg m-4 bg-card rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Vault-style header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 px-6 py-5 relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-4 w-8 h-8 border border-white/20 rounded-full" />
            <div className="absolute bottom-2 right-8 w-12 h-12 border border-white/20 rounded-full" />
            <div className="absolute top-4 right-20 w-6 h-6 border border-white/10 rounded" />
          </div>
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">ESCROW FUND RELEASE</h2>
                <p className="text-[11px] text-sky-300/80 font-mono tracking-wider">SECURE TRANSACTION GATEWAY</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* CONFIRM PHASE */}
          {phase === "confirm" && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">You are about to release escrow funds for</p>
                <p className="text-base font-bold text-foreground">{milestoneTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30 text-center">
                  <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 mb-1">Amount to Release</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">₹{releaseAmount.toLocaleString("en-IN")}</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/30 text-center">
                  <p className="text-[11px] font-medium text-green-600 dark:text-green-400 mb-1">Transfer to</p>
                  <p className="text-sm font-bold text-green-700 dark:text-green-300 truncate">{issuerName}</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl">
                <p className="text-xs text-amber-700 dark:text-amber-300 text-center">
                  ⚠ This action is irreversible. Funds will be permanently released from escrow.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                <Button onClick={runTransaction} className="flex-1 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white gap-2">
                  <Unlock className="w-4 h-4" />
                  Release Funds
                </Button>
              </div>
            </div>
          )}

          {/* PROCESSING PHASE */}
          {phase === "processing" && (
            <div className="space-y-4 py-2">
              <div className="text-center mb-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Processing Escrow Transaction...</p>
                <p className="text-xs text-muted-foreground">Please do not close this window</p>
              </div>

              <div className="space-y-2">
                {STEPS.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isActive = idx === currentStep;
                  const isDone = idx < currentStep;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                        isActive
                          ? "bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-700 shadow-sm"
                          : isDone
                          ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30"
                          : "bg-muted/30 border-border/30 opacity-40"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isActive ? "bg-sky-100 dark:bg-sky-900/50" : isDone ? "bg-green-100 dark:bg-green-900/50" : "bg-muted"
                      }`}>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : isActive ? (
                          <Loader2 className="w-4 h-4 animate-spin text-sky-600 dark:text-sky-400" />
                        ) : (
                          <StepIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className={`text-sm ${isActive ? "font-semibold text-foreground" : isDone ? "text-green-700 dark:text-green-300" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUCCESS PHASE */}
          {phase === "success" && (
            <div className="space-y-5 py-2 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-green-700 dark:text-green-300">Escrow Transfer Successful</h3>
                <p className="text-xs text-muted-foreground mt-1">Transaction verified and recorded on blockchain ledger</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/30">
                  <p className="text-[11px] font-medium text-green-600 dark:text-green-400 mb-1">Amount Released</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">₹{releaseAmount.toLocaleString("en-IN")}</p>
                </div>
                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/50 dark:border-sky-800/30">
                  <p className="text-[11px] font-medium text-sky-600 dark:text-sky-400 mb-1">Transferred to</p>
                  <p className="text-sm font-bold text-sky-700 dark:text-sky-300 truncate">{issuerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-xl justify-center">
                <BadgeCheck className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-300">Funds verified & securely transferred to issuer</span>
              </div>

              <Button onClick={onClose} className="w-full">Close</Button>
            </div>
          )}

          {/* ERROR PHASE */}
          {phase === "error" && (
            <div className="space-y-4 py-2 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <X className="w-7 h-7 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-red-700 dark:text-red-300">Transaction Failed</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
                <Button onClick={runTransaction} className="flex-1">Retry</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
