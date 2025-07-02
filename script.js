/* ───────────── 1. EVENT DATA ───────────── */
const groups = {
    trip: [
      { name: "Pookie's LKO Return", date: "2025-07-11T16:00:00" },
      { name: "Pookie's Train",      date: "2025-07-22T15:30:00" },
      { name: "Rishi's Train",       date: "2025-07-22T10:35:00" }
    ],
  
    labs: [
      { name: "OOPS", date: "2025-07-02T11:00:00" },
      { name: "MC",   date: "2025-07-04T11:00:00" },
      { name: "SP",   date: "2025-07-05T11:00:00" }
    ],
  
    finals: [
      { name: "Maths", date: "2025-07-09T09:30:00" },
      { name: "SMC",      date: "2025-07-11T09:30:00" },
      { name: "MC",       date: "2025-07-14T09:30:00" },
      { name: "EE",       date: "2025-07-16T09:30:00" },
      { name: "SP",       date: "2025-07-18T09:30:00" },
      { name: "AEC",      date: "2025-07-21T09:30:00" }
    ]
  };
  
  /* ───────────── 2. DOM REFERENCES ───────── */
  const grid        = document.getElementById('tab-content');
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const themeBtns   = document.querySelectorAll('.circle');
  
  const tickSound   = document.getElementById('tick-audio');   // tick.mp3
  const lofiSound   = document.getElementById('lofi-audio');   // streaming url
  
  const soundBtn    = document.getElementById('sound-btn');    // 🔕 / 🔔
  const musicBtn    = document.getElementById('music-btn');    // 🔇 / 🎵
  
  const tickers     = [];   // store refs for each countdown card
  
  /* ───────────── 3. STATE FLAGS ──────────── */
  let soundOn = false;   // tick OFF by default
  let musicOn = false;   // music OFF by default
  
  /* ───────────── 4. BUILD CARDS ──────────── */
  function build(tabKey) {
    grid.innerHTML = '';
    tickers.length = 0;
  
    groups[tabKey].forEach(ev => {
      const card = document.createElement('div');
      card.className = 'card';
  
      // Title
      const title = document.createElement('div');
      title.className = 'event-name';
      title.textContent = ev.name;
  
      // Add readable date
      const dateObj = new Date(ev.date);
      const readable = dateObj.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric'
      });
      const dateLabel = document.createElement('div');
      dateLabel.className = 'event-date';
      dateLabel.textContent = readable;
  
      // Analog clock
      const dial = document.createElement('div');
      dial.className = 'analog';
      const hr = document.createElement('div'); hr.className = 'hand hr';
      const mn = document.createElement('div'); mn.className = 'hand mn';
      const sc = document.createElement('div'); sc.className = 'hand sc';
      dial.append(hr, mn, sc);
  
      // Countdown label
      const left = document.createElement('div');
      left.className = 'time-left';
  
      // Assemble card
      card.append(title, dateLabel, dial, left);
      grid.append(card);
  
      // Store refs
      ev.hr = hr; ev.mn = mn; ev.sc = sc; ev.leftEl = left;
      tickers.push(ev);
    });
  }
 
  /* ───────────── 5. TAB SWITCHING ────────── */
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.tab-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      build(btn.dataset.tab);
    });
  });
  
  /* ───────────── 6. THEME SWITCHING ──────── */
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.circle.active')?.classList.remove('active');
      btn.classList.add('active');
      document.body.className = `theme-${btn.dataset.theme}`;
    });
  });
  
  /* ───────────── 7. ICON TOGGLES ─────────── */
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? '🔔' : '🔕';
  });
  
  musicBtn.addEventListener('click', () => {
    musicOn = !musicOn;
    musicBtn.textContent = musicOn ? '🎵' : '🔇';
    if (musicOn) {
      lofiSound.volume = 0.4;        // pleasant volume
      lofiSound.play().catch(() => {});
    } else {
      lofiSound.pause();
    }
  });
  
  /* ───────────── 8. UTILS ────────────────── */
  const plural = (n, w) => (n === 1 ? `${n} ${w}` : `${n} ${w}s`);
  
  /* ───────────── 9. TICK LOOP ────────────── */
  function tick() {
    const now = new Date();
  
    /* play tick */
    if (soundOn) {
      tickSound.currentTime = 0;
      tickSound.play().catch(() => {});
    }
  
    /* update each countdown card */
    tickers.forEach(ev => {
      // move clock hands
      const s = now.getSeconds(), m = now.getMinutes(), h = now.getHours() % 12;
      ev.sc.style.transform = `translate(-50%,0) rotate(${s * 6}deg)`;
      ev.mn.style.transform = `translate(-50%,0) rotate(${m * 6}deg)`;
      ev.hr.style.transform = `translate(-50%,0) rotate(${h * 30 + m / 2}deg)`;
  
      // update text countdown
      const diff = new Date(ev.date) - now;
      if (diff > 0) {
        const d  = Math.floor(diff / 86_400_000);
        const hr = Math.floor((diff % 86_400_000) / 3_600_000);
        const mn = Math.floor((diff % 3_600_000) / 60_000);
        ev.leftEl.textContent =
          `${plural(d, "day")} ${plural(hr, "hour")} ${plural(mn, "minute")} left`;
      } else {
        ev.leftEl.textContent = 'Done!';
      }
    });
  }
  
  /* ───────────── 10. INIT ────────────────── */
  build('trip');       // default tab on page load
  tick();              // immediate paint
  setInterval(tick, 1000);  // loop every second
  
