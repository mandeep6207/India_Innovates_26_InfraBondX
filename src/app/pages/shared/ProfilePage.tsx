import { User, Mail, Shield, Building2, Calendar, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function ProfilePage() {
  const { user } = useAuth();

  const roleColors: Record<string, string> = {
    investor: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
    issuer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    admin: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  };

  const roleGradients: Record<string, string> = {
    investor: "from-sky-400 to-blue-600",
    issuer: "from-emerald-400 to-green-600",
    admin: "from-amber-400 to-orange-600",
  };

  const role = user?.role || "investor";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account information</p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleGradients[role]} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
              {user?.name?.charAt(0) || "U"}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
                  <span className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mt-1 ${roleColors[role]}`}>
                    {role}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5" disabled>
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Profile
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email Address</p>
                    <p className="text-sm font-medium">{user?.email || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium capitalize">{role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Organization</p>
                    <p className="text-sm font-medium">
                      {role === "admin" ? "InfraBondX Admin" : role === "issuer" ? "PPP Infrastructure" : "Individual Investor"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Account Created</p>
                    <p className="text-sm font-medium">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Status (Investor only) */}
      {role === "investor" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-5 h-5" /> KYC Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800/30">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">KYC Verified</p>
                <p className="text-xs text-green-600 dark:text-green-400">Your identity has been verified via DigiLocker</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground">Last changed: Never</p>
            </div>
            <Button variant="outline" size="sm" disabled>Change Password</Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Not enabled</p>
            </div>
            <Button variant="outline" size="sm" disabled>Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
