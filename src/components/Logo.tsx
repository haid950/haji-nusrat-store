export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="1" y="1" width="46" height="46" rx="12" fill="#fff" />
      <path
        d="M13 14v20M13 24h10M23 14v20M28 34V14l9 20V14"
        fill="none"
        stroke="#02040a"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-3 ${className}`} aria-label="Haji Nusrat Online Store, home">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[18px] font-medium tracking-tight text-fg">Haji Nusrat</span>
        <span className="label mt-1.5 text-[10px] text-muted">Online Store</span>
      </span>
    </a>
  )
}
