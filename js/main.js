  AOS.init({ once: true, duration: 800, easing: 'ease-out-cubic' });

  // Kelopak bunga melayang di halaman sampul
  const petalContainer = document.getElementById('petals');
  if (petalContainer) {
    const petalCount = 18;
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = (7 + Math.random() * 6) + 's';
      petal.style.animationDelay = (Math.random() * 8) + 's';
      const size = 6 + Math.random() * 6;
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.background = i % 3 === 0 ? 'var(--gold-light)' : 'var(--gold)';
      petalContainer.appendChild(petal);
    }
  }

  // Guest name from URL (?to= or ?name=) -> populate cover + prefill RSVP name
  const params = new URLSearchParams(window.location.search);
  const guestRaw = params.get('to') || params.get('name') || '';
  if (guestRaw) {
    const guestName = decodeURIComponent(guestRaw.replace(/\+/g, ' ')).trim();
    const guestEl = document.getElementById('guestName');
    if (guestEl) guestEl.textContent = guestName;
    const wNameInput = document.getElementById('wName');
    if (wNameInput && !wNameInput.value) wNameInput.value = guestName;
    document.title = `Undangan — ${guestName} — Ichasan & Nur`;
  }

  const introScreen = document.getElementById('introScreen');
  const introVideo = document.getElementById('introVideo');
  const skipIntro = document.getElementById('skipIntro');
  const cover = document.getElementById('cover');
  const openBtn = document.getElementById('openBtn');
  let introFinished = false;

  function openInvitation() {
    if (!cover || cover.classList.contains('opened')) return;

    setTimeout(() => {
      cover.classList.add('opened');
      document.body.classList.remove('locked');
      setMusicState(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.3 },
        colors: ['#C9A34E', '#E8D5A0', '#5C1327']
      });
    }, 450);

    setTimeout(() => { if (cover) cover.style.display = 'none'; }, 2200);
  }

  function hideIntro() {
    if (!introScreen || introFinished) return;
    introFinished = true;
    introScreen.classList.add('hidden');
  }

  if (introVideo) {
    introVideo.addEventListener('ended', hideIntro);
  }

  if (skipIntro) {
    skipIntro.addEventListener('click', hideIntro);
  }

  if (introScreen) {
    introScreen.addEventListener('click', (event) => {
      if (event.target === introScreen || event.target === introVideo || event.target === skipIntro) {
        hideIntro();
      }
    });
  }

  // Musik latar undangan
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  let musicOn = true;

  function setMusicState(isOn) {
    musicOn = isOn;
    if (!bgMusic) return;
    const icon = musicToggle?.querySelector('i');
    if (icon) {
      icon.className = isOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }
    musicToggle?.classList.toggle('muted', !isOn);

    if (isOn) {
      bgMusic.play().catch(() => {});
    } else {
      bgMusic.pause();
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', () => setMusicState(!musicOn));
  }

  // Open invitation (gapura gate animation)
  if (openBtn) {
    openBtn.addEventListener('click', openInvitation);
  }

  // Countdown timer
  const weddingDate = new Date('2026-10-12T08:00:00+07:00').getTime();
  function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;
    if (diff <= 0) {
      ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => document.getElementById(id).textContent = '00');
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-days').textContent = String(d).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
    document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Toggle tombol konfirmasi kehadiran
  const attendButtons = document.querySelectorAll('.attend-btn');
  const wStatusInput = document.getElementById('wStatus');
  attendButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      attendButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      wStatusInput.value = btn.dataset.value;
    });
  });

  // Simpan ke Google Calendar
  const calendarBtn = document.getElementById('calendarBtn');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const start = '20261012T010000Z'; // 08:00 WIB
      const end = '20261012T070000Z';   // 14:00 WIB
      const title = encodeURIComponent('Pernikahan Ichasan & Nur');
      const details = encodeURIComponent('Akad Nikah & Resepsi Pernikahan Ichasan & Nur');
      const location = encodeURIComponent('Bekasi, Jawa Barat');
      const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
      window.open(url, '_blank');
    });
  }

  // Highlight menu aktif di bottom nav saat scroll
  const navLinks = document.querySelectorAll('.bottom-nav a');
  const navSections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));
  const storySection = document.getElementById('story');
  let storyConfettiFired = false;

  function triggerStoryConfetti() {
    if (!storySection || storyConfettiFired) return;
    const rect = storySection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
      storyConfettiFired = true;
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#C9A34E', '#E8D5A0', '#5C1327', '#F7F0E3']
      });
    }
  }

  window.addEventListener('scroll', () => {
    let current = navSections[0];
    navSections.forEach(sec => {
      if (sec && window.scrollY >= sec.offsetTop - 140) current = sec;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', document.querySelector(a.getAttribute('href')) === current);
    });
    triggerStoryConfetti();
  });

  triggerStoryConfetti();

  // Toggle detail amplop digital (Info)
  document.querySelectorAll('.gift-row-head').forEach(btn => {
    btn.addEventListener('click', () => {
      const detail = document.getElementById(btn.dataset.target);
      const isOpen = detail.classList.contains('open');
      document.querySelectorAll('.gift-row-detail.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) detail.classList.add('open');
    });
  });

  // Copy account number
  function copyAcc(id) {
    const el = document.getElementById(id);
    const text = el.textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
      const btn = el.nextElementSibling;
      const old = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check me-1"></i>Tersalin';
      setTimeout(() => { btn.innerHTML = old; }, 1800);
    });
  }

  // Wishes (localStorage) - tampil otomatis di halaman undangan
  const wishForm = document.getElementById('wishForm');
  const wishList = document.getElementById('wishList');
  const wishEmpty = document.getElementById('wishEmpty');
  const STORAGE_KEY = 'undangan_ichasan_nur_wishes';

  function loadWishes() {
    if (!wishList || !wishEmpty) return;

    let data = [];
    try {
      data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (error) {
      data = [];
    }

    wishList.innerHTML = '';
    if (data.length === 0) {
      wishEmpty.style.display = 'block';
    } else {
      wishEmpty.style.display = 'none';
      data.slice().reverse().forEach(w => {
        const div = document.createElement('div');
        div.className = 'wish-item';
        div.innerHTML = `<div class="wname">${escapeHtml(w.name)} <span class="wstatus">— ${escapeHtml(w.status)}</span></div>
                          <div class="wmsg">${escapeHtml(w.msg)}</div>`;
        wishList.appendChild(div);
      });
    }
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      loadWishes();
    }
  });

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('wName').value.trim();
      const status = document.getElementById('wStatus').value;
      const msg = document.getElementById('wMsg').value.trim();
      if (!name || !msg) return;

      let data = [];
      try {
        data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      } catch (error) {
        data = [];
      }

      data.push({ name, status, msg });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      wishForm.reset();
      attendButtons.forEach(b => b.classList.toggle('active', b.dataset.value === 'Hadir'));
      document.getElementById('wStatus').value = 'Hadir';
      loadWishes();

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A34E', '#E8D5A0']
      });
    });
  }

  loadWishes();

  // Closing confetti
  const confettiBtn = document.getElementById('confettiBtn');
  if (confettiBtn) {
    confettiBtn.addEventListener('click', () => {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#C9A34E', '#E8D5A0', '#5C1327', '#0D3B2E'] });
    });
  }
