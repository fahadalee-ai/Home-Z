import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Apple, Chrome } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — Home Z" }] }),
  component: Login,
});

function Login() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/15 to-transparent" />
      <div className="relative mx-auto flex min-h-screen max-w-[440px] flex-col px-6 py-12">
        <div className="flex flex-col items-center gap-3">
          <Logo className="h-16 w-auto" showName nameClassName="font-display text-2xl font-bold tracking-tight" />
        </div>

        <div className="mt-10 space-y-1">
          <h1 className="font-display text-4xl font-bold">
            Welcome <span className="text-gradient-gold">Back</span>
          </h1>
          <p className="text-sm text-muted-foreground">Sign in to continue bidding on homes.</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); navigate({ to: "/home" }); }}
          className="mt-8 glass rounded-3xl p-6 space-y-4"
        >
          <Field icon={Mail} placeholder="Email address" type="email" />
          <Field
            icon={Lock}
            placeholder="Password"
            type={show ? "text" : "password"}
            trailing={
              <button type="button" onClick={() => setShow(!show)} className="text-muted-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="accent-[color:var(--primary)]" /> Remember me
            </label>
            <a className="text-primary">Forgot password?</a>
          </div>
          <button className="w-full rounded-full bg-gradient-gold py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-gold active:scale-[0.98]">
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> Or continue with <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SocialButton icon={Chrome} label="Google" />
          <SocialButton icon={Apple} label="Apple" />
        </div>

        <p className="mt-auto pt-10 text-center text-sm text-muted-foreground">
          New to Home Z?{" "}
          <Link to="/register" className="font-semibold text-primary">Create account</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ icon: Icon, placeholder, type = "text", trailing }: { icon: any; placeholder: string; type?: string; trailing?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/60 px-4 py-3.5">
      <Icon className="h-4 w-4 text-primary" />
      <input
        type={type}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none"
      />
      {trailing}
    </div>
  );
}

function SocialButton({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex items-center justify-center gap-2 rounded-full border border-border bg-surface py-3.5 text-sm font-medium">
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
