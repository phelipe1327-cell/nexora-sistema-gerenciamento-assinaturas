interface BrandProps {
  compact?: boolean;
  inverse?: boolean;
}

export default function Brand({ compact = false, inverse = false }: BrandProps) {
  if (inverse && !compact) {
    return <img className="brand-logo-full" src="/brand/nexora-logo.png" alt="Nexora" />;
  }

  return (
    <div className={`brand ${compact ? "brand--compact" : ""} ${inverse ? "brand--inverse" : ""}`}>
      <img className="brand-mark-image" src="/brand/nexora-mark.png" alt="" aria-hidden="true" />
      {!compact && (
        <span className="brand-copy">
          <strong>NEXORA</strong>
          <small>Subscriptions</small>
        </span>
      )}
      <span className="sr-only">Nexora Subscriptions</span>
    </div>
  );
}
