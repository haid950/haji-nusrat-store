import { useState } from 'react'
import {
  BadgeCheck,
  Banknote,
  Gamepad2,
  Headphones,
  Library,
  MonitorPlay,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react'
import { PRODUCT, STORE, formatPrice } from '../config'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as React.CSSProperties

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string
  eyebrow: string
  title: string
  intro?: string
}) {
  return (
    <div className="grid gap-6 border-b border-line pb-10 md:grid-cols-[1fr_1.2fr] md:items-end">
      <div>
        <p data-reveal className="label text-muted">
          <span className="text-fg">[ {index} ]</span> &nbsp;{eyebrow}
        </p>
        <h2 data-reveal style={delay(80)} className="text-display mt-5 text-[36px] sm:text-[48px]">
          {title}
        </h2>
      </div>
      {intro && (
        <p data-reveal style={delay(160)} className="max-w-md text-muted md:justify-self-end">
          {intro}
        </p>
      )}
    </div>
  )
}

/* ---------- Trust bar ---------- */

const TRUST = [
  { icon: BadgeCheck, title: '100% genuine', text: 'Brand new, factory-sealed consoles' },
  { icon: ShieldCheck, title: '12-month warranty', text: 'Covered against manufacturing faults' },
  { icon: Truck, title: 'Free delivery', text: 'Delivered to your door, tracked' },
  { icon: Banknote, title: 'Cash on delivery', text: 'Pay when your console arrives' },
]

export function TrustBar() {
  return (
    <section className="border-b border-line bg-bg">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-line lg:grid-cols-4">
        {TRUST.map(({ icon: Icon, title, text }, i) => (
          <div key={title} data-reveal style={delay(i * 80)} className="flex flex-col gap-4 bg-bg px-5 py-8 sm:px-8">
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-fg" />
              <span className="label text-muted">0{i + 1}</span>
            </div>
            <div>
              <p className="text-[15px] text-fg">{title}</p>
              <p className="mt-1 text-[13px] leading-snug text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Features ---------- */

const FEATURES = [
  { icon: Zap, title: 'Ultra-high-speed SSD', text: 'Near-instant load times get you into the game faster.' },
  { icon: MonitorPlay, title: '4K gaming up to 120fps', text: 'Smooth, sharp visuals on compatible 4K TVs, with HDR support.' },
  { icon: Sparkles, title: 'Ray tracing', text: 'Realistic lighting, shadows and reflections in supported games.' },
  { icon: Gamepad2, title: 'DualSense™ controller', text: 'Haptic feedback and adaptive triggers you can actually feel.' },
  { icon: Headphones, title: 'Tempest 3D AudioTech', text: 'Hear where sounds come from with compatible headphones.' },
  { icon: Library, title: 'Plays PS4 games', text: 'Backward compatible with the vast majority of PS4 titles.' },
]

export function Features() {
  return (
    <section id="features" className="bg-bg py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          eyebrow="Capabilities"
          title="Next-generation gaming, at home"
          intro="Everything you need for the latest games — fast, beautiful and immersive."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              data-reveal
              style={delay((i % 3) * 90)}
              className="lift rounded-[var(--radius-card)] border border-line bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg">
                  <Icon className="h-5 w-5 text-fg" />
                </span>
                <span className="label text-muted">F.0{i + 1}</span>
              </div>
              <h3 className="mt-10 text-[19px] font-medium text-fg">{title}</h3>
              <p className="mt-2 text-[15px] text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Specs + in the box ---------- */

const SPECS: [string, string][] = [
  ['CPU', 'AMD Ryzen™ Zen 2, 8 cores @ up to 3.5GHz'],
  ['GPU', 'AMD Radeon™ RDNA 2-based, ray tracing acceleration'],
  ['Memory', '16GB GDDR6'],
  ['Storage', 'Ultra-high-speed SSD'],
  ['Video output', 'Up to 4K at 120Hz, HDR'],
  ['Disc drive', 'Ultra HD Blu-ray™ (disc edition)'],
  ['Connectivity', 'Wi-Fi, Bluetooth®, Ethernet, USB-C & USB-A'],
  ['Audio', 'Tempest 3D AudioTech'],
]

const IN_THE_BOX = [
  'PS5 console',
  'DualSense™ wireless controller',
  'HDMI cable',
  'AC power cord',
  'USB charging cable',
  'Printed manuals',
]

export function Specs() {
  return (
    <section id="specs" className="border-t border-line bg-bg py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="03" eyebrow="Technical specs" title="What's inside" />
        <div className="mt-10 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div data-reveal className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
            <dl className="divide-y divide-line">
              {SPECS.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[120px_1fr] gap-4 px-6 py-4 sm:grid-cols-[180px_1fr]">
                  <dt className="label self-center text-[11px] text-muted">{k}</dt>
                  <dd className="text-[15px] text-fg">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="label border-t border-line px-6 py-4 text-[11px] leading-relaxed text-muted normal-case tracking-normal">
              Specifications may vary slightly by model and edition. Ask us for the exact model in stock.
            </p>
          </div>

          <div
            data-reveal
            style={delay(120)}
            className="flex h-fit flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-display text-[28px]">In the box</h3>
              <span className="label text-muted">{IN_THE_BOX.length} items</span>
            </div>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {IN_THE_BOX.map((item, i) => (
                <li key={item} className="flex items-center justify-between py-3 text-[15px] text-fg">
                  {item}
                  <span className="label text-muted">0{i + 1}</span>
                </li>
              ))}
            </ul>
            <a
              href="#order"
              className="mt-6 flex w-full items-center justify-center rounded-full bg-fg py-3.5 text-[15px] font-medium text-bg transition-colors hover:bg-white/85"
            >
              Order for {formatPrice(PRODUCT.price)}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Delivery & returns ---------- */

const POLICIES = [
  {
    icon: Truck,
    title: 'Fast, free delivery',
    text: 'Orders are dispatched within 24 hours and usually arrive in 2–5 working days. We call to confirm before dispatch.',
  },
  {
    icon: Banknote,
    title: 'Pay your way',
    text: 'Pay cash on delivery, or by bank transfer. You only pay the listed price — no extra charges.',
  },
  {
    icon: RotateCcw,
    title: '7-day returns',
    text: 'If your console arrives damaged or faulty, contact us within 7 days for a replacement or refund.',
  },
  {
    icon: ShieldCheck,
    title: '12-month warranty',
    text: 'Every console carries a 12-month warranty against manufacturing defects. Keep your invoice safe.',
  },
]

export function Delivery() {
  return (
    <section id="delivery" className="border-t border-line bg-bg py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="05" eyebrow="Delivery & returns" title="Shop with confidence" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POLICIES.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              data-reveal
              style={delay(i * 80)}
              className="lift rounded-[var(--radius-card)] border border-line bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-fg" />
                <span className="label text-muted">D.0{i + 1}</span>
              </div>
              <h3 className="mt-8 text-[18px] font-medium text-fg">{title}</h3>
              <p className="mt-2 text-[15px] text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */

const FAQS = [
  {
    q: 'Is the PS5 brand new and genuine?',
    a: 'Yes. Every console is brand new, in its original factory-sealed box, and comes with an invoice from Haji Nusrat Online Store.',
  },
  {
    q: 'How much does it cost in total?',
    a: `The price is ${formatPrice(PRODUCT.price)} per console with free delivery. There are no hidden fees.`,
  },
  {
    q: 'How do I pay?',
    a: 'You can pay cash on delivery when the console arrives, or by bank transfer. We share bank details after confirming your order by phone.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders are dispatched within 24 hours of confirmation and usually arrive within 2–5 working days, depending on your city.',
  },
  {
    q: 'How many consoles can I order?',
    a: `To keep stock fair for everyone, the limit is ${PRODUCT.maxPerOrder} consoles per order.`,
  },
  {
    q: 'What if my console has a problem?',
    a: 'Contact us within 7 days of delivery if it arrives damaged or faulty and we will replace or refund it. Manufacturing faults after that are covered by the 12-month warranty.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="border-t border-line bg-bg py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="06" eyebrow="FAQ" title="Questions, answered" />
        <div className="mt-4 grid md:grid-cols-[1fr_1.2fr] md:gap-10">
          <p data-reveal className="mt-6 max-w-sm text-muted">
            Still have a question? Call us on{' '}
            <a href={`tel:${STORE.phone.replace(/\s/g, '')}`} className="text-fg underline underline-offset-4">
              {STORE.phone}
            </a>
            .
          </p>
          <div className="divide-y divide-line">
            {FAQS.map((f, i) => {
              const isOpen = open === i
              return (
                <div key={f.q} data-reveal style={delay(i * 60)}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-5 py-5 text-left text-[17px] text-fg"
                  >
                    <span className="label w-8 shrink-0 text-muted">0{i + 1}</span>
                    <span className="flex-1">{f.q}</span>
                    <Plus
                      className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 ${isOpen ? 'rotate-45 text-fg' : ''}`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <p className="overflow-hidden pr-10 pl-13 text-[15px] text-muted">
                      <span className="block pb-5">{f.a}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
