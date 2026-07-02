import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const WEDDING_DATE = new Date('2026-07-27T16:30:00')

const GROOM = 'Hafees Rahman'
const BRIDE = 'Jifa Farhana'
const EVENT_DAY = 'Sunday'
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

function FloatingPetals() {
  return (
    <div className="petals" aria-hidden="true">
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
    </div>
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

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div className="invitation" variants={container} initial="hidden" animate="visible">
      <FloatingPetals />
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
        of our wedding ceremony
      </motion.p>

      {/* Event details card */}
      <motion.div
        className="event-card"
        variants={item}
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
      <motion.p className="venue-name" variants={item}>{VENUE_NAME}</motion.p>
      <motion.p className="venue-address" variants={item}>
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
          <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 6 3.5a1.5 1.5 0 0 1 0 3z" fill="#c9a15a"/>
        </svg>
        {VENUE_ADDRESS}
      </motion.p>

      {/* Countdown */}
      <motion.p className="countdown-label" variants={item}>✦ Wedding Countdown ✦</motion.p>
      <motion.div className="countdown-grid" variants={item}>
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
      <motion.div className="btn-row" variants={item}>
        <motion.button
          className="btn btn-primary"
          onClick={downloadICS}
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
      </motion.div>

      <motion.p className="footer-note" variants={item}>With love, Hafees & Jifa ♥</motion.p>
    </motion.div>
  )
}
