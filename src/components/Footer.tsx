import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Logo from './Logo'
import { SectionHeading } from './Sections'
import { PRODUCT, STORE, asset, formatPrice } from '../config'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as React.CSSProperties

export function Contact() {
  const items = [
    { icon: Phone, label: 'Call us', value: STORE.phone, href: `tel:${STORE.phone.replace(/\s/g, '')}` },
    { icon: MessageCircle, label: 'WhatsApp', value: STORE.phone, href: `https://wa.me/${STORE.whatsapp}` },
    { icon: Mail, label: 'Email', value: STORE.email, href: `mailto:${STORE.email}` },
    { icon: Clock, label: 'Opening hours', value: STORE.hours },
  ]
  return (
    <section id="contact" className="border-t border-line bg-bg py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="07"
          eyebrow="Contact"
          title="We're here to help"
          intro="Questions before you order? Get in touch — we reply quickly."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, label, value, href }, i) => {
            const body = (
              <>
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-fg" />
                  {href && <ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-fg" />}
                </div>
                <p className="label mt-10 text-[11px] text-muted">{label}</p>
                <p className="mt-2 text-[16px] break-words text-fg">{value}</p>
              </>
            )
            const cls = 'lift group rounded-[var(--radius-card)] border border-line bg-surface p-6'
            return href ? (
              <a
                key={label}
                href={href}
                data-reveal
                style={delay(i * 80)}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={cls}
              >
                {body}
              </a>
            ) : (
              <div key={label} data-reveal style={delay(i * 80)} className={cls}>
                {body}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-line bg-bg pt-16 pb-20 text-muted sm:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-[14px]">
            Your trusted shop for genuine PlayStation®5 consoles — {formatPrice(PRODUCT.price)}, free delivery and cash
            on delivery.
          </p>
          <ul className="mt-5 space-y-2.5 text-[14px]">
            <li>
              <a href={`tel:${STORE.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-fg">
                <Phone className="h-4 w-4 shrink-0" /> {STORE.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${STORE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-fg"
              >
                <MessageCircle className="h-4 w-4 shrink-0" /> WhatsApp {STORE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${STORE.email}`} className="flex items-center gap-2 break-all hover:text-fg">
                <Mail className="h-4 w-4 shrink-0" /> {STORE.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0" /> {STORE.address}
            </li>
          </ul>
        </div>
        <div>
          <p className="label text-[11px] text-fg">Shop</p>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            <li><a href="#product" className="hover:text-fg">PS5 Console</a></li>
            <li><a href="#specs" className="hover:text-fg">Specifications</a></li>
            <li><a href="#order" className="hover:text-fg">Order now</a></li>
          </ul>
        </div>
        <div>
          <p className="label text-[11px] text-fg">Help</p>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            <li><a href="#delivery" className="hover:text-fg">Delivery & returns</a></li>
            <li><a href="#faq" className="hover:text-fg">FAQ</a></li>
            <li><a href="#contact" className="hover:text-fg">Contact us</a></li>
          </ul>
        </div>
      </div>

      {/* Night lake: fades in from the page, wordmark and legal line sit on the dark water */}
      <div className="relative mt-16 h-[clamp(380px,46vw,640px)] overflow-hidden">
        <img
          src={asset('footer-night.webp')}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="fjord-drift absolute inset-0 h-full w-full object-cover object-[50%_62%] select-none"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#02040a_0%,rgba(2,4,10,0.4)_16%,rgba(2,4,10,0)_34%,rgba(2,4,10,0)_58%,rgba(2,4,10,0.7)_82%,#02040a_100%)]"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0">
          <p
            aria-hidden="true"
            className="text-display mx-auto max-w-7xl overflow-hidden px-5 text-[17vw] leading-[0.82] whitespace-nowrap bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_45%,rgba(255,255,255,0.18)_100%)] bg-clip-text pb-[0.06em] text-transparent drop-shadow-[0_8px_30px_rgba(2,4,10,0.6)] select-none sm:px-8 lg:text-[200px]"
          >
            Phantom
          </p>
          <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-2 border-t border-white/10 px-5 pt-5 pb-6 text-[12px] text-white/60 sm:px-8 md:flex-row md:justify-between">
            <p className="label text-[10px] text-white/80">© {year} {STORE.fullName}</p>
            <p className="max-w-2xl md:text-right">
              PlayStation, PS5 and DualSense are registered trademarks of Sony Interactive Entertainment Inc.{' '}
              {STORE.fullName} is an independent retailer and is not affiliated with or endorsed by Sony.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function MobileOrderBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 px-5 py-3 backdrop-blur-xl sm:hidden">
      <div className="flex items-center justify-between gap-4">
        <div className="leading-tight">
          <p className="label text-[10px] text-muted">{PRODUCT.shortName}</p>
          <p className="text-display mt-1 text-[22px]">{formatPrice(PRODUCT.price)}</p>
        </div>
        <a href="#order" className="flex-1 rounded-full bg-fg py-3 text-center text-[15px] font-medium text-bg">
          Order now
        </a>
      </div>
    </div>
  )
}
