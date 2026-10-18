/**
 * ==========================================================================
 * WEDDING INVITATION MASTER CONTROLLER
 * Full feature set: Personalization, RSVP, Guestbook, Countdown, iCal, Lightbox
 * ==========================================================================
 */

// Target Wedding Date (e.g. 24 October 2026 08:00 WIB)
const WEDDING_DATE = new Date('2026-10-24T08:00:00+07:00');

// Initial preloaded wishes for an authentic, lively guestbook
const DEFAULT_WISHES = [
  {
    id: 1,
    name: 'Dimas Prasetyo & Keluarga',
    status: 'hadir',
    message: 'Barakallahu lakuma wa baraka \'alaikuma wa jama\'a bainakuma fii khair. Selamat menempuh hidup baru Arya & Nisa! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin! 🤲✨',
    time: '2 jam yang lalu',
    likes: 8
  },
  {
    id: 2,
    name: 'dr. Farah Anggraini, Sp.PK',
    status: 'hadir',
    message: 'Selamat dr. Nisa dan Mas Arya! Masya Allah seneng banget akhirnya hari bahagia tiba. Lancar sampai hari H yaa dok, ditunggu traktiran dinasnya hehe 💕🌸',
    time: '5 jam yang lalu',
    likes: 12
  },
  {
    id: 3,
    name: 'Keluarga Besar Bpk. H. Rahmat',
    status: 'hadir',
    message: 'Selamat menempuh babak baru untuk Arya & Nisa. Semoga senantiasa dalam limpahan berkah dan kasih sayang Allah SWT.',
    time: '1 hari yang lalu',
    likes: 5
  },
  {
    id: 4,
    name: 'Alumni Teknik Elektro UI 2017',
    status: 'hadir',
    message: 'Happy wedding bro Arya! Selamat menempuh lembaran baru bersama pujaan hati. Semoga langgeng sampai kakek nenek! 🚀🥂',
    time: '1 hari yang lalu',
    likes: 15
  },
  {
    id: 5,
    name: 'Rizky & Amanda',
    status: 'absen',
    message: 'Mohon maaf Mas Arya dan Mbak Nisa kami sedang ada dinas ke luar kota sehingga berhalangan hadir langsung. Doa terbaik untuk kalian berdua dari kami di Bali! 🙏❤️',
    time: '2 hari yang lalu',
    likes: 4
  }
];

class WeddingApp {
  constructor() {
    this.guestName = 'Tamu Undangan';
    this.wishes = [];
    this.currentLightboxIndex = 0;
    this.galleryImages = [
      'assets/images/gallery1.jpg',
      'assets/images/gallery2.jpg',
      'assets/images/gallery3.jpg',
      'assets/images/gallery4.jpg',
      'assets/images/gallery5.jpg',
      'assets/images/gallery6.jpg'
    ];

    this.init();
  }

  init() {
    this.parseGuestParams();
    this.setupEnvelopeOpen();
    this.startCountdown();
    this.setupCalendarActions();
    this.initScrollReveal();
    this.initLightbox();
    this.initGiftTabsAndCopy();
    this.initRSVPAndWishes();
    this.initNavigationDock();
    this.initShareModal();
  }

  // --- 1. Guest Personalization from URL query params ---
  parseGuestParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get('to');
    if (toParam && toParam.trim() !== '') {
      this.guestName = toParam.trim();
    }

    // Update cover and form
    const coverGuestEl = document.getElementById('cover-guest-name');
    if (coverGuestEl) coverGuestEl.textContent = this.guestName;

    const rsvpNameInput = document.getElementById('rsvp-name');
    if (rsvpNameInput && this.guestName !== 'Tamu Undangan') {
      rsvpNameInput.value = this.guestName;
    }
  }

  // --- 2. Open Invitation Envelope ---
  setupEnvelopeOpen() {
    const openBtn = document.getElementById('btn-open-envelope');
    const overlay = document.getElementById('envelope-cover');

    if (openBtn && overlay) {
      openBtn.addEventListener('click', () => {
        // Trigger celebratory confetti
        if (window.launchConfetti) {
          window.launchConfetti({ count: 90, duration: 3500 });
        }

        // Start background music
        if (window.weddingAudio) {
          window.weddingAudio.play();
        }

        // Slide away overlay
        overlay.classList.add('opened');

        // Allow body scroll
        document.body.style.overflow = 'auto';

        // Trigger reveal animations on hero
        setTimeout(() => {
          this.triggerInitialReveals();
        }, 400);
      });
    }
  }

  // --- 3. Live Countdown Timer ---
  startCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = WEDDING_DATE - now;

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // --- 4. Calendar Integration (Google Calendar + iCal .ics file) ---
  setupCalendarActions() {
    const btnGoogle = document.getElementById('btn-google-calendar');
    const btnIcs = document.getElementById('btn-download-ics');

    const title = encodeURIComponent('The Wedding of Arya & Nisa');
    const location = encodeURIComponent('Grand Ballroom Royal Heritage Hotel, Jakarta Selatan');
    const details = encodeURIComponent('Tanpa mengurangi rasa hormat, kami mengundang Anda untuk merayakan momen suci pernikahan Raden Arya Pratama & Siti Nur Annisa.');

    // 2026-10-24 08:00 to 22:00 WIB (UTC: 2026-10-24 01:00 to 15:00)
    const startIso = '20261024T010000Z';
    const endIso = '20261024T150000Z';

    if (btnGoogle) {
      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
      btnGoogle.href = googleCalUrl;
      btnGoogle.target = '_blank';
    }

    if (btnIcs) {
      btnIcs.addEventListener('click', (e) => {
        e.preventDefault();
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//The Wedding of Arya and Nisa//ID',
          'CALSCALE:GREGORIAN',
          'BEGIN:VEVENT',
          'SUMMARY:The Wedding of Arya & Nisa',
          'DESCRIPTION:Pernikahan Raden Arya Pratama & Siti Nur Annisa',
          'LOCATION:Grand Ballroom Royal Heritage Hotel, Jakarta',
          'DTSTART:20261024T010000Z',
          'DTEND:20261024T150000Z',
          'STATUS:CONFIRMED',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'wedding-arya-nisa.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showToast('File kalender (.ics) berhasil diunduh! 📅');
      });
    }
  }

  // --- 5. Scroll Reveals ---
  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });
  }

  triggerInitialReveals() {
    const heroElements = document.querySelectorAll('#hero .reveal-on-scroll');
    heroElements.forEach((el) => el.classList.add('revealed'));
  }

  // --- 6. Gallery Lightbox ---
  initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const btnClose = document.getElementById('lightbox-close');
    const btnPrev = document.getElementById('lightbox-prev');
    const btnNext = document.getElementById('lightbox-next');
    const counterEl = document.getElementById('lightbox-counter');

    if (!modal || !lightboxImg) return;

    const openLightbox = (index) => {
      this.currentLightboxIndex = index;
      lightboxImg.src = this.galleryImages[index];
      if (counterEl) {
        counterEl.textContent = `${index + 1} / ${this.galleryImages.length}`;
      }
      modal.classList.add('open');
    };

    const closeLightbox = () => {
      modal.classList.remove('open');
    };

    document.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index') || '0', 10);
        openLightbox(index);
      });
    });

    if (btnClose) btnClose.addEventListener('click', closeLightbox);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });

    if (btnPrev) {
      btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
        openLightbox(this.currentLightboxIndex);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.galleryImages.length;
        openLightbox(this.currentLightboxIndex);
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') btnPrev && btnPrev.click();
      if (e.key === 'ArrowRight') btnNext && btnNext.click();
    });
  }

  // --- 7. Gift Tabs and Copy Clipboard ---
  initGiftTabsAndCopy() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.gift-tab-btn');
    const tabPanels = document.querySelectorAll('.gift-tab-panel');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach((b) => b.classList.remove('active'));
        tabPanels.forEach((p) => p.style.display = 'none');

        btn.classList.add('active');
        const targetPanel = document.getElementById(`tab-${target}`);
        if (targetPanel) targetPanel.style.display = 'block';
      });
    });

    // Copy Account / Address Buttons
    document.querySelectorAll('.btn-copy').forEach((btn) => {
      btn.addEventListener('click', () => {
        const copyText = btn.getAttribute('data-copy');
        if (!copyText) return;

        navigator.clipboard.writeText(copyText).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span>Tersalin! ✨</span>';
          this.showToast(`Berhasil disalin: ${copyText}`);
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        }).catch(() => {
          this.showToast('Gagal menyalin, silakan salin manual.');
        });
      });
    });
  }

  // --- 8. RSVP & Wishes (Buku Tamu) ---
  initRSVPAndWishes() {
    // Load from localStorage or seed
    const saved = localStorage.getItem('wedding_wishes_arya_nisa');
    if (saved) {
      try {
        this.wishes = JSON.parse(saved);
      } catch (e) {
        this.wishes = [...DEFAULT_WISHES];
      }
    } else {
      this.wishes = [...DEFAULT_WISHES];
      this.saveWishes();
    }

    this.renderWishes();

    // Form submit
    const form = document.getElementById('rsvp-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('rsvp-name');
        const statusInput = form.querySelector('input[name="attendance"]:checked');
        const guestsInput = document.getElementById('rsvp-guests');
        const sessionInput = document.getElementById('rsvp-session');
        const messageInput = document.getElementById('rsvp-message');

        const name = nameInput ? nameInput.value.trim() : '';
        const status = statusInput ? statusInput.value : 'hadir';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name) {
          this.showToast('Mohon masukkan nama Anda.');
          return;
        }

        if (!message) {
          this.showToast('Mohon tuliskan doa atau ucapan restu Anda.');
          return;
        }

        const newWish = {
          id: Date.now(),
          name,
          status,
          message,
          time: 'Baru saja',
          likes: 0
        };

        this.wishes.unshift(newWish);
        this.saveWishes();
        this.renderWishes();

        // Celebration
        if (window.launchConfetti) {
          window.launchConfetti({ count: 70, duration: 2500 });
        }

        this.showToast('Terima kasih! Konfirmasi & ucapan Anda telah tersimpan. 🙏💖');

        // Clear message only
        if (messageInput) messageInput.value = '';
      });
    }
  }

  saveWishes() {
    localStorage.setItem('wedding_wishes_arya_nisa', JSON.stringify(this.wishes));
  }

  renderWishes() {
    const listEl = document.getElementById('wishes-list');
    const totalCountEl = document.getElementById('total-wishes-count');
    const hadirCountEl = document.getElementById('total-hadir-count');

    if (totalCountEl) totalCountEl.textContent = this.wishes.length;

    const hadirTotal = this.wishes.filter((w) => w.status === 'hadir').length;
    if (hadirCountEl) hadirCountEl.textContent = hadirTotal;

    if (!listEl) return;
    listEl.innerHTML = '';

    this.wishes.forEach((wish) => {
      const item = document.createElement('div');
      item.className = 'wish-item';

      let statusBadge = '';
      if (wish.status === 'hadir') {
        statusBadge = '<span class="wish-status-badge badge-hadir">✓ Hadir</span>';
      } else if (wish.status === 'absen') {
        statusBadge = '<span class="wish-status-badge badge-absen">✕ Berhalangan</span>';
      } else {
        statusBadge = '<span class="wish-status-badge badge-ragu">? Masih Ragu</span>';
      }

      item.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${this.escapeHtml(wish.name)}</span>
          ${statusBadge}
        </div>
        <p class="wish-message">${this.escapeHtml(wish.message)}</p>
        <div class="wish-footer">
          <span>${wish.time}</span>
          <button class="btn-like-wish" data-id="${wish.id}">
            <span class="heart-icon">❤️</span>
            <span class="like-count">${wish.likes}</span>
          </button>
        </div>
      `;

      const likeBtn = item.querySelector('.btn-like-wish');
      if (likeBtn) {
        likeBtn.addEventListener('click', () => {
          wish.likes += 1;
          likeBtn.classList.add('liked');
          item.querySelector('.like-count').textContent = wish.likes;
          this.saveWishes();
        });
      }

      listEl.appendChild(item);
    });
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- 9. Navigation Dock with IntersectionObserver ---
  initNavigationDock() {
    const dockLinks = document.querySelectorAll('.dock-item');
    const sections = ['hero', 'couple', 'story', 'events', 'gallery', 'rsvp', 'gift'];

    const sectionElements = sections
      .map((id) => document.getElementById(id))
      .filter((el) => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            dockLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionElements.forEach((sec) => observer.observe(sec));
  }

  // --- 10. Share Modal & Custom Guest Link Generator ---
  initShareModal() {
    const modal = document.getElementById('share-modal');
    const openBtn = document.getElementById('floating-share-btn');
    const closeBtn = document.getElementById('share-close-btn');
    const guestInput = document.getElementById('share-guest-input');
    const previewLinkEl = document.getElementById('share-link-preview');
    const copyLinkBtn = document.getElementById('btn-copy-custom-link');
    const waShareBtn = document.getElementById('btn-share-whatsapp');

    if (!modal) return;

    const updateLinkPreview = () => {
      const name = guestInput.value.trim() || 'Nama Tamu';
      const baseUrl = window.location.origin + window.location.pathname;
      const fullUrl = `${baseUrl}?to=${encodeURIComponent(name)}`;
      if (previewLinkEl) previewLinkEl.value = fullUrl;

      if (waShareBtn) {
        const message = `Halo ${name},\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir pada hari bahagia pernikahan kami:\n\n*Arya & Nisa*\n\nInformasi lengkap dan konfirmasi kehadiran dapat dilihat melalui tautan undangan berikut:\n${fullUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu. Terima kasih. 🙏✨`;
        waShareBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      }
    };

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        modal.classList.add('open');
        updateLinkPreview();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });

    if (guestInput) {
      guestInput.addEventListener('input', updateLinkPreview);
    }

    if (copyLinkBtn && previewLinkEl) {
      copyLinkBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(previewLinkEl.value).then(() => {
          this.showToast('Link undangan kustom berhasil disalin! 🔗');
        });
      });
    }
  }

  // --- Toast Notification Helper ---
  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message toast-enter';
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('toast-enter');
      toast.classList.add('toast-exit');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 3200);
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.weddingApp = new WeddingApp();
});
