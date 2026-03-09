import { useState, useRef, useEffect } from "react";
import { Bell, TrendingUp, Shield, CheckCircle2, AlertTriangle, FileText, Wallet, Clock } from "lucide-react";
import { UserRole } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const investorNotifications: Notification[] = [
  { id: "i1", icon: TrendingUp, iconColor: "text-green-500", title: "Investment Confirmed", message: "Your ₹25,000 investment in Chennai Metro Phase III has been confirmed.", time: "2 min ago", read: false },
  { id: "i2", icon: CheckCircle2, iconColor: "text-blue-500", title: "Milestone Completed", message: "Mumbai Coastal Road — Milestone 2 'Foundation Work' has been verified.", time: "1 hour ago", read: false },
  { id: "i3", icon: Wallet, iconColor: "text-amber-500", title: "Civic Reward Earned", message: "You earned 50 Toll Discount points from Delhi-Jaipur Highway project.", time: "3 hours ago", read: false },
  { id: "i4", icon: Shield, iconColor: "text-emerald-500", title: "Escrow Update", message: "₹2,50,000 released from escrow for Bangalore Metro Extension.", time: "Yesterday", read: true },
  { id: "i5", icon: FileText, iconColor: "text-purple-500", title: "New Document", message: "Environmental clearance certificate uploaded for Pune Smart City.", time: "2 days ago", read: true },
];

const issuerNotifications: Notification[] = [
  { id: "s1", icon: CheckCircle2, iconColor: "text-green-500", title: "Milestone Approved", message: "Your milestone 'Foundation Complete' has been approved by admin.", time: "5 min ago", read: false },
  { id: "s2", icon: Wallet, iconColor: "text-blue-500", title: "Funds Released", message: "₹5,00,000 has been released to your wallet from escrow.", time: "30 min ago", read: false },
  { id: "s3", icon: TrendingUp, iconColor: "text-emerald-500", title: "New Investment", message: "3 new investors have invested ₹75,000 in your project.", time: "2 hours ago", read: false },
  { id: "s4", icon: AlertTriangle, iconColor: "text-amber-500", title: "Proof Required", message: "Please upload proof for 'Phase 2 Completion' milestone.", time: "1 day ago", read: true },
  { id: "s5", icon: FileText, iconColor: "text-purple-500", title: "Project Approved", message: "Your new project listing has been approved by the admin.", time: "3 days ago", read: true },
];

const adminNotifications: Notification[] = [
  { id: "a1", icon: AlertTriangle, iconColor: "text-red-500", title: "Fraud Alert", message: "Suspicious activity detected on project #47 — review required.", time: "Just now", read: false },
  { id: "a2", icon: FileText, iconColor: "text-blue-500", title: "New Project Submitted", message: "Hyderabad Water Treatment Plant submitted for approval.", time: "15 min ago", read: false },
  { id: "a3", icon: Shield, iconColor: "text-amber-500", title: "Milestone Proof Submitted", message: "Chennai Metro Phase III — Milestone 3 proof uploaded for review.", time: "1 hour ago", read: false },
  { id: "a4", icon: CheckCircle2, iconColor: "text-green-500", title: "KYC Verification", message: "12 new investor KYC applications pending verification.", time: "3 hours ago", read: true },
  { id: "a5", icon: Clock, iconColor: "text-purple-500", title: "Escrow Summary", message: "Weekly escrow report: ₹1.2 Cr locked, ₹45 Lakh released.", time: "Yesterday", read: true },
];

function getNotifications(role: UserRole): Notification[] {
  if (role === "issuer") return issuerNotifications;
  if (role === "admin") return adminNotifications;
  return investorNotifications;
}

interface NotificationDropdownProps {
  role: UserRole;
}

export function NotificationDropdown({ role }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => getNotifications(role));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-accent rounded-full transition-colors relative"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl dark:shadow-black/40 z-50 overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors hover:bg-accent/50 ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className={`mt-0.5 flex-shrink-0 ${n.iconColor}`}>
                    <n.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-semibold truncate ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
