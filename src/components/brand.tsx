export function FolioMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-md bg-[var(--ink)] text-[var(--canvas)]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 2.5h7.2L13 5.3V13.5H3V2.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path d="M10 2.5V5.3H13" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5.2 8.2h5.6M5.2 10.6h3.8" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </span>
      <span
        className="font-[family-name:var(--font-display)] text-[1.35rem] font-700 tracking-[-0.04em]"
        style={{ fontWeight: 700 }}
      >
        Folio
      </span>
    </div>
  );
}
