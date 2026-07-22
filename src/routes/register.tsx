import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Shield, CreditCard, MapPin, User, Sparkles } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account — Home Z" }] }),
  component: Register,
});

const STEPS = [
  { n: 1, label: "Personal", icon: User },
  { n: 2, label: "Address", icon: MapPin },
  { n: 3, label: "Interests", icon: Sparkles },
  { n: 4, label: "Payment", icon: CreditCard },
  { n: 5, label: "Verify", icon: Shield },
];

const INTERESTS = [
  "Luxury Villas", "Modern Homes", "Penthouses", "Condos",
  "Mountain Homes", "Waterfront", "Investment Properties", "Starter Homes", "Townhomes", "Vacation Homes",
];

function Register() {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>(["Luxury Villas", "Modern Homes"]);
  const [terms, setTerms] = useState({ tos: false, privacy: false });
  const navigate = useNavigate();

  const toggle = (i: string) =>
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[440px] flex-col px-6 py-8">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <button onClick={() => (step > 1 ? setStep(step - 1) : navigate({ to: "/onboarding" }))} className="grid h-10 w-10 place-items-center rounded-full border border-border">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Step {step} of 5
        </div>
        <Link to="/login" className="text-xs text-muted-foreground">Sign in</Link>
      </div>

      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((s) => (
          <div key={s.n} className={`h-1 flex-1 rounded-full ${s.n <= step ? "bg-gradient-gold" : "bg-white/10"}`} />
        ))}
      </div>

      <div className="mt-8 flex-1">
        {step === 1 && <Personal />}
        {step === 2 && <Address />}
        {step === 3 && <Interests selected={interests} onToggle={toggle} />}
        {step === 4 && <Payment />}
        {step === 5 && <Verify terms={terms} setTerms={setTerms} />}
      </div>

      <button
        onClick={() => (step < 5 ? setStep(step + 1) : navigate({ to: "/home" }))}
        disabled={step === 5 && !(terms.tos && terms.privacy)}
        className="mt-8 flex items-center justify-between rounded-full bg-gradient-gold py-4 pl-6 pr-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-gold disabled:opacity-40"
      >
        {step === 5 ? "Create Account" : "Continue"}
        <span className="grid h-10 w-10 place-items-center rounded-full bg-black/15">
          <ArrowRight className="h-4 w-4" />
        </span>
      </button>
    </div>
  );
}

function StepHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

const I = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
  />
);

function Personal() {
  return (
    <>
      <StepHeader title="Personal Information" sub="Tell us a bit about yourself." />
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <I placeholder="First name" />
          <I placeholder="Last name" />
        </div>
        <I placeholder="Email address" type="email" />
        <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-3">
          <I placeholder="+1" />
          <I placeholder="Mobile number" />
        </div>
        <I placeholder="Password" type="password" />
        <I placeholder="Confirm password" type="password" />
      </div>
    </>
  );
}

function Address() {
  return (
    <>
      <StepHeader title="Address Information" sub="Where should we send closing documents?" />
      <div className="space-y-3">
        <I placeholder="Street address" />
        <div className="grid grid-cols-2 gap-3">
          <I placeholder="City" />
          <I placeholder="State" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <I placeholder="Country" />
          <I placeholder="Postal code" />
        </div>
      </div>
    </>
  );
}

function Interests({ selected, onToggle }: { selected: string[]; onToggle: (i: string) => void }) {
  return (
    <>
      <StepHeader title="Property Interests" sub="Pick categories to personalize your feed." />
      <div className="grid grid-cols-2 gap-3">
        {INTERESTS.map((i) => {
          const on = selected.includes(i);
          return (
            <button
              key={i}
              onClick={() => onToggle(i)}
              className={`relative rounded-2xl border p-4 text-left text-sm transition ${
                on ? "border-primary bg-primary/10" : "border-border bg-surface"
              }`}
            >
              <span className={on ? "text-primary font-semibold" : ""}>{i}</span>
              {on && (
                <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-gradient-gold text-primary-foreground">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

function Payment() {
  return (
    <>
      <StepHeader title="Add Payment Method" sub="Securely stored for seamless checkout." />
      <div className="glass-gold mb-4 rounded-2xl p-4 text-xs text-muted-foreground">
        Your card is encrypted and never shared. Used only when you win a property auction.
      </div>
      <div className="space-y-3">
        <I placeholder="Cardholder name" />
        <I placeholder="Card number" inputMode="numeric" />
        <div className="grid grid-cols-2 gap-3">
          <I placeholder="MM / YY" />
          <I placeholder="CVV" inputMode="numeric" />
        </div>
        <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" defaultChecked className="accent-[color:var(--primary)]" />
          Save card securely for future bids
        </label>
      </div>
    </>
  );
}

function Verify({ terms, setTerms }: { terms: { tos: boolean; privacy: boolean }; setTerms: (t: any) => void }) {
  return (
    <>
      <StepHeader title="Almost there" sub="Review and accept to start bidding on homes." />
      <div className="space-y-3">
        <label className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-sm">
          <input type="checkbox" checked={terms.tos} onChange={(e) => setTerms({ ...terms, tos: e.target.checked })} className="mt-1 accent-[color:var(--primary)]" />
          <span>I accept the <span className="text-primary">Terms & Conditions</span> of Home Z, including property auction bidding rules.</span>
        </label>
        <label className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-sm">
          <input type="checkbox" checked={terms.privacy} onChange={(e) => setTerms({ ...terms, privacy: e.target.checked })} className="mt-1 accent-[color:var(--primary)]" />
          <span>I accept the <span className="text-primary">Privacy Policy</span> and consent to identity verification.</span>
        </label>
        <div className="glass rounded-2xl p-4 text-xs text-muted-foreground">
          <Shield className="mb-2 h-4 w-4 text-primary" />
          Every account is verified to keep Home Z auctions secure and trusted.
        </div>
      </div>
    </>
  );
}
