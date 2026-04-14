import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const seedWishes = [
  {
    id: 1,
    name: 'Aarav',
    text: 'Happy Birthday Sohum! Wishing you joy, growth, and beautiful memories.',
  },
  {
    id: 2,
    name: 'Maya',
    text: 'Your kindness lights up every room. Have the most magical birthday.',
  },
]

const memories = [
  {
    title: 'Golden Hour Smile',
    note: 'A little reminder that your smile is everyone’s favorite moment.',
    image:
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Midnight Sparkles',
    note: 'A night filled with warm wishes, music, and shared laughter.',
    image:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Soft Celebration',
    note: 'Another year of strength, love, and unforgettable stories.',
    image:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80',
  },
]

const MotionDiv = motion.div
const MotionButton = motion.button

function App() {
  const shouldReduceMotion = useReducedMotion()
  const [nameInput, setNameInput] = useState('')
  const [visitorName, setVisitorName] = useState('')
  const [showNameModal, setShowNameModal] = useState(true)
  const [cakeCut, setCakeCut] = useState(false)
  const [candlesLit, setCandlesLit] = useState(true)
  const [wishMade, setWishMade] = useState(false)
  const [giftOpened, setGiftOpened] = useState(false)
  const [envelopeOpened, setEnvelopeOpened] = useState(false)
  const [wishInput, setWishInput] = useState('')
  const [wishAuthorInput, setWishAuthorInput] = useState('')
  const [wishes, setWishes] = useState(seedWishes)
  const [wishStars, setWishStars] = useState([])
  const [musicOn, setMusicOn] = useState(false)
  const [showMemoryCard, setShowMemoryCard] = useState(false)
  const [showMemoryChip, setShowMemoryChip] = useState(false)
  const [showCakeGlow, setShowCakeGlow] = useState(false)
  const audioContextRef = useRef(null)
  const ambientNodesRef = useRef([])

  const confetti = Array.from({ length: shouldReduceMotion ? 8 : 18 }, (_, id) => ({
    id,
    x: (Math.random() - 0.5) * 260,
    y: -50 - Math.random() * 130,
    rotate: Math.random() * 360,
    color: ['#f8d66d', '#f8a6c9', '#f5f2e8', '#f7b267'][id % 4],
  }))

  useEffect(() => {
    const storedName = window.localStorage.getItem('birthdayVisitorName')
    if (storedName) {
      setVisitorName(storedName)
      setWishAuthorInput(storedName)
      setShowNameModal(false)
    }
  }, [])

  useEffect(() => {
    const appear = setTimeout(() => setShowMemoryCard(true), 2400)
    const fade = setTimeout(() => {
      setShowMemoryCard(false)
      setShowMemoryChip(true)
    }, 6300)

    return () => {
      clearTimeout(appear)
      clearTimeout(fade)
    }
  }, [])

  useEffect(() => {
    if (musicOn) {
      const ctx = audioContextRef.current ?? new window.AudioContext()
      audioContextRef.current = ctx
      const gain = ctx.createGain()
      gain.gain.value = 0.028
      const oscA = ctx.createOscillator()
      const oscB = ctx.createOscillator()
      oscA.type = 'triangle'
      oscB.type = 'sine'
      oscA.frequency.value = 196
      oscB.frequency.value = 294
      oscA.connect(gain)
      oscB.connect(gain)
      gain.connect(ctx.destination)
      oscA.start()
      oscB.start()
      ambientNodesRef.current = [oscA, oscB, gain]
    } else if (ambientNodesRef.current.length && audioContextRef.current) {
      const [oscA, oscB, gain] = ambientNodesRef.current
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.2)
      oscA.stop(audioContextRef.current.currentTime + 0.25)
      oscB.stop(audioContextRef.current.currentTime + 0.25)
      ambientNodesRef.current = []
    }

    return () => {
      if (ambientNodesRef.current.length) {
        ambientNodesRef.current.forEach((node) => node.disconnect())
        ambientNodesRef.current = []
      }
    }
  }, [musicOn])

  const playEffect = (notes) => {
    if (!musicOn || !audioContextRef.current) return
    const ctx = audioContextRef.current
    notes.forEach((note, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = note
      gain.gain.value = 0.0001
      osc.connect(gain)
      gain.connect(ctx.destination)
      const start = ctx.currentTime + index * 0.08
      gain.gain.exponentialRampToValueAtTime(0.08, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.24)
      osc.start(start)
      osc.stop(start + 0.25)
    })
  }

  const enterCelebration = () => {
    const finalName = nameInput.trim() || 'Friend'
    setVisitorName(finalName)
    setWishAuthorInput(finalName)
    window.localStorage.setItem('birthdayVisitorName', finalName)
    setShowNameModal(false)
  }

  const cutCake = () => {
    if (cakeCut) return
    setCakeCut(true)
    setShowCakeGlow(true)
    playEffect([392, 523, 659])
    setTimeout(() => setShowCakeGlow(false), shouldReduceMotion ? 600 : 1500)
  }

  const blowCandles = () => {
    if (!candlesLit) return
    setCandlesLit(false)
    setWishMade(true)
    playEffect([330, 262])
    setTimeout(() => setWishMade(false), 2800)
  }

  const submitWish = (event) => {
    event.preventDefault()
    if (!wishInput.trim()) return
    const wishName = wishAuthorInput.trim() || visitorName || 'Guest'
    const nextWish = {
      id: Date.now(),
      name: wishName,
      text: wishInput.trim(),
    }
    setWishes((current) => [nextWish, ...current])
    setWishInput('')
    setWishStars((current) => [
      ...current,
      {
        id: `${nextWish.id}-star`,
        left: `${8 + Math.random() * 84}%`,
        top: `${12 + Math.random() * 72}%`,
        size: 8 + Math.random() * 10,
      },
    ])
    playEffect([440, 587, 784])
  }

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_#2a1f56,_#0b1025_58%,_#070915)] text-[#f8f2e5]">
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <div className="glow-blob left-[-10%] top-[14%] h-72 w-72 bg-[#d38aad]" />
        <div className="glow-blob right-[-8%] top-[4%] h-80 w-80 bg-[#b590ff]" />
        <div className="glow-blob bottom-[10%] left-[35%] h-64 w-64 bg-[#f2c878]" />
      </div>

      {wishStars.map((star) => (
        <MotionDiv
          key={star.id}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0.35, 0.95, 0.4], scale: [0.6, 1.2, 0.9] }}
          transition={{ duration: shouldReduceMotion ? 7 : 4, repeat: Number.POSITIVE_INFINITY }}
          className="pointer-events-none fixed rounded-full bg-[#ffe9ac] shadow-[0_0_18px_rgba(255,233,172,0.9)]"
          style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
        />
      ))}

      <button
        onClick={() => setMusicOn((v) => !v)}
        className="fixed bottom-4 right-4 z-30 min-h-12 rounded-2xl border border-white/30 bg-white/15 px-4 text-sm font-medium text-[#fff2d5] shadow-[0_14px_35px_rgba(8,8,25,0.4)] backdrop-blur-xl transition hover:bg-white/25"
      >
        {musicOn ? 'Mute ambiance' : 'Play ambiance'}
      </button>

      <header className="relative flex min-h-screen flex-col items-center justify-center px-5 pb-14 pt-20 text-center md:px-8">
        <p className="font-['Dancing_Script'] text-lg text-[#f6d788]">15 April • Birthday Celebration</p>
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-2 font-serif text-5xl leading-tight tracking-tight md:text-7xl"
        >
          Sohum
        </motion.h1>
        <h2 className="mt-4 max-w-2xl font-serif text-3xl text-[#fff4de] md:text-5xl">A Birthday Evening, Wrapped in Light</h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#f2ddc8] md:text-lg">
          Thank you for showing up for me. This little space is made with love so we can celebrate together, no matter how far we are.
        </p>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-10 w-full max-w-md rounded-[2rem] border border-[#f8d7a5]/35 bg-white/10 p-6 shadow-[0_26px_80px_rgba(8,10,40,0.45)] backdrop-blur-xl"
        >
          <div className="relative mx-auto h-36 w-36 rounded-full border border-[#f9dcab]/60 bg-[radial-gradient(circle,#fff5dc_0%,#f8c998_35%,#d287b2_72%,#6b5cc8_100%)] shadow-[0_0_36px_rgba(248,210,144,0.6)]">
            <div className="absolute inset-4 rounded-full border border-white/50 bg-white/10" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-4xl text-[#fff8ea]">🎂</span>
          </div>
          <p className="mt-4 font-serif text-2xl text-[#ffecc9]">Birthday Emblem</p>
          <p className="mt-1 text-sm text-[#f5e1c3]">A small glowing centerpiece for a magical memory.</p>
        </MotionDiv>

        <div className="mt-10 flex w-full max-w-xl flex-wrap justify-center gap-3">
          <a href="#welcome" className="min-h-12 rounded-full border border-[#f7d9a6]/50 bg-white/10 px-5 py-3 text-sm backdrop-blur-md transition hover:bg-white/20">Celebrate With Me</a>
          <a href="#cake" className="min-h-12 rounded-full bg-gradient-to-r from-[#f6c88f] to-[#e49bc9] px-5 py-3 text-sm font-semibold text-[#321d42] shadow-[0_10px_35px_rgba(246,200,143,0.45)]">Cut the Cake</a>
          <a href="#wishes" className="min-h-12 rounded-full border border-[#f6d788]/60 px-5 py-3 text-sm text-[#f6e8cf] transition hover:bg-white/10">Leave a Wish</a>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 md:gap-14 md:px-8">
        <section id="welcome" className="rounded-3xl border border-white/20 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl md:p-10">
          <p className="font-serif text-2xl leading-relaxed text-[#fff0dc] md:text-3xl">
            “Thank you for being here on my special day. Even if you’re far away, your presence and wishes mean a lot to me.”
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#f7deb8]">Cut a slice of cake, leave a wish, and be part of my birthday.</p>
          {visitorName && <p className="mt-5 text-base text-[#ffdcae]">Thank you for being here, {visitorName}.</p>}
        </section>

        <section id="cake" className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/20 bg-[#ffffff12] p-5 shadow-[0_20px_60px_rgba(9,10,29,0.45)] backdrop-blur-xl md:p-8">
            <h3 className="text-center font-serif text-3xl text-[#ffe7be] md:text-4xl">Cut the Celebration Cake</h3>
            <p className="mt-3 text-center text-[#f6debf]">Tap the cake to cut a slice and claim your sweet return gift.</p>
            <div className="mt-7 flex justify-center">
              <MotionButton
                onClick={cutCake}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                className="relative h-72 w-72 max-w-full cursor-pointer border-0 bg-transparent p-0"
                aria-label="Cut birthday cake"
              >
                {showCakeGlow && <div className="absolute inset-10 rounded-full bg-[#ffdca8]/25 blur-2xl" />}
                <div className="absolute bottom-2 left-1/2 h-8 w-56 -translate-x-1/2 rounded-full bg-black/40 blur-md" />
                <div className="absolute bottom-10 left-1/2 h-36 w-60 -translate-x-1/2 rounded-[40%] bg-gradient-to-b from-[#ffedf7] via-[#f5b8cb] to-[#d77ca0] shadow-[inset_0_10px_15px_rgba(255,255,255,0.45)]" />
                <div className="absolute bottom-[9.8rem] left-1/2 h-20 w-48 -translate-x-1/2 rounded-[38%] bg-gradient-to-b from-[#fff7eb] via-[#fbe8ce] to-[#f4cb97]" />
                {[0, 1, 2].map((candle) => (
                  <div key={candle} className="absolute bottom-[13.6rem] left-1/2 h-12 w-3 -translate-x-1/2 rounded-full bg-[#fef6ea]" style={{ marginLeft: `${(candle - 1) * 34}px` }}>
                    <AnimatePresence>
                      {candlesLit && (
                        <MotionDiv
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={shouldReduceMotion ? { opacity: 0.9 } : { opacity: [0.7, 1, 0.7], scale: [0.85, 1.1, 0.9] }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: shouldReduceMotion ? 0.3 : 0.9, repeat: shouldReduceMotion ? 0 : Number.POSITIVE_INFINITY }}
                          className="absolute -top-5 left-1/2 h-5 w-3 -translate-x-1/2 rounded-full bg-[#ffd67f] shadow-[0_0_16px_rgba(255,214,127,0.95)]"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                <MotionDiv
                  animate={cakeCut ? { x: 56, y: -10, rotate: -8 } : { x: 0, y: 0, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 16, mass: 0.9 }}
                  className="absolute bottom-[7.4rem] right-[3.3rem] h-28 w-20 origin-bottom-left rounded-r-[60%] rounded-tl-[10%] bg-gradient-to-b from-[#ffe7f0] via-[#f7bbd0] to-[#d97497]"
                />
                {cakeCut && !shouldReduceMotion && confetti.map((piece) => (
                  <MotionDiv
                    key={piece.id}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{ x: piece.x, y: piece.y, opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2 h-2 w-2 rounded-sm"
                    style={{ backgroundColor: piece.color, rotate: piece.rotate }}
                  />
                ))}
              </MotionButton>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button onClick={blowCandles} className="min-h-11 rounded-full border border-[#f8d7a3]/70 px-5 py-2.5 text-sm text-[#ffeac4] hover:bg-white/10">Blow the Candles</button>
              <button onClick={cutCake} className="min-h-11 rounded-full bg-[#f7d694] px-5 py-2.5 text-sm font-semibold text-[#2e1940]">Take a Slice</button>
            </div>

            <AnimatePresence>
              {cakeCut && (
                <MotionDiv
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-2xl border border-[#f8d79f]/50 bg-[#331f4f]/60 p-4 text-center text-[#ffebc4]"
                >
                  You just shared a sweet birthday moment with Sohum.
                </MotionDiv>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {wishMade && (
                <MotionDiv
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-2xl bg-[#ffffff18] p-3 text-center text-[#ffe8c3]"
                >
                  A wish has been made ✨
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <MotionDiv layout className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg">
              <h4 className="font-serif text-2xl text-[#ffe6ba]">A little hidden note</h4>
              <p className="mt-3 text-[#f3debf]">Open this when you want a small warm reminder from me.</p>
              <button onClick={() => setEnvelopeOpened((v) => !v)} className="mt-4 min-h-11 rounded-full border border-[#f8d7a3]/70 px-4 py-2 text-sm text-[#ffeecf]">
                {envelopeOpened ? 'Hide Note' : 'Reveal Note'}
              </button>
              <AnimatePresence>
                {envelopeOpened && (
                  <MotionDiv
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden rounded-2xl bg-[#2d1a45]/70 p-4 text-[#ffe8c2]"
                  >
                    Thank you for staying in my life. Thank you for your wishes, your support, and your love.
                  </MotionDiv>
                )}
              </AnimatePresence>
            </MotionDiv>

            <MotionDiv layout className="rounded-3xl border border-[#f6d69c]/50 bg-[#ffffff12] p-5">
              <h4 className="font-serif text-2xl text-[#ffe6ba]">Return Gift Box</h4>
              <p className="mt-2 text-[#f3debf]">A tiny thank-you waiting just for you.</p>
              <button
                onClick={() => {
                  setGiftOpened((v) => !v)
                  playEffect([523, 659])
                }}
                className="mt-3 min-h-11 rounded-full bg-[#f6d69b] px-4 py-2 text-sm font-semibold text-[#2d1940]"
              >
                {giftOpened ? 'Close Gift' : 'Open Gift'}
              </button>
              <AnimatePresence>
                {giftOpened && (
                  <MotionDiv
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 rounded-2xl bg-[#2f1d49]/60 p-4 text-[#ffe8c5]"
                  >
                    A little return gift from my heart 💝 Thank you for making my birthday sweeter.
                  </MotionDiv>
                )}
              </AnimatePresence>
            </MotionDiv>
          </div>
        </section>

        <section id="memories" className="rounded-3xl border border-white/20 bg-[#ffffff12] p-6 backdrop-blur-xl md:p-8">
          <h3 className="text-center font-serif text-3xl text-[#ffe6bc] md:text-4xl">Birthday Memories</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {memories.map((memory, index) => (
              <MotionDiv
                key={memory.title}
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
                className="overflow-hidden rounded-2xl border border-white/25 bg-[#1d1534]/70 shadow-[0_18px_36px_rgba(0,0,0,0.25)]"
              >
                <img src={memory.image} alt={memory.title} loading="lazy" className="h-40 w-full object-cover" />
                <div className="p-4">
                  <h4 className="font-semibold text-[#ffedca]">{memory.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#eed7b4]">{memory.note}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#f8d69e]">Moment {index + 1}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </section>

        <section id="wishes" className="rounded-3xl border border-white/20 bg-[#ffffff12] p-6 backdrop-blur-xl md:p-8">
          <h3 className="text-center font-serif text-3xl text-[#ffe6bc] md:text-4xl">Wish Wall</h3>
          <form onSubmit={submitWish} className="mt-6 grid gap-3 md:grid-cols-[0.8fr_1.8fr_auto]">
            <input
              value={wishAuthorInput}
              onChange={(event) => setWishAuthorInput(event.target.value)}
              placeholder="Your name"
              className="min-h-12 rounded-2xl border border-white/20 bg-[#18122d]/70 px-4 py-3 text-[#ffeecf] outline-none placeholder:text-[#ccb893] focus:border-[#f7d79f]"
            />
            <input
              value={wishInput}
              onChange={(event) => setWishInput(event.target.value)}
              placeholder="Write your birthday wish here..."
              className="min-h-12 rounded-2xl border border-white/20 bg-[#18122d]/70 px-4 py-3 text-[#ffeecf] outline-none placeholder:text-[#ccb893] focus:border-[#f7d79f]"
            />
            <button className="min-h-12 rounded-2xl bg-gradient-to-r from-[#f8d69a] to-[#e8a5cd] px-6 py-3 font-semibold text-[#2a173c]">Send Wish</button>
          </form>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {wishes.map((wish) => (
              <MotionDiv
                key={wish.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/20 bg-[#21153a]/70 p-4 shadow-[0_12px_22px_rgba(0,0,0,0.2)]"
              >
                <p className="text-sm leading-relaxed text-[#ffefcd]">“{wish.text}”</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#f6d79f]">{wish.name}</p>
              </MotionDiv>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#f5d59c]/35 bg-[#ffffff10] p-6 text-center backdrop-blur-xl md:p-9">
          <h3 className="font-serif text-3xl text-[#ffe6bc] md:text-4xl">Thank You</h3>
          <p className="mx-auto mt-4 max-w-3xl text-[#f4debf]">
            Every wish, every message, and every little bit of love made this day more special.
          </p>
          <p className="mx-auto mt-3 max-w-3xl font-serif text-xl text-[#ffe7bd]">
            You were part of my day, and that means more than words can say.
          </p>
          {visitorName && <p className="mt-4 text-[#ffe7bd]">This day feels more special with you here, {visitorName}.</p>}
          <a href="#cake" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[#f6d79f]/70 px-5 py-2.5 text-sm text-[#ffeecf]">Take me back to the cake</a>
        </section>
      </main>

      <AnimatePresence>
        {showMemoryCard && (
          <MotionDiv
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="pointer-events-none fixed bottom-20 right-4 z-20 w-52 rounded-2xl border border-[#f8d7a6]/40 bg-[#fff9ea] p-3 text-[#2f2147] shadow-2xl md:right-8"
          >
            <div className="h-24 rounded-xl bg-[linear-gradient(120deg,#e7bb87,#c989af,#7e72ea)]" />
            <p className="mt-3 text-sm font-semibold">A tiny birthday memory</p>
            <p className="mt-1 text-xs">“Grateful for everyone who made today glow.”</p>
          </MotionDiv>
        )}
      </AnimatePresence>

      {showMemoryChip && (
        <button
          onClick={() => {
            setShowMemoryChip(false)
            setShowMemoryCard(true)
            setTimeout(() => {
              setShowMemoryCard(false)
              setShowMemoryChip(true)
            }, 2800)
          }}
          className="fixed bottom-20 left-4 z-20 min-h-10 rounded-full border border-white/30 bg-white/15 px-4 text-xs text-[#fff2d5] backdrop-blur-lg"
        >
          ✨ Replay memory
        </button>
      )}

      <AnimatePresence>
        {showNameModal && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#06070f]/75 p-4 backdrop-blur-sm"
          >
            <MotionDiv
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-md rounded-3xl border border-white/20 bg-[#120f26]/90 p-6 text-center shadow-2xl"
            >
              <h3 className="font-serif text-3xl text-[#ffe6bc]">Who’s celebrating with me today?</h3>
              <p className="mt-2 text-[#efd8b8]">Share your name and step into this birthday memory.</p>
              <input
                autoFocus
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder="Enter your name"
                className="mt-5 w-full rounded-2xl border border-white/20 bg-[#20163b]/70 px-4 py-3 text-center text-[#ffeecf] outline-none placeholder:text-[#baa888] focus:border-[#f7d79f]"
              />
              <button onClick={enterCelebration} className="mt-4 min-h-12 w-full rounded-2xl bg-gradient-to-r from-[#f8d79c] to-[#e7a4cc] px-5 py-3 font-semibold text-[#2e1b43]">Enter Celebration</button>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
