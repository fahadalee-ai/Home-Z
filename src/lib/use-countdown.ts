import { useEffect, useState } from "react";

export function useCountdown(target: number) {
  // Start at 0 so SSR and first client render match — avoids hydration mismatch.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = now === null ? 0 : Math.max(0, target - now);
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { d, h, m, s, ms, ended: now !== null && ms === 0, ready: now !== null };
}
