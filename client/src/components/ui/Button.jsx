const VARIANTS = {
  gold: "bg-gold-gradient text-onyx shadow-gold hover:brightness-105 active:brightness-95",
  ghost: "bg-white/[0.04] text-ivory/80 border border-white/10 hover:bg-white/[0.08] hover:text-ivory",
  outline: "bg-transparent text-gold border border-gold/40 hover:bg-gold/10",
  danger: "bg-transparent text-danger/80 hover:text-danger",
  dark: "bg-onyx text-ivory border border-white/10 hover:bg-onyxlight",
};

export default function Button({
  children,
  variant = "gold",
  size = "md",
  className = "",
  loading = false,
  icon: Icon,
  disabled,
  ...props
}) {
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-[15px]" };
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-sm font-semibold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-current/30 border-t-current animate-spin" />
      ) : (
        Icon && <Icon size={size === "lg" ? 18 : 15} />
      )}
      {children}
    </button>
  );
}
