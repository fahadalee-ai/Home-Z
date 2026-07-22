import logo from "@/assets/Logo.png";

type LogoProps = {
  className?: string;
  /** Show “Home Z” wordmark under the mark */
  showName?: boolean;
  nameClassName?: string;
};

export function Logo({
  className = "h-10 w-auto",
  showName = false,
  nameClassName = "font-display text-2xl font-bold tracking-tight",
}: LogoProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <img src={logo} alt="Home Z" className={className} />
      {showName && (
        <span className={nameClassName}>
          Home <span className="text-gradient-gold">Z</span>
        </span>
      )}
    </div>
  );
}
