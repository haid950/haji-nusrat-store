import Character from './Character'
import DitherBackground from './DitherBackground'
import { PRODUCT, formatPrice } from '../config'

const META = [
  { k: 'Condition', v: 'Brand new, sealed' },
  { k: 'Controller', v: 'DualSense™ included' },
  { k: 'Warranty', v: '12 months' },
  { k: 'Delivery', v: 'Free, 2–5 days' },
]

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as React.CSSProperties

export default function Hero() {
  return (
    <section id="product" className="relative overflow-hidden border-b border-line bg-bg">
      <DitherBackground className="absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#02040a_0%,rgba(2,4,10,0.95)_55%,rgba(2,4,10,0)_80%)] md:bg-[linear-gradient(90deg,#02040a_0%,rgba(2,4,10,0.85)_35%,rgba(2,4,10,0)_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-14 pb-20 sm:px-8 md:grid-cols-[1.1fr_1fr] md:pt-20 md:pb-24">
        <div>
          <p data-reveal className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
            <span className="text-fg">Unit 01</span>
            <span aria-hidden="true">/</span>
            <span>PlayStation®5</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="status-dot h-1.5 w-1.5 rounded-full bg-emerald-400" /> In stock
            </span>
          </p>

          <h1 data-reveal style={delay(80)} className="text-display mt-6 text-[44px] sm:text-[56px] lg:text-[64px]">
            {PRODUCT.name}
          </h1>
          <p data-reveal style={delay(160)} className="mt-5 max-w-md text-[16px] text-muted">
            Lightning-fast loading, stunning 4K gaming and the immersive DualSense™ controller — genuine, sealed
            and delivered straight to your door.
          </p>

          <div data-reveal style={delay(240)} className="mt-8 flex items-end gap-4">
            <span className="text-display text-[48px]">{formatPrice(PRODUCT.price)}</span>
            <span className="label pb-2 text-muted">USD · Free delivery</span>
          </div>

          <div data-reveal style={delay(320)} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#order"
              className="inline-flex items-center justify-center rounded-full bg-fg px-7 py-3.5 text-[15px] font-medium text-bg transition-colors hover:bg-white/85"
            >
              Order now — {formatPrice(PRODUCT.price)}
            </a>
            <a
              href="#specs"
              className="inline-flex items-center justify-center rounded-full border border-line bg-bg/40 px-7 py-3.5 text-[15px] text-fg backdrop-blur transition-colors hover:border-[#3f3f46] hover:bg-surface"
            >
              View specs
            </a>
          </div>

          <dl
            data-reveal
            style={delay(400)}
            className="mt-10 grid max-w-lg grid-cols-2 overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg/60 backdrop-blur"
          >
            {META.map((m, i) => (
              <div
                key={m.k}
                className={`px-5 py-4 ${i % 2 === 0 ? 'border-r border-line' : ''} ${i < 2 ? 'border-b border-line' : ''}`}
              >
                <dt className="label text-[11px] text-muted">{m.k}</dt>
                <dd className="mt-1.5 text-[15px] text-fg">{m.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative -mb-[92px] flex justify-center self-end md:-mb-[108px] md:justify-end">
          <Character />
        </div>
      </div>
    </section>
  )
}
