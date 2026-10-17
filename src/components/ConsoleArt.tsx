// Stylised illustration of the console (drawn in SVG, no product photography)
export default function ConsoleArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 460" className={className} role="img" aria-label="Illustration of a PS5 console standing upright">
      <defs>
        <linearGradient id="shell" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dfe3ea" />
          <stop offset="0.45" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9ced8" />
        </linearGradient>
        <linearGradient id="shell-r" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f4f6f9" />
          <stop offset="1" stopColor="#b9c0cc" />
        </linearGradient>
        <linearGradient id="core" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1f27" />
          <stop offset="1" stopColor="#07090d" />
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e4e4e7" stopOpacity="0" />
          <stop offset="0.5" stopColor="#e4e4e7" stopOpacity="0.95" />
          <stop offset="1" stopColor="#e4e4e7" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="floor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="160" cy="438" rx="150" ry="18" fill="url(#floor)" />

      {/* black core */}
      <path d="M118 40 L196 40 L196 420 L118 420 Z" fill="url(#core)" />
      {/* blue light seams */}
      <rect x="121" y="70" width="2.5" height="320" rx="1.2" fill="url(#glow)" />
      <rect x="190.5" y="70" width="2.5" height="320" rx="1.2" fill="url(#glow)" />

      {/* left wing */}
      <path
        d="M120 20 C 80 26, 58 60, 52 120 C 44 200, 70 250, 62 330 C 58 370, 70 404, 120 424 Z"
        fill="url(#shell)"
      />
      {/* right wing */}
      <path
        d="M194 20 C 236 30, 262 70, 268 130 C 274 210, 248 258, 256 334 C 260 372, 246 404, 194 424 Z"
        fill="url(#shell-r)"
      />

      {/* front details */}
      <rect x="146" y="402" width="22" height="5" rx="2.5" fill="#2a2f39" />
      <circle cx="157" cy="380" r="3" fill="#3a404c" />
      <rect x="142" y="92" width="30" height="3" rx="1.5" fill="#2a2f39" />

      {/* stand */}
      <path d="M104 420 h106 l-8 14 h-90 z" fill="#0b0d12" />
    </svg>
  )
}
