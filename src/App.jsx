import { useEffect, useState } from 'react'
import './App.css'
import readingPlan from './reading-plan.json'

const fontOptions = [
  { label: 'Serif', value: 'serif', css: 'Georgia, Times New Roman, serif' },
  { label: 'Sans', value: 'sans', css: 'Inter, Segoe UI, Arial, sans-serif' },
]
const themeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Sepia', value: 'sepia' },
]
const fontSizeOptions = [
  { label: 'Small', value: '1.1rem' },
  { label: 'Medium', value: '1.35rem' },
  { label: 'Large', value: '1.7rem' },
]
const paraSpacingOptions = [
  { label: 'Tight', value: 'tight' },
  { label: 'Normal', value: 'normal' },
  { label: 'Spacious', value: 'spacious' },
]
const meditationLengths = [2, 5, 10, 15, 20, 30]

const API_KEY = undefined // Not needed for bible-api.com
const ESV_API_KEY = '77b863b5c32c927d2e959d8c59043f5ac77e0d57'

// Set the start date so that April 17, 2025 is day 254
const startDate = new Date('2024-08-07')
const endDate = new Date(startDate)
endDate.setDate(startDate.getDate() + 3 * 365 - 1) // 3 years from today
const bibleBooks = [
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi',
  'Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'
]
// Use actual chapter counts for each book
const bookChapters = {
  'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34, 'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24, '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36, 'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150, 'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66, 'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14, 'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3, 'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14, 'Malachi': 4,
  'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28, 'Romans': 16, '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6, 'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3, '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13, 'James': 5, '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1, 'Jude': 1, 'Revelation': 22
}
// Generate a 3-year reading plan: ~6 OT/week, 2 NT/week, start OT at 1 Samuel 9, NT in Matthew
const otStart = { book: '1 Samuel', chapter: 9 }
const otBooks = [
  '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'
]
const ntBooks = [
  'Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'
]
const otBookChapters = {
  '1 Samuel': 31, '2 Samuel': 24, '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36, 'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150, 'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66, 'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14, 'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3, 'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14, 'Malachi': 4
}
const ntBookChapters = {
  'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28, 'Romans': 16, '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6, 'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3, '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13, 'James': 5, '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1, 'Jude': 1, 'Revelation': 22
}

function toLocalDateString(dateObj) {
  // Returns YYYY-MM-DD in local time
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function generateCustomReadingPlan() {
  const plan = []
  let otBookIdx = otBooks.indexOf(otStart.book)
  let otChapter = otStart.chapter
  let ntBookIdx = 0
  let ntChapter = 1
  let date = new Date(startDate)
  while (plan.length < 3 * 365) {
    // 3 OT, 1 NT, 3 OT, 1 NT, etc.
    for (let i = 0; i < 3; i++) {
      if (otBookIdx < otBooks.length) {
        plan.push({
          date: toLocalDateString(date),
          book: otBooks[otBookIdx],
          chapter: otChapter,
          testament: 'OT'
        })
        otChapter++
        if (otChapter > otBookChapters[otBooks[otBookIdx]]) {
          otBookIdx++
          otChapter = 1
        }
      }
      date.setDate(date.getDate() + 1)
    }
    if (ntBookIdx < ntBooks.length) {
      plan.push({
        date: toLocalDateString(date),
        book: ntBooks[ntBookIdx],
        chapter: ntChapter,
        testament: 'NT'
      })
      ntChapter++
      if (ntChapter > ntBookChapters[ntBooks[ntBookIdx]]) {
        ntBookIdx++
        ntChapter = 1
      }
    }
    date.setDate(date.getDate() + 1)
    // Stop if both OT and NT are done
    if (otBookIdx >= otBooks.length && ntBookIdx >= ntBooks.length) break
  }
  // Loop the plan to fill 3 years
  let i = 0
  while (plan.length < 3 * 365) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + plan.length)
    plan.push({ ...plan[i], date: toLocalDateString(d) })
    i = (i + 1) % plan.length
  }
  return plan
}
const fullReadingPlan = generateCustomReadingPlan()

function getReadingByDate(dateObj) {
  const dateStr = toLocalDateString(dateObj)
  return fullReadingPlan.find(r => r.date === dateStr)
}

function getPlanDay(date) {
  // Use UTC to avoid timezone issues
  const utc1 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  const utc2 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.round((utc2 - utc1) / msPerDay)
}

function getReadingByPlanDay(planDay) {
  return readingPlan.find(r => r.day === planDay)
}

function App() {
  const [offset, setOffset] = useState(0)
  const [passage, setPassage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showVerseNumbers, setShowVerseNumbers] = useState(true)
  const [originalPassage, setOriginalPassage] = useState('')
  // Use the user's system date for today
  const today = new Date();
  const todayString = today.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  const readingDate = new Date(today)
  readingDate.setDate(today.getDate() + offset)
  const planDay = getPlanDay(readingDate)
  const readingEntry = readingPlan[planDay - 1] // 0-based index
  const dateString = readingDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  const [theme, setTheme] = useState('light')
  const [font, setFont] = useState('serif')
  const [fontSize, setFontSize] = useState('1.35rem')
  const [paraSpacing, setParaSpacing] = useState('normal')
  const [translation, setTranslation] = useState('')
  // Meditation timer
  const [meditation, setMeditation] = useState(meditationLengths[0])
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  // --- Load Preferences Effect ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('userTheme')
    const savedFont = localStorage.getItem('userFont')
    const savedFontSize = localStorage.getItem('userFontSize')
    const savedParaSpacing = localStorage.getItem('userParaSpacing')

    if (savedTheme && themeOptions.some(opt => opt.value === savedTheme)) {
      setTheme(savedTheme)
    }
    if (savedFont && fontOptions.some(opt => opt.value === savedFont)) {
      setFont(savedFont)
    }
    if (savedFontSize && fontSizeOptions.some(opt => opt.value === savedFontSize)) {
      setFontSize(savedFontSize)
    }
    if (savedParaSpacing && paraSpacingOptions.some(opt => opt.value === savedParaSpacing)) {
      setParaSpacing(savedParaSpacing)
    }
    // Indicate loading is complete for preferences (optional, if needed elsewhere)
  }, []) // Empty dependency array means run only once on mount

  // --- Save Preferences Effect ---
  useEffect(() => {
    localStorage.setItem('userTheme', theme)
    localStorage.setItem('userFont', font)
    localStorage.setItem('userFontSize', fontSize)
    localStorage.setItem('userParaSpacing', paraSpacing)
  }, [theme, font, fontSize, paraSpacing]) // Run whenever any of these change

  // Theme visual effect
  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-sepia')
    if (theme === 'dark') document.body.classList.add('theme-dark')
    if (theme === 'sepia') document.body.classList.add('theme-sepia')
  }, [theme])

  // Timer effect
  useEffect(() => {
    if (!timerActive || timer <= 0) return
    const id = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timerActive, timer])

  useEffect(() => {
    if (!readingEntry) return
    setLoading(true)
    setError('')
    // Use ESV API, now with verse numbers included
    fetch(`https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(readingEntry.reading)}&include-passage-references=false&include-verse-numbers=true&include-footnotes=false&include-headings=true`, {
      headers: { 'Authorization': `Token ${ESV_API_KEY}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.passages && data.passages.length > 0) {
          setPassage(data.passages.join('\n'))
          setOriginalPassage(data.passages.join('\n'))
          setShowVerseNumbers(true)
        } else {
          setPassage('')
          setOriginalPassage('')
          setError('No passage found.')
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch passage.')
        setLoading(false)
      })
  }, [readingEntry])

  return (
    <div className={"relax-container" + (timerActive ? " blur-bg" : "") }>
      <div className="relax-header">
        <h1>Bible Reading - 3 Year Cycle</h1>
        <h2>{readingEntry ? `Day ${planDay}` : ''}</h2>
        <h3>Today's Date: {todayString}</h3>
        <h4>{offset === 0 ? "Today's Reading" : `Reading for ${dateString}`}</h4>
      </div>
      <div className="relax-nav">
        <button onClick={() => setOffset(o => o - 1)}>Previous</button>
        <button onClick={() => setOffset(0)} style={{margin: '0 1em'}}>Today</button>
        <button onClick={() => setOffset(o => o + 1)}>Next</button>
      </div>
      {readingEntry ? (
        <div>
          <h3 style={{marginBottom: '0.5em'}}>{readingEntry.reading}</h3>
          <div
            className="relax-scripture"
            style={{
              fontFamily: font === 'serif' ? fontOptions[0].css : fontOptions[1].css,
              fontSize: fontSize,
            }}
            data-paraspacing={paraSpacing}
            dangerouslySetInnerHTML={{
              __html: loading ? '<p>Loading...</p>' :
                (passage ? (() => {
                  // Bold all headings: lines that do not start with [number] and are not empty
                  // Remove extra <br> before/after headings and collapse multiple <br> to one
                  const lines = passage.split(/\r?\n/)
                  const processed = lines.map((line, idx) => {
                    const isHeading = (
                      line.trim() &&
                      !/^[\[]\d+\]/.test(line.trim()) &&
                      !/^\s/.test(line)
                    )
                    if (isHeading) {
                      return `__HEADING__${line}__HEADING__`
                    }
                    // Remove lines that are just quotes or whitespace
                    if (/^"\s*"$/.test(line.trim()) || !line.trim()) {
                      return ''
                    }
                    // Mark poetry lines (indented lines)
                    if (/^\s+/.test(line)) {
                      return `__POETRY__${line}__POETRY__`
                    }
                    return line
                  })
                  // Join with <br>
                  let html = processed.join('<br>')
                  // Replace heading markers with divs, removing <br> before/after
                  html = html.replace(/(<br>)*__HEADING__(.*?)__HEADING__(<br>)*/g, (_, _1, text) => `<div class='esv-heading'>${text}</div>`)
                  // Replace poetry markers with span for poetry
                  html = html.replace(/__POETRY__(.*?)__POETRY__/g, (_, text) => `<span class='esv-poetry'>${text}</span>`)
                  // Collapse 2+ consecutive <br> into one
                  html = html.replace(/(<br>\s*){2,}/g, '<br>')
                  return html
                })() : '')
            }}
          />
        </div>
      ) : (
        <p>No reading for this day.</p>
      )}
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button
          className="share-btn"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${readingEntry.reading} (Day ${planDay})`,
                text: passage.replace(/<[^>]+>/g, ''),
                url: window.location.href
              })
            } else {
              navigator.clipboard.writeText(`${readingEntry.reading} (Day ${planDay})\n${passage.replace(/<[^>]+>/g, '')}`)
              alert('Passage copied to clipboard!')
            }
          }}
        >Share</button>
      </div>
      <div className="relax-meditation">
        <h3>Meditation Timer</h3>
        <div className="meditation-timer-ui">
          <div className="timer-circle">
            <svg width="120" height="120">
              <circle
                cx="60" cy="60" r="54"
                stroke="#b6c9f0" strokeWidth="8" fill="none"
                opacity="0.2"
              />
              <circle
                cx="60" cy="60" r="54"
                stroke="#7b9acc"
                strokeWidth="8"
                fill="none"
                strokeDasharray={339.292}
                strokeDashoffset={timerActive || timer > 0 ? 339.292 - (timer / (meditation * 60)) * 339.292 : 0}
                style={{transition: 'stroke-dashoffset 1s linear'}}
                strokeLinecap="round"
              />
            </svg>
            <div className="timer-display-modern">
              {/* Render nothing at all, ever */}
            </div>
            {timerActive && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(255,255,255,0.0)', // fully transparent overlay
                borderRadius: '50%',
                zIndex: 2,
                pointerEvents: 'none',
              }}></div>
            )}
          </div>
          <div className="timer-controls-modern">
            <button
              className="timer-btn start"
              onClick={() => {
                setTimer(meditation * 60)
                setTimerActive(true)
              }}
              disabled={timerActive}
            >Start</button>
            <button
              className="timer-btn stop"
              onClick={() => {
                setTimerActive(false)
                setTimer(0)
              }}
              disabled={!timerActive}
            >Stop</button>
          </div>
          <div className="timer-length-modern">
            <label>
              Length:
              <select
                value={meditation}
                onChange={e => setMeditation(Number(e.target.value))}
                disabled={timerActive}
              >
                {meditationLengths.map(m => <option key={m} value={m}>{m} min</option>)}
              </select>
            </label>
          </div>
          {timer === 0 && timerActive && (
            <div className="timer-complete-modern">Meditation complete!</div>
          )}
        </div>
      </div>
      <div className="relax-options" style={{marginTop: '2.5em', justifyContent: 'center', minHeight: 80}}>
        <label>
          Font:
          <select value={font} onChange={e => setFont(e.target.value)}>
            {fontOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>
        <label>
          Size:
          <select value={fontSize} onChange={e => setFontSize(e.target.value)}>
            {fontSizeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>
        <label>
          Theme:
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            {themeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>
        <label className="para-spacing">
          Paragraph Spacing:
          <select value={paraSpacing} onChange={e => setParaSpacing(e.target.value)}>
            {paraSpacingOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </label>
        <button
          className="share-btn"
          style={{background: showVerseNumbers ? 'linear-gradient(90deg, #e07b7b 0%, #f7b6b6 100%)' : 'linear-gradient(90deg, #b6c9f0 0%, #7b9acc 100%)', marginLeft: 12, minWidth: 90}}
          onClick={() => {
            if (showVerseNumbers) {
              setPassage(passage => passage.replace(/\[\d+\]/g, ''))
              setShowVerseNumbers(false)
            } else {
              setPassage(originalPassage)
              setShowVerseNumbers(true)
            }
          }}
        >Verse #</button>
      </div>
      <footer style={{textAlign: 'center', color: '#888', fontSize: '0.98em', margin: '2.5em 0 0.5em 0'}}>
        Scripture text from the <a href="https://www.esv.org/" target="_blank" rel="noopener noreferrer" style={{color:'#7b9acc', textDecoration:'underline'}}>English Standard Version (ESV)</a><br/>
        &copy; Crossway, used by permission. All rights reserved.<br/>
        <span style={{fontSize: '0.95em', color: '#b6c9f0'}}>Made with <span style={{color: '#e07b7b', fontWeight: 700}}>&hearts;</span> by <a href="https://davidwicks.site/" target="_blank" rel="noopener noreferrer" style={{color:'#7b9acc', textDecoration:'underline'}}>David Wicks</a></span>
      </footer>
    </div>
  )
}

export default App
