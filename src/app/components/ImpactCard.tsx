import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { cn } from "@/lib/utils";

interface ImpactCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  className?: string;
  subtitle?: string;
}

export function ImpactCard({ icon: Icon, label, value, color = "text-[#0c4a6e]", className, subtitle }: ImpactCardProps) {
  return (
    <Card className={cn("border-l-4 stat-card-hover bg-card/80 backdrop-blur-sm", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground animate-count-up">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={cn("p-2.5 rounded-xl bg-accent/60 dark:bg-accent/30", color)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
