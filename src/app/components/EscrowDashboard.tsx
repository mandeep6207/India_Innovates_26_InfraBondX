import { useEffect, useState } from "react";
import { Lock, Unlock, DollarSign, Clock, CheckCircle, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { apiGet } from "@/app/services/api";

interface EscrowDashboardProps {
  projectId: number;
  className?: string;
}

type TransparencyData = {
  total_raised: number;
  locked: number;
  released: number;
  pending_milestones: number;
  submitted_milestones: number;
  completed_milestones: number;
  next_release_amount: number;
};

export function EscrowDashboard({ projectId, className }: EscrowDashboardProps) {
  const [data, setData] = useState<TransparencyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiGet(`/projects/${projectId}/transparency`);
        if (res && !res.error) setData(res);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

  if (loading) return (
    <div className={`text-sm text-muted-foreground p-4 ${className}`}>Loading escrow data...</div>
  );

  if (!data) return null;

  const totalEscrow = data.locked + data.released;
  const releasedPct = totalEscrow > 0 ? Math.round((data.released / totalEscrow) * 100) : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="w-5 h-5" />
          Escrow Transparency Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Four key metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-[#f59e0b]/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-[#f59e0b]" />
              <p className="text-xs text-muted-foreground">Total Raised</p>
            </div>
            <p className="text-lg font-bold text-[#f59e0b]">
              ₹{data.total_raised.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-3 bg-[#0ea5e9]/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-[#0ea5e9]" />
              <p className="text-xs text-muted-foreground">Total Locked</p>
            </div>
            <p className="text-lg font-bold text-[#0ea5e9]">
              ₹{data.locked.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-3 bg-[#10b981]/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Unlock className="w-4 h-4 text-[#10b981]" />
              <p className="text-xs text-muted-foreground">Total Released</p>
            </div>
            <p className="text-lg font-bold text-[#10b981]">
              ₹{data.released.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-3 bg-[#8b5cf6]/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <ArrowRight className="w-4 h-4 text-[#8b5cf6]" />
              <p className="text-xs text-muted-foreground">Next Release</p>
            </div>
            <p className="text-lg font-bold text-[#8b5cf6]">
              {data.next_release_amount > 0
                ? `₹${data.next_release_amount.toLocaleString("en-IN")}`
                : "—"}
            </p>
          </div>
        </div>

        {/* Release progress bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Escrow Release Progress</span>
            <span>{releasedPct}% released</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#10b981] h-2 rounded-full transition-all"
              style={{ width: `${releasedPct}%` }}
            />
          </div>
        </div>

        {/* Milestone summary */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-[#f59e0b]/10 rounded-lg">
            <Clock className="w-4 h-4 text-[#f59e0b] mx-auto mb-1" />
            <p className="font-bold text-[#f59e0b]">{data.pending_milestones}</p>
            <p className="text-muted-foreground">Pending</p>
          </div>
          <div className="p-2 bg-[#0ea5e9]/10 rounded-lg">
            <ChevronRight className="w-4 h-4 text-[#0ea5e9] mx-auto mb-1" />
            <p className="font-bold text-[#0ea5e9]">{data.submitted_milestones}</p>
            <p className="text-muted-foreground">Submitted</p>
          </div>
          <div className="p-2 bg-[#10b981]/10 rounded-lg">
            <CheckCircle className="w-4 h-4 text-[#10b981] mx-auto mb-1" />
            <p className="font-bold text-[#10b981]">{data.completed_milestones}</p>
            <p className="text-muted-foreground">Completed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
