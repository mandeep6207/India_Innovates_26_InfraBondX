import { useState, useEffect } from "react";
import { CheckCircle, User, Shield, Smartphone, Mail, MapPin, Phone, FileCheck, Building2, ArrowLeft, Loader2, Fingerprint, Link2, ScanFace, FileSearch, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

/* ── Inline brand logo ────────────────────────────────────────── */
function InfraBondXLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 4L6 16v16c0 16 11.2 30.4 26 34 14.8-3.6 26-18 26-34V16L32 4z" fill="#0c4a6e" opacity="0.12" />
      <path d="M14 38c0-10 8-18 18-18s18 8 18 18" stroke="#0c4a6e" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="18" y="36" width="3" height="12" rx="1.5" fill="#0c4a6e" />
      <rect x="30.5" y="20" width="3" height="28" rx="1.5" fill="#0c4a6e" />
      <rect x="43" y="36" width="3" height="12" rx="1.5" fill="#0c4a6e" />
      <path d="M22 42l10-16 10 16" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

interface KYCOnboardingProps {
  onComplete: () => void;
}

export function KYCOnboarding({ onComplete }: KYCOnboardingProps) {
  const [step, setStep] = useState(1);
  const { completeKYC } = useAuth();

  /* ── OTP verification state ──────────────────────────────────── */
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [verifying, setVerifying] = useState<"email" | "mobile" | null>(null);

  /* ── DigiLocker verification state ───────────────────────────── */
  const [digiLockerStarted, setDigiLockerStarted] = useState(false);
  const [digiLockerStep, setDigiLockerStep] = useState(0); // 0 = not started, 1-4 = steps
  const [digiLockerDone, setDigiLockerDone] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  /* ── Policy acceptance ───────────────────────────────────────── */
  const [termsAccepted, setTermsAccepted] = useState(false);

  const digiLockerSteps = [
    { icon: Link2, label: "Aadhaar Link Check", desc: "Verifying Aadhaar linkage..." },
    { icon: ScanFace, label: "Identity Validation", desc: "Validating identity details..." },
    { icon: FileSearch, label: "Document Fetch", desc: "Retrieving documents from DigiLocker..." },
    { icon: BadgeCheck, label: "KYC Approval", desc: "Completing KYC verification..." },
  ];

  const steps = [
    { id: 1, icon: User, title: "Basic Details", description: "Identity information" },
    { id: 2, icon: Fingerprint, title: "Verification", description: "DigiLocker KYC" },
    { id: 3, icon: Shield, title: "Policy & Terms", description: "Accept & complete" },
  ];

  /* ── Auto-verify OTP after 1 second ──────────────────────────── */
  useEffect(() => {
    if (verifying === "email" && emailOtp === "123456") {
      const t = setTimeout(() => { setEmailVerified(true); setVerifying(null); }, 1000);
      return () => clearTimeout(t);
    }
    if (verifying === "mobile" && mobileOtp === "123456") {
      const t = setTimeout(() => { setMobileVerified(true); setVerifying(null); }, 1000);
      return () => clearTimeout(t);
    }
  }, [verifying, emailOtp, mobileOtp]);

  /* ── DigiLocker animated verification steps ──────────────────── */
  useEffect(() => {
    if (digiLockerStarted && digiLockerStep < 4) {
      const t = setTimeout(() => {
        setDigiLockerStep((s) => s + 1);
      }, 1200);
      return () => clearTimeout(t);
    }
    if (digiLockerStarted && digiLockerStep === 4 && !digiLockerDone) {
      const t = setTimeout(() => {
        setDigiLockerDone(true);
        setShowSuccessPopup(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [digiLockerStarted, digiLockerStep, digiLockerDone]);

  const handleVerifyEmail = () => {
    setEmailOtp("123456");
    setVerifying("email");
  };

  const handleVerifyMobile = () => {
    setMobileOtp("123456");
    setVerifying("mobile");
  };

  const handleStartDigiLocker = () => {
    setDigiLockerStarted(true);
    setDigiLockerStep(1);
  };

  const handleComplete = () => {
    completeKYC();
    onComplete();
  };

  const canProceedStep2 = emailVerified && mobileVerified && digiLockerDone;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0c4a6e] to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-sky-500/5 blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <InfraBondXLogo size={36} />
            <span className="text-xl font-bold tracking-tight text-white">InfraBondX</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Complete Your Verification</h1>
          <p className="text-sm text-white/60">Quick 3-step process to start investing (Demo simulation)</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-11 h-11 rounded-full flex items-center justify-center border-2 mb-2 transition-all duration-300",
                    step > s.id && "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30",
                    step === s.id && "bg-white border-white text-[#0c4a6e] shadow-lg shadow-white/20",
                    step < s.id && "bg-white/10 border-white/20 text-white/40",
                  )}
                >
                  {step > s.id ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <p className={cn("text-xs font-medium text-center", step >= s.id ? "text-white" : "text-white/40")}>{s.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={cn("h-0.5 w-full mx-3 -mt-8 rounded-full transition-all duration-500", step > s.id ? "bg-emerald-500" : "bg-white/10")} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Card className="border-0 shadow-2xl shadow-black/20 bg-white/[0.97] backdrop-blur-sm">
          <CardContent className="p-8">
            {/* ── Step 1: Basic Details ─────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Personal Information</h3>
                  <p className="text-sm text-slate-500">Provide your basic details to get started</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input defaultValue="Demo Investor" className="pl-10 h-11 border-slate-200" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input defaultValue="investor@infrabondx.com" className="pl-10 h-11 border-slate-200" />
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input defaultValue="+91 98765 43210" className="pl-10 h-11 border-slate-200" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input defaultValue="Mumbai" className="pl-10 h-11 border-slate-200" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Address</label>
                  <Input defaultValue="123 Investment Avenue, Mumbai, Maharashtra" className="h-11 border-slate-200" />
                </div>

                <Button onClick={() => setStep(2)} className="w-full h-11 bg-[#0c4a6e] hover:bg-[#0a3d5c] text-white">
                  Continue to Verification
                </Button>
              </div>
            )}

            {/* ── Step 2: Verification + DigiLocker ─────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Verify Your Identity</h3>
                  <p className="text-sm text-slate-500">Complete OTP & DigiLocker verification</p>
                </div>

                {/* Email OTP */}
                <div className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-300",
                  emailVerified ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200",
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className={cn("w-4 h-4", emailVerified ? "text-emerald-600" : "text-slate-500")} />
                      <span className="text-sm font-medium text-slate-700">Email Verification</span>
                    </div>
                    {emailVerified && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  {!emailVerified ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter 6-digit OTP"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        className="h-10 border-slate-200 font-mono tracking-widest text-center"
                        maxLength={6}
                      />
                      <Button
                        onClick={handleVerifyEmail}
                        disabled={verifying === "email"}
                        variant="outline"
                        className="shrink-0 border-[#0c4a6e] text-[#0c4a6e] hover:bg-[#0c4a6e] hover:text-white"
                      >
                        {verifying === "email" ? "Verifying..." : "Send OTP"}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-600">investor@infrabondx.com verified successfully</p>
                  )}
                </div>

                {/* Mobile OTP */}
                <div className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-300",
                  mobileVerified ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200",
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Smartphone className={cn("w-4 h-4", mobileVerified ? "text-emerald-600" : "text-slate-500")} />
                      <span className="text-sm font-medium text-slate-700">Mobile Verification</span>
                    </div>
                    {mobileVerified && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  {!mobileVerified ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter 6-digit OTP"
                        value={mobileOtp}
                        onChange={(e) => setMobileOtp(e.target.value)}
                        className="h-10 border-slate-200 font-mono tracking-widest text-center"
                        maxLength={6}
                      />
                      <Button
                        onClick={handleVerifyMobile}
                        disabled={verifying === "mobile"}
                        variant="outline"
                        className="shrink-0 border-[#0c4a6e] text-[#0c4a6e] hover:bg-[#0c4a6e] hover:text-white"
                      >
                        {verifying === "mobile" ? "Verifying..." : "Send OTP"}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-600">+91 98765 43210 verified successfully</p>
                  )}
                </div>

                {/* ── DigiLocker Verification Card ─────────────────── */}
                <div className={cn(
                  "rounded-2xl border-2 overflow-hidden transition-all duration-500",
                  digiLockerDone ? "border-emerald-300 bg-emerald-50/50" : "border-sky-200 bg-gradient-to-br from-sky-50 to-white",
                )}>
                  {/* DigiLocker Header */}
                  <div className="flex items-center gap-4 px-5 py-4 border-b border-sky-100">
                    {/* DigiLocker Logo SVG */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00449E] to-[#0066CC] flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="8" width="24" height="18" rx="3" stroke="white" strokeWidth="2" fill="none" />
                        <path d="M4 14h24" stroke="white" strokeWidth="1.5" />
                        <rect x="8" y="17" width="6" height="4" rx="1" fill="white" opacity="0.8" />
                        <circle cx="22" cy="19" r="2" stroke="white" strokeWidth="1.5" fill="none" />
                        <path d="M14 5l2-2 2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 3v5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-base">Verify Identity with DigiLocker</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Government of India digital document verification</p>
                    </div>
                    {digiLockerDone && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>

                  {/* DigiLocker Body */}
                  <div className="px-5 py-4">
                    {!digiLockerStarted ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-slate-600 mb-4 max-w-sm mx-auto">
                          Securely verify your Aadhaar, PAN, and identity documents through India's official DigiLocker platform.
                        </p>
                        <Button
                          onClick={handleStartDigiLocker}
                          className="bg-gradient-to-r from-[#00449E] to-[#0066CC] hover:from-[#003580] hover:to-[#0055AA] text-white shadow-lg shadow-blue-500/20 px-8 h-11"
                        >
                          <Fingerprint className="w-4 h-4 mr-2" />
                          Verify with DigiLocker
                        </Button>
                        <p className="text-[11px] text-slate-400 mt-3">Demo simulation — no real data is transmitted</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {digiLockerSteps.map((ds, i) => {
                          const stepNum = i + 1;
                          const isActive = digiLockerStep === stepNum && !digiLockerDone;
                          const isComplete = digiLockerStep > stepNum || digiLockerDone;
                          const isPending = digiLockerStep < stepNum;
                          return (
                            <div
                              key={i}
                              className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500",
                                isComplete && "bg-emerald-50 border border-emerald-200",
                                isActive && "bg-blue-50 border border-blue-200",
                                isPending && "bg-slate-50 border border-slate-100 opacity-50",
                              )}
                            >
                              <div className={cn(
                                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500",
                                isComplete && "bg-emerald-500 text-white",
                                isActive && "bg-blue-500 text-white",
                                isPending && "bg-slate-200 text-slate-400",
                              )}>
                                {isComplete ? (
                                  <CheckCircle className="w-5 h-5" />
                                ) : isActive ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <ds.icon className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={cn(
                                  "text-sm font-medium",
                                  isComplete ? "text-emerald-700" : isActive ? "text-blue-700" : "text-slate-400",
                                )}>
                                  {isComplete ? `✔ ${ds.label}` : ds.label}
                                </p>
                                {isActive && <p className="text-[11px] text-blue-500 mt-0.5">{ds.desc}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Success Popup */}
                {showSuccessPopup && (
                  <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-center animate-in fade-in duration-500">
                    <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-bold text-emerald-800 text-base mb-1">Verification Completed Successfully</h4>
                    <p className="text-xs text-emerald-600">All identity documents have been verified via DigiLocker</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                    onClick={() => { setShowSuccessPopup(false); setStep(3); }}
                    disabled={!canProceedStep2}
                    className="flex-1 h-11 bg-[#0c4a6e] hover:bg-[#0a3d5c] text-white"
                  >
                    {canProceedStep2 ? "Continue to Terms" : "Complete all verifications"}
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step 3: Policy & Terms ───────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                {/* Infrastructure themed banner */}
                <div className="relative rounded-2xl overflow-hidden h-40">
                  <img
                    src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80"
                    alt="Infrastructure"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0c4a6e]/95 via-[#0c4a6e]/80 to-transparent flex items-center px-7">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-amber-300" />
                        <span className="text-amber-300 text-xs font-bold uppercase tracking-widest">Platform Policies</span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1">Platform Policies & Terms</h3>
                      <p className="text-white/70 text-sm max-w-xs">Review our investment policies and accept terms to start building India's future</p>
                    </div>
                  </div>
                </div>

                {/* Policy summary */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#0c4a6e]" /> Key Policy Points
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex items-start gap-2.5">
                      <span className="text-emerald-500 mt-0.5 shrink-0">●</span>
                      Infrastructure bonds carry market and credit risks. Returns are not guaranteed.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-emerald-500 mt-0.5 shrink-0">●</span>
                      Tokens represent fractional bond ownership, NOT cryptocurrency or speculative assets.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-emerald-500 mt-0.5 shrink-0">●</span>
                      All investments are protected through escrow-based milestone release.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-emerald-500 mt-0.5 shrink-0">●</span>
                      Project progress is tracked with drone footage, photos, and third-party audits.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-sky-500 mt-0.5 shrink-0">●</span>
                      This is a HACKATHON DEMO — no real financial transactions involved.
                    </li>
                  </ul>
                </div>

                {/* Acceptance checkbox */}
                <label className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:bg-slate-50"
                  style={{ borderColor: termsAccepted ? "#10b981" : "#e2e8f0", backgroundColor: termsAccepted ? "#f0fdf4" : "transparent" }}
                >
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-emerald-600"
                  />
                  <span className="text-sm text-slate-700">
                    I agree to the platform terms, risk disclosure, and privacy policy. I confirm this is a demo simulation with no real financial implications.
                  </span>
                </label>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={!termsAccepted}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/25"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete Registration
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-white/40">Hackathon Demo · No real financial transactions</p>
        </div>
      </div>
    </div>
  );
}
