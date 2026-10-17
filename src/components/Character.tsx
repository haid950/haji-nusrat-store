import { useEffect, useRef, useState } from 'react'
import { asset } from '../config'

// Transparent, recoloured frames cut from the original clip (0.5s–2.67s @ 30fps)
const FRAME_COUNT = 66
const frameSrc = (i: number) => asset(`character/f_${String(i).padStart(3, '0')}.webp`)
const SMILE_SRC = asset('character/smile.webp')
const LAUGH_SRC = asset('character/laugh.webp')

// Gaze keyframes (frame numbers):
//   4–29   head and eyes turned to the right
//   36     eyes fully closed (used to hide head swings and expression changes)
//   45     looking straight at the viewer (smile / laugh images match this frame)
//   64     head and eyes turned fully to the left
const RIGHT_FAR = 4
const RIGHT_NEAR = 29
const BLINK = 36
const CENTER = 45
const LEFT_FAR = 64
const BLINK_MS = 90
// Eyes-closed beat before switching to / from the smile or laugh
const EXPRESSION_BLINK_MS = 90

// How far (as a fraction of the viewport width) the cursor must be from the
// face before the character is looking as far as the frames allow
const GAZE_RANGE = 0.35

// How long he smiles before the page scrolls on to the order form
const SMILE_BEFORE_SCROLL_MS = 1100
const SMILE_HOLD_MS = 2600

type Mood = 'idle' | 'laugh' | 'smile'
type Side = 'left' | 'right'

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)

const BUBBLE: Record<Mood, string> = {
  idle: 'Hi! Looking for a PS5?',
  laugh: 'Haha, yes! Go on, click it!',
  smile: 'Great choice! Let’s get you a PS5.',
}

export default function Character() {
  const boxRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLImageElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const faceRef = useRef<HTMLImageElement>(null)
  const moodRef = useRef<Mood>('idle')
  const swapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [mood, setMood] = useState<Mood>('idle')
  // Which expression image is on screen (lags `mood` by one blink)
  const [face, setFace] = useState<Mood>('idle')
  const [bounce, setBounce] = useState(0)

  const showFrame = (i: number) => {
    const img = frameRef.current
    const src = frameSrc(i)
    // img.src is absolute; compare without the relative "./" prefix of the base
    if (img && !img.src.endsWith(src.replace(/^\.\//, ''))) img.src = src
  }

  // Blink, then swap expression in one step (a crossfade would show two faces at once)
  const changeMood = (m: Mood) => {
    if (moodRef.current === m) return
    moodRef.current = m
    setMood(m)
    // Swap the DOM directly so frame and expression change in the same paint
    const overlay = faceRef.current
    if (overlay) overlay.style.opacity = '0'
    showFrame(BLINK)
    setFace('idle')
    clearTimeout(swapTimer.current)
    swapTimer.current = setTimeout(() => {
      if (overlay && m !== 'idle') {
        overlay.src = m === 'laugh' ? LAUGH_SRC : SMILE_SRC
        overlay.style.opacity = '1'
      }
      showFrame(CENTER)
      setFace(m)
      setBounce((b) => b + 1)
    }, EXPRESSION_BLINK_MS)
  }

  useEffect(() => () => clearTimeout(swapTimer.current), [])

  // Preload every frame so head turns swap instantly
  useEffect(() => {
    const imgs = [SMILE_SRC, LAUGH_SRC, ...Array.from({ length: FRAME_COUNT }, (_, i) => frameSrc(i + 1))].map(
      (src) => {
        const img = new Image()
        img.src = src
        return img
      },
    )
    return () => imgs.forEach((img) => (img.src = ''))
  }, [])

  // Head follows the cursor left / right
  useEffect(() => {
    let side: Side = 'left'
    let blinkTimer: ReturnType<typeof setTimeout> | undefined
    let pending = CENTER

    const onMouseMove = (e: MouseEvent) => {
      const box = boxRef.current
      if (!box || moodRef.current !== 'idle') return
      const r = box.getBoundingClientRect()
      const faceX = r.left + r.width / 2

      const g = clamp((e.clientX - faceX) / (window.innerWidth * GAZE_RANGE), -1, 1)
      const nextSide: Side = g > 0 ? 'right' : 'left'
      pending = Math.round(
        g > 0 ? RIGHT_NEAR + (RIGHT_FAR - RIGHT_NEAR) * g : CENTER + (LEFT_FAR - CENTER) * -g,
      )

      // Swinging the head from one side to the other: show the blink frame
      // briefly so the turn reads as a natural blink instead of a hard cut
      if (nextSide !== side) {
        side = nextSide
        showFrame(BLINK)
        clearTimeout(blinkTimer)
        blinkTimer = setTimeout(() => {
          blinkTimer = undefined
          if (moodRef.current === 'idle') showFrame(pending)
        }, BLINK_MS)
        return
      }
      if (!blinkTimer) showFrame(pending)
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      clearTimeout(blinkTimer)
    }
  }, [])

  // Laugh while hovering an order button, smile when it's clicked
  useEffect(() => {
    let holdTimer: ReturnType<typeof setTimeout> | undefined
    let scrollTimer: ReturnType<typeof setTimeout> | undefined
    const orderLink = (t: EventTarget | null) =>
      t instanceof Element ? t.closest('a[href="#order"]') : null

    const isVisible = () => {
      const box = boxRef.current
      if (!box) return false
      const r = box.getBoundingClientRect()
      return r.bottom > 120 && r.top < window.innerHeight - 120
    }

    const onOver = (e: MouseEvent) => {
      if (moodRef.current === 'smile') return
      if (orderLink(e.target) && !orderLink(e.relatedTarget)) changeMood('laugh')
    }
    const onOut = (e: MouseEvent) => {
      if (moodRef.current !== 'laugh') return
      if (orderLink(e.target) && !orderLink(e.relatedTarget)) changeMood('idle')
    }

    const onClick = (e: MouseEvent) => {
      if (!orderLink(e.target)) return
      changeMood('smile')
      clearTimeout(holdTimer)
      holdTimer = setTimeout(() => changeMood('idle'), SMILE_HOLD_MS)
      // If he's on screen, let the visitor see the smile before scrolling away
      if (isVisible()) {
        e.preventDefault()
        clearTimeout(scrollTimer)
        scrollTimer = setTimeout(() => {
          document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
        }, SMILE_BEFORE_SCROLL_MS)
      }
    }

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('click', onClick)
      clearTimeout(holdTimer)
      clearTimeout(scrollTimer)
    }
  }, [])

  // Squash-and-stretch pop each time the expression changes
  useEffect(() => {
    if (!bounce || face === 'laugh') return
    bodyRef.current?.animate(
      [
        { transform: 'translateY(0) scale(1, 1)' },
        { transform: 'translateY(-10px) scale(0.97, 1.04)', offset: 0.35 },
        { transform: 'translateY(0) scale(1.03, 0.97)', offset: 0.65 },
        { transform: 'translateY(0) scale(1, 1)' },
      ],
      { duration: 450, easing: 'cubic-bezier(0.3, 1.4, 0.5, 1)' },
    )
  }, [bounce, face])

  const expression = face === 'laugh' ? LAUGH_SRC : SMILE_SRC

  return (
    <div ref={boxRef} className="relative aspect-[8/9] w-full max-w-[520px] select-none">
      <div
        ref={bodyRef}
        className={`absolute inset-0 origin-bottom ${face === 'laugh' ? 'mascot-giggle' : ''}`}
      >
        <img
          ref={frameRef}
          src={frameSrc(CENTER)}
          alt="Phantom Store mascot"
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <img
          ref={faceRef}
          src={expression}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          style={{ opacity: face === 'idle' ? 0 : 1 }}
        />
      </div>

      {/* Speech bubble */}
      <div className="absolute top-[4%] left-0 max-w-[48%] sm:-left-4">
        <div
          className="rounded-[18px] rounded-br-md border border-line bg-surface/90 px-4 py-3 text-[14px] leading-snug text-fg shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] backdrop-blur transition-transform duration-300"
          style={{ transform: mood === 'idle' ? 'scale(1)' : 'scale(1.06)' }}
          aria-live="polite"
        >
          <span className="label mb-1 block text-[10px] text-muted">Store assistant</span>
          {BUBBLE[mood]}
        </div>
      </div>
    </div>
  )
}
