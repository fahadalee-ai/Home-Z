import logoAsset from "@/assets/logo.png.asset.json";

export function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return <img src={logoAsset.url} alt="Supreme Signatures" className={className} />;
}
