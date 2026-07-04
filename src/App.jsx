import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion'
import './App.css'

const MUSIC_SRC = '/wedding-audio.mp3'

const WEDDING_DATE = new Date('2026-07-27T16:30:00')

const GROOM = 'Hafees Rahman'
const BRIDE = 'Jifa Farhana'
const EVENT_DAY = 'Monday'
const EVENT_DATE = '27 July 2026'
const EVENT_TIME = '4:30 PM'
const VENUE_NAME = 'Rhythm Event Galleria'
const VENUE_ADDRESS = 'Pantheeramkavu - Perumanna Road, Puthoormadam, Pantheeramkavu, Kozhikode, Kerala 673019'
const MAPS_LINK = 'https://maps.google.com/?q=11.2360795,75.8691473'
const GCAL_LINK = 'https://calendar.google.com/calendar/r/eventedit?text=Hafees+%26+Jifa+Wedding&dates=20260727T163000/20260727T193000&details=Wedding+Ceremony&location=Rhythm+Event+Galleria,+Kozhikode'

function pad(n) {
  return String(n).padStart(2, '0')
}

function getTimeLeft() {
  const now = new Date()
  const diff = WEDDING_DATE - now
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const mins = Math.floor((diff / (1000 * 60)) % 60)
  const secs = Math.floor((diff / 1000) % 60)
  return { days, hours, mins, secs }
}

function downloadICS() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hafees & Jifa Wedding//EN',
    'BEGIN:VEVENT',
    'DTSTART:20260727T163000',
    'DTEND:20260727T193000',
    `SUMMARY:Hafees & Jifa Wedding`,
    `LOCATION:${VENUE_NAME}, ${VENUE_ADDRESS}`,
    'DESCRIPTION:You are cordially invited to our Wedding ceremony.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'hafees-jifa-wedding.ics'
  a.click()
  URL.revokeObjectURL(url)
}

const PETALS = Array.from({ length: 14 }, (_, i) => i)

function FloatingPetals({ parallaxY }) {
  return (
    <motion.div className="petals" style={{ y: parallaxY }} aria-hidden="true">
      {PETALS.map((i) => (
        <motion.span
          key={i}
          className="petal"
          style={{ left: `${(i * 7.3) % 100}%` }}
          initial={{ y: 40, opacity: 0, rotate: 0 }}
          animate={{ y: -560, opacity: [0, 0.6, 0.6, 0], rotate: 360, x: [0, 16, -10, 0] }}
          transition={{
            duration: 13 + (i % 5) * 3,
            delay: i * 1.4,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {i % 3 === 0 ? '✦' : i % 3 === 1 ? '❀' : '♥'}
        </motion.span>
      ))}
    </motion.div>
  )
}

/* Decorative line-art couple silhouette, gently animated in the background */
function CoupleIllustration() {
  return (
    <motion.svg
      className="couple-art"
      viewBox="0 0 300 220"
      aria-hidden="true"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 0.16, y: 0 }}
      transition={{ duration: 1.6, ease: 'easeOut' }}
    >
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Groom silhouette */}
        <circle cx="110" cy="55" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M70 200 C70 140 90 100 110 100 C130 100 150 140 150 200 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Bride silhouette with hijab drape */}
        <circle cx="190" cy="55" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M162 46 C162 20 218 20 218 46 C224 70 214 90 214 90 L166 90 C166 90 156 70 162 46 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M150 200 C150 140 168 96 190 96 C212 96 230 140 230 200 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Joined hands */}
        <path d="M140 165 Q150 155 160 165" fill="none" stroke="currentColor" strokeWidth="2" />
      </motion.g>
      {/* Floating heart between them */}
      <motion.text
        x="150"
        y="130"
        textAnchor="middle"
        fontSize="16"
        fill="currentColor"
        stroke="none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '150px 125px' }}
      >
        ♥
      </motion.text>
    </motion.svg>
  )
}

function MusicIcon({ playing }) {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      className="music-icon"
      aria-hidden="true"
      animate={{ rotate: playing ? 360 : 0 }}
      transition={playing ? { duration: 3.5, repeat: Infinity, ease: 'linear' } : { duration: 0.4 }}
    >
      <defs>
        <radialGradient id="vinylGradient" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#111111" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#vinylGradient)" stroke="#C9A15A" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="13.5" fill="none" stroke="#3d3d3d" strokeWidth="0.6" />
      <circle cx="20" cy="20" r="9.5" fill="none" stroke="#3d3d3d" strokeWidth="0.6" />
      <circle cx="20" cy="20" r="6.5" fill="#7A1F2B" stroke="#E8D5A8" strokeWidth="1" />
      <circle cx="20" cy="20" r="1.6" fill="#E8D5A8" />
      <circle cx="14" cy="13" r="2.6" fill="#ffffff" opacity="0.18" />
    </motion.svg>
  )
}

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 120 90" className="envelope-svg" aria-hidden="true">
      <defs>
        <linearGradient id="envelopeBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF9" />
          <stop offset="100%" stopColor="#F1E5CE" />
        </linearGradient>
        <linearGradient id="envelopeFlap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF9" />
          <stop offset="100%" stopColor="#F8EFDE" />
        </linearGradient>
        <linearGradient id="sealGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8A2432" />
          <stop offset="100%" stopColor="#5A1620" />
        </linearGradient>
      </defs>
      <rect x="4" y="16" width="112" height="66" rx="10" fill="url(#envelopeBody)" stroke="#C9A15A" strokeWidth="2" />
      <path
        d="M4 22 C4 18 6.5 16 9 16 L111 16 C113.5 16 116 18 116 22 L62 59 C61 60 59 60 58 59 Z"
        fill="url(#envelopeFlap)"
        stroke="#C9A15A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="50" r="15" fill="url(#sealGradient)" stroke="#E8D5A8" strokeWidth="1.5" />
      <text x="60" y="56" textAnchor="middle" fontSize="15" fill="#E8D5A8">♥</text>
    </svg>
  )
}

const SPARKLES = Array.from({ length: 12 }, (_, i) => i)

const cardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
}

const cardItem = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function EnvelopeIntro({ onOpen }) {
  return (
    <motion.div
      className="envelope-intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <motion.div
        className="envelope-bg"
        animate={{ scale: [1.08, 1, 1.08] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="envelope-vignette" />

      <div className="envelope-sparkles" aria-hidden="true">
        {SPARKLES.map((i) => (
          <motion.span
            key={i}
            className="envelope-sparkle"
            style={{ left: `${10 + (i * 8) % 82}%`, top: `${12 + (i * 17) % 76}%` }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4 + (i % 3), repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
          >
            {i % 2 === 0 ? '✦' : '✨'}
          </motion.span>
        ))}
      </div>

      <motion.div className="envelope-card" variants={cardContainer} initial="hidden" animate="visible">
        <motion.div className="envelope-emoji-wrap" variants={cardItem}>
          <motion.div
            className="envelope-glow-ring"
            animate={{ scale: [1, 1.5, 1], opacity: [0.55, 0.1, 0.55] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="envelope-emoji"
            animate={{ y: [0, -10, 0], rotate: [0, -3, 3, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <EnvelopeIcon />
          </motion.div>
        </motion.div>

        <motion.p className="envelope-title" variants={cardItem}>Hafees &amp; Jifa</motion.p>
        <motion.p className="envelope-subtitle" variants={cardItem}>request the pleasure of your company</motion.p>

        <motion.button
          className="envelope-btn"
          variants={cardItem}
          onClick={onOpen}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
        >
          ✦ Open Invitation ✦
        </motion.button>

        <motion.p
          className="envelope-hint"
          variants={cardItem}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Tap to unveil our story ↓
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

const CONFETTI_COLORS = ['#C9A15A', '#7A1F2B', '#E8D5A8', '#ffffff']

function ConfettiBurst({ className }) {
  const pieces = Array.from({ length: 22 }, (_, i) => i)
  return (
    <div className={`confetti-layer ${className}`} aria-hidden="true">
      {pieces.map((i) => {
        const angle = (i / pieces.length) * Math.PI * 2 + (i % 2 ? 0.2 : -0.2)
        const distance = 70 + ((i * 37) % 130)
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance - 20
        return (
          <motion.span
            key={i}
            className="confetti-piece"
            style={{ background: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{ x, y, opacity: 0, scale: 0.3, rotate: 240 }}
            transition={{ duration: 1 + (i % 5) * 0.1, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  const [opened, setOpened] = useState(false)
  const [openBurstId, setOpenBurstId] = useState(0)
  const [btnBurstId, setBtnBurstId] = useState(0)
  const [musicOn, setMusicOn] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    function handleVisibilityChange() {
      if (!audioRef.current || !opened || !musicOn) return
      if (document.hidden) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [opened, musicOn])

  function handleOpen() {
    setOpened(true)
    setOpenBurstId((id) => id + 1)
    audioRef.current?.play().catch(() => {})
  }

  function toggleMusic() {
    if (!audioRef.current) return
    if (musicOn) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setMusicOn((on) => !on)
  }

  function handleAddToCalendar() {
    downloadICS()
    setBtnBurstId((id) => id + 1)
  }

  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 })
  const petalsY = useTransform(smoothProgress, [0, 1], [0, 60])

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} loop />

      <AnimatePresence>
        {!opened && <EnvelopeIntro key="envelope" onOpen={handleOpen} />}
      </AnimatePresence>

      {openBurstId > 0 && <ConfettiBurst key={openBurstId} className="confetti-center" />}

      {opened && (
        <motion.button
          className="music-toggle"
          onClick={toggleMusic}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={musicOn ? 'Pause music' : 'Play music'}
        >
          <MusicIcon playing={musicOn} />
          {!musicOn && <span className="music-mute-slash" />}
        </motion.button>
      )}

      {opened && (
    <motion.div className="invitation" variants={container} initial="hidden" animate="visible">
      <FloatingPetals parallaxY={petalsY} />
      <CoupleIllustration />

      {/* Top ornament */}
      <motion.div className="ornament" variants={item}>✦ ✦ ✦</motion.div>

      {/* Tagline */}
      <motion.p className="tagline" variants={item}>"A love written in the stars,<br />sealed with a prayer"</motion.p>

      {/* Religious opening */}
      <motion.p className="bismillah" variants={item}>
        In the Name of Allah, the Most Gracious,<br />
        the Most Merciful
      </motion.p>

      {/* Together label */}
      <motion.p className="together-label" variants={item}>Together with our families</motion.p>

      {/* Decorative divider */}
      <motion.div className="divider" variants={item}>
        <div className="divider-line" />
        <span className="divider-icon">✦</span>
        <div className="divider-line" />
      </motion.div>

      {/* Groom */}
      <motion.p className="name" variants={item}>{GROOM}</motion.p>
      <motion.p className="name-title" variants={item}>Groom</motion.p>

      {/* Heart */}
      <motion.div
        className="heart-divider"
        variants={item}
        animate={{ scale: [1, 1.22, 1, 1.14, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        ♥
      </motion.div>

      {/* Bride */}
      <motion.p className="name" variants={item}>{BRIDE}</motion.p>
      <motion.p className="name-title" variants={item}>Bride</motion.p>

      {/* Separator */}
      <motion.div className="separator" variants={item} />

      {/* Invite text */}
      <motion.p className="invite-text" variants={item}>
        We joyfully invite you to join us<br />
        as we celebrate the blessed union<br />
        of our <span className="invite-highlight">wedding reception</span>
      </motion.p>

      {/* Event details card */}
      <motion.div
        className="event-card"
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        whileHover={{ y: -4, boxShadow: '0 16px 32px -16px rgba(122,31,43,0.45)' }}
      >
        <div className="event-col">
          <span className="event-col-label">Day</span>
          <span className="event-col-value">{EVENT_DAY}</span>
        </div>
        <div className="event-col-sep" />
        <div className="event-col">
          <span className="event-col-label">Date</span>
          <span className="event-col-value accent">27 July<br />2026</span>
        </div>
        <div className="event-col-sep" />
        <div className="event-col">
          <span className="event-col-label">Time</span>
          <span className="event-col-value">{EVENT_TIME}</span>
        </div>
      </motion.div>

      {/* Venue */}
      <motion.p
        className="venue-name"
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        {VENUE_NAME}
      </motion.p>
      <motion.p
        className="venue-address"
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
          <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 6 3.5a1.5 1.5 0 0 1 0 3z" fill="#c9a15a"/>
        </svg>
        {VENUE_ADDRESS}
      </motion.p>

      {/* Countdown */}
      <motion.p
        className="countdown-label"
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
      >
        ✦ Wedding Countdown ✦
      </motion.p>
      <motion.div
        className="countdown-grid"
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {[
          { num: pad(timeLeft.days), unit: 'Days' },
          { num: pad(timeLeft.hours), unit: 'Hours' },
          { num: pad(timeLeft.mins), unit: 'Mins' },
          { num: pad(timeLeft.secs), unit: 'Secs' },
        ].map(({ num, unit }) => (
          <motion.div
            className="countdown-box"
            key={unit}
            whileHover={{ y: -4, borderColor: '#C9A15A' }}
          >
            <span className="countdown-num-wrap">
              <AnimatePresence mode="popLayout">
                <motion.span
                  className="countdown-num"
                  key={num}
                  initial={{ y: -14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 14, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {num}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="countdown-unit">{unit}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Action buttons */}
      <motion.div
        className="btn-row-wrap"
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        {btnBurstId > 0 && <ConfettiBurst key={btnBurstId} className="confetti-btn" />}
        <div className="btn-row">
          <motion.button
            className="btn btn-primary"
            onClick={handleAddToCalendar}
            whileHover={{ y: -2, boxShadow: '0 10px 20px -10px rgba(122,31,43,0.5)' }}
            whileTap={{ scale: 0.96 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Add to Calendar
          </motion.button>
          <motion.a
            className="btn btn-outline"
            href={MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -2, boxShadow: '0 10px 20px -10px rgba(122,31,43,0.35)' }}
            whileTap={{ scale: 0.96 }}
          >
            <svg width="14" height="14" viewBox="0 0 12 14" fill="none">
              <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 6 3.5a1.5 1.5 0 0 1 0 3z" fill="#7A1F2B"/>
            </svg>
            Get Directions
          </motion.a>
        </div>
      </motion.div>

      <motion.p
        className="footer-note"
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.8 }}
      >
        With love, Hafees & Jifa ♥
      </motion.p>
    </motion.div>
      )}
    </>
  )
}
