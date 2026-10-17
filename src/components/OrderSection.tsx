import { useState, type FormEvent } from 'react'
import { Banknote, Building2, Check, Lock, Minus, Plus, Truck } from 'lucide-react'
import ConsoleArt from './ConsoleArt'
import { PRODUCT, STORE, asset, formatPrice } from '../config'

type Payment = 'cod' | 'bank'

type Form = {
  name: string
  phone: string
  email: string
  city: string
  address: string
  notes: string
}

type Errors = Partial<Record<keyof Form, string>>

type Order = Form & { id: string; qty: number; payment: Payment; total: number }

const EMPTY: Form = { name: '', phone: '', email: '', city: '', address: '', notes: '' }

const PAYMENT_LABEL: Record<Payment, string> = {
  cod: 'Cash on delivery',
  bank: 'Bank transfer',
}

function validate(f: Form): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (f.phone.replace(/[^\d]/g, '').length < 10) e.phone = 'Please enter a valid phone number.'
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Please enter a valid email address.'
  if (f.city.trim().length < 2) e.city = 'Please enter your city.'
  if (f.address.trim().length < 8) e.address = 'Please enter your full delivery address.'
  return e
}

function makeOrderId() {
  const d = new Date()
  const date = `${d.getFullYear() % 100}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `HN-${date}-${Math.floor(1000 + Math.random() * 9000)}`
}

function orderMessage(o: Order) {
  return [
    `New order ${o.id} — ${STORE.fullName}`,
    `${o.qty} × ${PRODUCT.shortName} = ${formatPrice(o.total)}`,
    `Payment: ${PAYMENT_LABEL[o.payment]}`,
    `Name: ${o.name}`,
    `Phone: ${o.phone}`,
    o.email && `Email: ${o.email}`,
    `City: ${o.city}`,
    `Address: ${o.address}`,
    o.notes && `Notes: ${o.notes}`,
  ]
    .filter(Boolean)
    .join('\n')
}

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string
  error?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="label mb-2 flex items-baseline justify-between text-[11px] text-muted">
        {label}
        {optional && <span className="text-[10px] text-muted/70">Optional</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-[13px] text-red-400">{error}</span>}
    </label>
  )
}

const inputCls = (bad?: string) =>
  `w-full rounded-[var(--radius-control)] border bg-bg px-4 py-3 text-[15px] text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-fg/60 focus:ring-4 focus:ring-white/10 ${
    bad ? 'border-red-500/70' : 'border-line'
  }`

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as React.CSSProperties

export default function OrderSection() {
  const [qty, setQty] = useState(1)
  const [payment, setPayment] = useState<Payment>('cod')
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [order, setOrder] = useState<Order | null>(null)

  const total = qty * PRODUCT.price

  const update = (key: keyof Form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return
    setOrder({ ...form, id: makeOrderId(), qty, payment, total })
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
  }

  const reset = () => {
    setOrder(null)
    setForm(EMPTY)
    setQty(1)
    setPayment('cod')
  }

  return (
    <section id="order" className="border-t border-line bg-bg py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 border-b border-line pb-10 md:grid-cols-[1fr_1.2fr] md:items-end">
          <div>
            <p data-reveal className="label text-muted">
              <span className="text-fg">[ 04 ]</span> &nbsp;Checkout
            </p>
            <h2 data-reveal style={delay(80)} className="text-display mt-5 text-[36px] sm:text-[48px]">
              Order your PS5
            </h2>
          </div>
          <p data-reveal style={delay(160)} className="max-w-md text-muted md:justify-self-end">
            Fill in your details and we'll call you to confirm your order before dispatch. No payment is taken online.
          </p>
        </div>

        {order ? (
          <div className="mx-auto mt-10 max-w-xl rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center sm:p-10">
            <div className="relative mx-auto h-28 w-28">
              <img
                src={asset('character/smile.webp')}
                alt="Our mascot smiling"
                className="h-full w-full rounded-full border border-line bg-bg object-cover object-top"
              />
              <span className="absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full bg-fg text-bg">
                <Check className="h-5 w-5" />
              </span>
            </div>
            <p className="label mt-6 text-emerald-400">Order received</p>
            <h3 className="text-display mt-3 text-[32px]">Thank you, {order.name.split(' ')[0]}!</h3>
            <p className="mt-3 text-[15px] text-muted">
              Your order <span className="font-mono text-fg">{order.id}</span> has been received. We'll call you on{' '}
              <span className="text-fg">{order.phone}</span> to confirm it.
            </p>

            <dl className="mt-7 divide-y divide-line rounded-[var(--radius-control)] border border-line bg-bg text-left text-[15px]">
              {[
                ['Item', `${order.qty} × ${PRODUCT.shortName}`],
                ['Payment', PAYMENT_LABEL[order.payment]],
                ['Deliver to', `${order.address}, ${order.city}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 px-5 py-3">
                  <dt className="label self-center text-[11px] text-muted">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between px-5 py-3 text-[17px]">
                <dt className="label self-center text-[11px] text-fg">Total</dt>
                <dd className="font-medium">{formatPrice(order.total)}</dd>
              </div>
            </dl>

            <a
              href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(orderMessage(order))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 flex w-full items-center justify-center rounded-full bg-fg py-3.5 text-[15px] font-medium text-bg transition-colors hover:bg-white/85"
            >
              Send order on WhatsApp for faster confirmation
            </a>
            <a
              href={`mailto:${STORE.email}?subject=${encodeURIComponent(`Order ${order.id}`)}&body=${encodeURIComponent(orderMessage(order))}`}
              className="mt-3 flex w-full items-center justify-center rounded-full border border-line py-3.5 text-[15px] transition-colors hover:bg-bg"
            >
              Email order details
            </a>
            <button type="button" onClick={reset} className="mt-5 text-[14px] text-muted underline underline-offset-4 hover:text-fg">
              Place another order
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-10 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div data-reveal className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-medium">Delivery details</h3>
                <span className="label text-muted">Step 01</span>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  <input className={inputCls(errors.name)} value={form.name} onChange={update('name')} autoComplete="name" placeholder="e.g. Ali Khan" />
                </Field>
                <Field label="Phone number" error={errors.phone}>
                  <input className={inputCls(errors.phone)} value={form.phone} onChange={update('phone')} autoComplete="tel" inputMode="tel" placeholder="+92 3xx xxxxxxx" />
                </Field>
                <Field label="Email" optional error={errors.email}>
                  <input className={inputCls(errors.email)} value={form.email} onChange={update('email')} autoComplete="email" inputMode="email" placeholder="you@example.com" />
                </Field>
                <Field label="City" error={errors.city}>
                  <input className={inputCls(errors.city)} value={form.city} onChange={update('city')} autoComplete="address-level2" placeholder="e.g. Lahore" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Full address" error={errors.address}>
                    <textarea rows={3} className={inputCls(errors.address)} value={form.address} onChange={update('address')} autoComplete="street-address" placeholder="House / street / area" />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Order notes" optional>
                    <input className={inputCls()} value={form.notes} onChange={update('notes')} placeholder="e.g. best time to call" />
                  </Field>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between">
                <h3 className="text-[20px] font-medium">Payment method</h3>
                <span className="label text-muted">Step 02</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { id: 'cod', icon: Banknote, title: 'Cash on delivery', text: 'Pay when it arrives' },
                    { id: 'bank', icon: Building2, title: 'Bank transfer', text: 'Details shared on confirmation' },
                  ] as const
                ).map(({ id, icon: Icon, title, text }) => (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-center gap-3.5 rounded-[var(--radius-control)] border p-4 transition-colors ${
                      payment === id ? 'border-fg bg-bg' : 'border-line bg-bg/40 hover:border-[#3f3f46]'
                    }`}
                  >
                    <input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} className="sr-only" />
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${payment === id ? 'border-fg' : 'border-muted/60'}`}
                    >
                      {payment === id && <span className="h-2 w-2 rounded-full bg-fg" />}
                    </span>
                    <Icon className={`h-5 w-5 ${payment === id ? 'text-fg' : 'text-muted'}`} />
                    <span>
                      <span className="block text-[15px]">{title}</span>
                      <span className="block text-[13px] text-muted">{text}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <aside
              data-reveal
              style={delay(120)}
              className="h-fit rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-32"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-medium">Order summary</h3>
                <span className="label text-muted">Step 03</span>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] border border-line bg-bg">
                  <ConsoleArt className="h-16 w-auto" />
                </div>
                <div className="flex-1">
                  <p className="text-[16px]">{PRODUCT.name}</p>
                  <p className="label mt-1 text-[11px] text-muted">{formatPrice(PRODUCT.price)} / unit</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="label text-[11px] text-muted">Quantity</span>
                <div className="flex items-center rounded-full border border-line bg-bg">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 items-center justify-center disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-mono text-[15px]" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(PRODUCT.maxPerOrder, q + 1))}
                    disabled={qty >= PRODUCT.maxPerOrder}
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 items-center justify-center disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="label mt-2 text-right text-[10px] text-muted">Limit {PRODUCT.maxPerOrder} per order</p>

              <dl className="mt-5 space-y-3 border-t border-line pt-5 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="text-emerald-400">Free</dd>
                </div>
                <div className="flex items-end justify-between border-t border-line pt-4">
                  <dt className="label text-[11px]">Total</dt>
                  <dd className="text-display text-[32px]">{formatPrice(total)}</dd>
                </div>
              </dl>

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-fg py-4 text-[16px] font-medium text-bg transition-colors hover:bg-white/85"
              >
                Place order · {formatPrice(total)}
              </button>
              <div className="label mt-5 space-y-2 text-[10px] text-muted">
                <p className="flex items-center justify-center gap-2">
                  <Lock className="h-3.5 w-3.5" /> No payment taken online
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Truck className="h-3.5 w-3.5" /> Free delivery · 7-day returns
                </p>
              </div>
            </aside>
          </form>
        )}
      </div>
    </section>
  )
}
