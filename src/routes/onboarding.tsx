import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import jersey from "@/assets/jersey.jpg";
import liveStream from "@/assets/live-stream.jpg";
import celebration from "@/assets/onboarding-3.jpg";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — Home Z" }] }),
  component: Onboarding,
});

const slides = [
  { img: jersey, title: "Discover Premium Homes & Estates", desc: "Browse verified listings — villas, condos, and investment properties curated by Home Z specialists." },
  { img: liveStream, title: "Join Live Property Auctions", desc: "Tour homes with agents on camera and place bids in real time from anywhere." },
  { img: celebration, title: "Win With Smart Auto Bidding", desc: "Set your maximum offer — our proxy bidding system works for you, even while you sleep." },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const s = slides[i];
  const last = i === slides.length - 1;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[440px] flex-col px-6 py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary/80">
            {String(i + 1).padStart(2, "0")} <span className="text-muted-foreground/60">/ 03</span>
          </div>
          <Link to="/login" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">
            Skip
          </Link>
        </div>

        <div className="flex flex-1 flex-col justify-end gap-8 pb-8">
          <div className="glass rounded-3xl p-7">
            <h1 className="font-display text-[34px] leading-[1.05] font-bold text-white">
              {s.title.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-gradient-gold">{s.title.split(" ").slice(-2).join(" ")}</span>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{s.desc}</p>

            <div className="mt-8 flex items-center gap-2">
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-[3px] rounded-full transition-all ${idx === i ? "w-8 bg-gradient-gold" : "w-3 bg-white/15"}`}
                />
              ))}
            </div>
          </div>

          {last ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate({ to: "/register" })}
                className="w-full rounded-full bg-gradient-gold py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-gold active:scale-[0.98]"
              >
                Get Started
              </button>
              <Link to="/login" className="text-center text-sm text-muted-foreground">
                I already have an account
              </Link>
            </div>
          ) : (
            <button
              onClick={() => setI(i + 1)}
              className="group flex items-center justify-between rounded-full border border-primary/40 bg-primary/5 py-4 pl-6 pr-2 text-sm font-semibold uppercase tracking-widest text-primary"
            >
              Next
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-primary-foreground transition group-active:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
