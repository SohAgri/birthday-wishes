import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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
  },
  {
    title: 'Midnight Sparkles',
    note: 'A night filled with warm wishes, music, and shared laughter.',
  },
  {
    title: 'Soft Celebration',
    note: 'Another year of strength, love, and unforgettable stories.',
  },
]

const MotionDiv = motion.div
const MotionButton = motion.button
const MotionHeading = motion.h1
const MotionAside = motion.aside
const MotionArticle = motion.article
const MotionParagraph = motion.p
const MotionSpan = motion.span

function App() {
  const [nameInput, setNameInput] = useState('')
  const [visitorName, setVisitorName] = useState('')
  const [showNameModal, setShowNameModal] = useState(true)
  const [cakeCut, setCakeCut] = useState(false)
  const [candlesLit, setCandlesLit] = useState(true)
  const [wishMade, setWishMade] = useState(false)
  const [giftOpened, setGiftOpened] = useState(false)
  const [envelopeOpened, setEnvelopeOpened] = useState(false)
  const [wishInput, setWishInput] = useState('')
  const [wishes, setWishes] = useState(seedWishes)
  const [wishStars, setWishStars] = useState([])
  const [musicOn, setMusicOn] = useState(false)
  const [showMemoryCard, setShowMemoryCard] = useState(false)
  const [confetti] = useState(() =>
    Array.from({ length: 18 }, (_, id) => ({
      id,
      x: (Math.random() - 0.5) * 240,
      y: -40 - Math.random() * 140,
      rotate: Math.random() * 360,
      color: ['#f8d66d', '#f8a6c9', '#f5f2e8', '#f7b267'][id % 4],
    })),
  )
  const audioContextRef = useRef(null)
  const ambientNodesRef = useRef([])

  useEffect(() => {
    const timer = setTimeout(() => setShowMemoryCard(true), 6500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (musicOn) {
      const ctx = audioContextRef.current ?? new window.AudioContext()
      audioContextRef.current = ctx
      const gain = ctx.createGain()
      gain.gain.value = 0.03
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
    } else if (ambientNodesRef.current.length) {
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
    setVisitorName(nameInput.trim() || 'Friend')
    setShowNameModal(false)
  }

  const cutCake = () => {
    if (cakeCut) return
    setCakeCut(true)
    playEffect([392, 523, 659])
  }

  const blowCandles = () => {
    if (!candlesLit) return
    setCandlesLit(false)
    setWishMade(true)
    playEffect([330, 262])
    setTimeout(() => setWishMade(false), 2600)
  }

  const submitWish = (event) => {
    event.preventDefault()
    if (!wishInput.trim()) return
    const nextWish = {
      id: Date.now(),
      name: visitorName || 'Guest',
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
          animate={{ opacity: [0.35, 0.95, 0.4], scale: [0.6, 1.3, 0.9] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          className="pointer-events-none fixed rounded-full bg-[#ffe9ac] shadow-[0_0_18px_rgba(255,233,172,0.9)]"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
        />
      ))}

      <header className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-24 text-center">
        <p className="mb-3 text-sm tracking-[0.3em] text-[#f6d788]">15 APRIL • BIRTHDAY CELEBRATION</p>
        <MotionHeading
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-5xl leading-tight md:text-7xl"
        >
          Sohum
        </MotionHeading>
        <h2 className="mt-4 max-w-2xl text-2xl font-semibold text-[#fff4de] md:text-4xl">Welcome to My Birthday Celebration</h2>
        <p className="mt-5 max-w-2xl text-base text-[#f2ddc8] md:text-lg">
          Thank you for showing up for me. This little space is made with love so we can celebrate together, no matter how far we are.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#welcome" className="rounded-full border border-[#f7d9a6]/50 bg-white/10 px-5 py-2.5 text-sm backdrop-blur-md transition hover:bg-white/20">Celebrate With Me</a>
          <a href="#cake" className="rounded-full bg-gradient-to-r from-[#f6c88f] to-[#e49bc9] px-5 py-2.5 text-sm font-semibold text-[#321d42] shadow-[0_10px_35px_rgba(246,200,143,0.45)]">Cut the Cake</a>
          <a href="#wishes" className="rounded-full border border-[#f6d788]/60 px-5 py-2.5 text-sm text-[#f6e8cf] transition hover:bg-white/10">Leave a Wish</a>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 md:px-8">
        <section id="welcome" className="rounded-3xl border border-white/20 bg-white/10 p-7 text-center shadow-2xl backdrop-blur-xl md:p-10">
          <p className="text-xl leading-relaxed text-[#fff0dc] md:text-2xl">
            “Thank you for being here on my special day. Even if you’re far away, your presence and wishes mean a lot to me. So I made this little space where we can celebrate together.”
          </p>
          <p className="mt-4 text-sm text-[#f7deb8]">Cut a slice of cake, leave a wish, and be part of my birthday.</p>
          {visitorName && <p className="mt-5 text-base text-[#ffdcae]">I’m so happy you’re celebrating with me, {visitorName}.</p>}
        </section>

        <section id="cake" className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/20 bg-[#ffffff12] p-6 shadow-[0_20px_60px_rgba(9,10,29,0.45)] backdrop-blur-xl md:p-8">
            <h3 className="text-center font-serif text-3xl text-[#ffe7be]">Cut the Celebration Cake</h3>
            <p className="mt-3 text-center text-[#f6debf]">Tap the cake to cut a slice and claim your sweet return gift.</p>
            <div className="mt-8 flex justify-center">
              <MotionButton
                onClick={cutCake}
                whileHover={{ scale: 1.02 }}
                className="relative h-72 w-72 cursor-pointer border-0 bg-transparent p-0"
                aria-label="Cut birthday cake"
              >
                <div className="absolute bottom-2 left-1/2 h-8 w-56 -translate-x-1/2 rounded-full bg-black/40 blur-md" />
                <div className="absolute bottom-10 left-1/2 h-36 w-60 -translate-x-1/2 rounded-[40%] bg-gradient-to-b from-[#ffedf7] via-[#f5b8cb] to-[#d77ca0] shadow-[inset_0_10px_15px_rgba(255,255,255,0.45)]" />
                <div className="absolute bottom-[9.8rem] left-1/2 h-20 w-48 -translate-x-1/2 rounded-[38%] bg-gradient-to-b from-[#fff7eb] via-[#fbe8ce] to-[#f4cb97]" />
                {[0, 1, 2].map((candle) => (
                  <div key={candle} className="absolute bottom-[13.6rem] left-1/2 h-12 w-3 -translate-x-1/2 rounded-full bg-[#fef6ea]" style={{ marginLeft: `${(candle - 1) * 34}px` }}>
                    <AnimatePresence>
                      {candlesLit && (
                        <MotionSpan
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{
                            opacity: [0.7, 1, 0.7],
                            scale: [0.85, 1.1, 0.9],
                          }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY }}
                          className="absolute -top-5 left-1/2 h-5 w-3 -translate-x-1/2 rounded-full bg-[#ffd67f] shadow-[0_0_16px_rgba(255,214,127,0.95)]"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                <MotionDiv
                  animate={cakeCut ? { x: 58, y: -10, rotate: -9 } : { x: 0, y: 0, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 140, damping: 14 }}
                  className="absolute bottom-[7.4rem] right-[3.3rem] h-28 w-20 origin-bottom-left rounded-r-[60%] rounded-tl-[10%] bg-gradient-to-b from-[#ffe7f0] via-[#f7bbd0] to-[#d97497]"
                />
                {cakeCut && confetti.map((piece) => (
                  <MotionSpan
                    key={piece.id}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{ x: piece.x, y: piece.y, opacity: 0 }}
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2 h-2 w-2 rounded-sm"
                    style={{ backgroundColor: piece.color, rotate: piece.rotate }}
                  />
                ))}
              </MotionButton>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button onClick={blowCandles} className="rounded-full border border-[#f8d7a3]/70 px-4 py-2 text-sm text-[#ffeac4] hover:bg-white/10">Blow the Candles</button>
              <button onClick={cutCake} className="rounded-full bg-[#f7d694] px-4 py-2 text-sm font-semibold text-[#2e1940]">Take a Slice</button>
            </div>

            <AnimatePresence>
              {cakeCut && (
                <MotionDiv
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-2xl border border-[#f8d79f]/50 bg-[#331f4f]/60 p-4 text-center text-[#ffebc4]"
                >
                  You took a slice of my birthday cake 🍰 • Thank you for celebrating with me.
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
            <AnimatePresence>
              {cakeCut && (
                <MotionArticle
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg"
                >
                  <h4 className="font-serif text-2xl text-[#ffe6ba]">A little hidden note</h4>
                  <p className="mt-3 text-[#f3debf]">Your presence is my real gift. Distance may keep us apart, but today you’re here with me. This little moment means a lot to me.</p>
                </MotionArticle>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {cakeCut && (
                <MotionArticle
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-[#f6d69c]/50 bg-[#ffffff12] p-5"
                >
                  <h4 className="font-serif text-2xl text-[#ffe6ba]">Return Gift Box</h4>
                  <button onClick={() => {
                    setGiftOpened((v) => !v)
                    playEffect([523, 659])
                  }} className="mt-3 rounded-full bg-[#f6d69b] px-4 py-2 text-sm font-semibold text-[#2d1940]">{giftOpened ? 'Close Gift' : 'Open Gift'}</button>
                  <AnimatePresence>
                    {giftOpened && (
                      <MotionParagraph
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 rounded-2xl bg-[#2f1d49]/60 p-3 text-[#ffe8c5]"
                      >
                        A little return gift from my heart 💝 Thank you for making my birthday sweeter.
                      </MotionParagraph>
                    )}
                  </AnimatePresence>
                </MotionArticle>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <h3 className="font-serif text-3xl text-[#ffe5bc]">Secret Envelope</h3>
            <p className="mt-2 text-[#f4debd]">Find this tiny hidden treasure and open a personal note.</p>
            <button onClick={() => {
              setEnvelopeOpened((v) => !v)
              playEffect([392, 494])
            }} className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#f8d7a2]/70 bg-[#ffffff20] text-lg shadow-[0_0_24px_rgba(248,215,162,0.45)]">✉</button>
            <AnimatePresence>
              {envelopeOpened && (
                <MotionParagraph
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-2xl bg-[#2d1a45]/70 p-3 text-[#ffe8c2]"
                >
                  Thank you for staying in my life. Thank you for your wishes, your support, and your love.
                </MotionParagraph>
              )}
            </AnimatePresence>
          </article>

          <article className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <h3 className="font-serif text-3xl text-[#ffe5bc]">Music</h3>
            <p className="mt-2 text-[#f4debd]">Turn on gentle ambient tones while you explore.</p>
            <button onClick={() => setMusicOn((v) => !v)} className="mt-5 rounded-full border border-[#f8d7a2]/70 px-5 py-2.5 text-sm text-[#fff0d2] hover:bg-white/10">
              {musicOn ? 'Mute ambiance' : 'Play ambiance'}
            </button>
          </article>
        </section>

        <section id="memories" className="rounded-3xl border border-white/20 bg-[#ffffff12] p-6 backdrop-blur-xl md:p-8">
          <h3 className="text-center font-serif text-3xl text-[#ffe6bc]">Birthday Memories</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {memories.map((memory, index) => (
              <MotionArticle key={memory.title} whileHover={{ y: -4, scale: 1.01 }} className="overflow-hidden rounded-2xl border border-white/25 bg-[#1d1534]/70">
                <div className="h-40 bg-[linear-gradient(120deg,#f4c98f,#d88bb5,#8f7ff8)] opacity-90" />
                <div className="p-4">
                  <h4 className="font-semibold text-[#ffedca]">{memory.title}</h4>
                  <p className="mt-2 text-sm text-[#eed7b4]">{memory.note}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#f8d69e]">Moment {index + 1}</p>
                </div>
              </MotionArticle>
            ))}
          </div>
        </section>

        <section id="wishes" className="rounded-3xl border border-white/20 bg-[#ffffff12] p-6 backdrop-blur-xl md:p-8">
          <h3 className="text-center font-serif text-3xl text-[#ffe6bc]">Wish Wall</h3>
          <form onSubmit={submitWish} className="mt-6 flex flex-col gap-3 md:flex-row">
            <input
              value={wishInput}
              onChange={(event) => setWishInput(event.target.value)}
              placeholder="Write your birthday wish here..."
              className="flex-1 rounded-2xl border border-white/20 bg-[#18122d]/70 px-4 py-3 text-[#ffeecf] outline-none placeholder:text-[#ccb893] focus:border-[#f7d79f]"
            />
            <button className="rounded-2xl bg-gradient-to-r from-[#f8d69a] to-[#e8a5cd] px-6 py-3 font-semibold text-[#2a173c]">Send Wish</button>
          </form>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {wishes.map((wish) => (
              <MotionArticle key={wish.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/20 bg-[#21153a]/70 p-4">
                <p className="text-sm text-[#ffefcd]">“{wish.text}”</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#f6d79f]">{wish.name}</p>
              </MotionArticle>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#f5d59c]/35 bg-[#ffffff10] p-6 text-center backdrop-blur-xl md:p-9">
          <h3 className="font-serif text-3xl text-[#ffe6bc]">Thank You</h3>
          <p className="mx-auto mt-4 max-w-3xl text-[#f4debf]">
            Every wish, every message, and every little bit of love made this day more special. Thank you for being part of my birthday and turning this celebration into a memory I will always hold close.
          </p>
          {visitorName && <p className="mt-4 text-[#ffe7bd]">This day feels more special with you here, {visitorName}.</p>}
        </section>
      </main>

      <AnimatePresence>
        {showMemoryCard && (
          <MotionAside
            initial={{ opacity: 0, y: 26, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            className="fixed bottom-5 right-4 z-30 w-56 rounded-2xl border border-[#f8d7a6]/40 bg-[#fff9ea] p-3 text-[#2f2147] shadow-2xl"
          >
            <div className="h-28 rounded-xl bg-[linear-gradient(120deg,#e7bb87,#c989af,#7e72ea)]" />
            <p className="mt-3 text-sm font-semibold">A tiny birthday memory</p>
            <p className="mt-1 text-xs">&quot;Grateful for everyone who made today glow.&quot;</p>
          </MotionAside>
        )}
      </AnimatePresence>

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
              <h3 className="font-serif text-3xl text-[#ffe6bc]">Before we celebrate...</h3>
              <p className="mt-2 text-[#efd8b8]">Let me know who’s here with me today.</p>
              <input
                autoFocus
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder="Enter your name"
                className="mt-5 w-full rounded-2xl border border-white/20 bg-[#20163b]/70 px-4 py-3 text-center text-[#ffeecf] outline-none placeholder:text-[#baa888] focus:border-[#f7d79f]"
              />
              <button onClick={enterCelebration} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#f8d79c] to-[#e7a4cc] px-5 py-3 font-semibold text-[#2e1b43]">Enter Celebration</button>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
