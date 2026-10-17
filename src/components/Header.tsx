import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

const LINKS = [
  { label: 'Console', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Specs', href: '#specs' },
  { label: 'Delivery', href: '#delivery' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-line bg-bg">
        <div className="label mx-auto flex max-w-7xl items-center justify-center gap-6 px-5 py-2.5 text-[11px] text-muted sm:justify-between sm:px-8">
          <span className="flex items-center gap-2 text-fg">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-emerald-400" /> Store online
          </span>
          <span className="hidden sm:inline">Free delivery</span>
          <span className="hidden md:inline">Cash on delivery</span>
          <span className="hidden md:inline">12-month warranty</span>
        </div>
      </div>

      <div
        className={`border-b bg-bg/80 backdrop-blur-xl transition-colors ${
          scrolled ? 'border-line' : 'border-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Logo />

          <ul className="hidden items-center gap-8 text-[15px] text-muted lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-fg">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#order"
              className="hidden rounded-full bg-fg px-5 py-2.5 text-[14px] font-medium text-bg transition-colors hover:bg-white/85 sm:inline-flex"
            >
              Order now
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <div
          className={`overflow-hidden bg-bg transition-[max-height] duration-300 lg:hidden ${
            open ? 'max-h-[440px] border-t border-line' : 'max-h-0'
          }`}
        >
          <ul className="flex flex-col px-5 py-3 sm:px-8">
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-line py-3.5 text-[17px] text-fg"
                >
                  {l.label}
                  <span className="label text-muted">0{i + 1}</span>
                </a>
              </li>
            ))}
            <li className="pt-4 pb-2">
              <a
                href="#order"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-full bg-fg py-3 font-medium text-bg"
              >
                Order now
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
