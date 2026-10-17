import { STORE } from '../config'

// Ghost ("phantom") mark: white tile, dark ghost with a wavy hem
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="1" y="1" width="46" height="46" rx="12" fill="#fff" />
      <path
        d="M13 36V23a11 11 0 0 1 22 0v13l-3.67-3-3.66 3L24 33l-3.67 3-3.66-3z"
        fill="#02040a"
        stroke="#02040a"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <ellipse cx="19.8" cy="23.5" rx="2.1" ry="2.8" fill="#fff" />
      <ellipse cx="28.2" cy="23.5" rx="2.1" ry="2.8" fill="#fff" />
    </svg>
  )
}

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-3 ${className}`} aria-label={`${STORE.fullName}, home`}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[18px] font-medium tracking-tight text-fg">{STORE.name}</span>
        <span className="label mt-1.5 text-[10px] text-muted">Store</span>
      </span>
    </a>
  )
}
