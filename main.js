(function () {
  var backdrop = document.getElementById('overlay-backdrop');
  var overlays = document.querySelectorAll('.project-overlay');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var cards = document.querySelectorAll('.card[data-project]');

  var currentImages = [];
  var currentImageIndex = 0;

  // ── Project overlay ──

  function openOverlay(slug) {
    var target = document.getElementById('project-' + slug);
    if (!target) return;
    overlays.forEach(function (o) { o.classList.remove('active'); });
    target.classList.add('active');
    backdrop.classList.add('active');
    document.body.classList.add('no-scroll');
    history.replaceState(null, '', '#' + slug);
  }

  function closeOverlay() {
    backdrop.classList.remove('active');
    overlays.forEach(function (o) { o.classList.remove('active'); });
    document.body.classList.remove('no-scroll');
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      openOverlay(this.dataset.project);
    });
  });

  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) {
      closeOverlay();
    }
  });

  document.querySelector('.overlay-close').addEventListener('click', closeOverlay);

  // ── Lightbox ──

  function openLightbox(images, index) {
    currentImages = images;
    currentImageIndex = index;
    lightboxImg.src = currentImages[currentImageIndex].src;
    lightboxImg.alt = currentImages[currentImageIndex].alt;
    lightbox.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
    if (!backdrop.classList.contains('active')) {
      document.body.classList.remove('no-scroll');
    }
  }

  function showLightboxImage(index) {
    currentImageIndex = index;
    lightboxImg.src = currentImages[currentImageIndex].src;
    lightboxImg.alt = currentImages[currentImageIndex].alt;
  }

  function lightboxPrev() {
    showLightboxImage((currentImageIndex - 1 + currentImages.length) % currentImages.length);
  }

  function lightboxNext() {
    showLightboxImage((currentImageIndex + 1) % currentImages.length);
  }

  // Click on gallery images inside overlays to open lightbox
  backdrop.addEventListener('click', function (e) {
    if (e.target.tagName === 'IMG' && e.target.closest('.gallery')) {
      var gallery = e.target.closest('.gallery');
      var images = Array.from(gallery.querySelectorAll('img'));
      var index = images.indexOf(e.target);
      if (index !== -1) {
        openLightbox(images, index);
      }
    }
  });

  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-prev').addEventListener('click', lightboxPrev);
  document.querySelector('.lightbox-next').addEventListener('click', lightboxNext);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // ── Keyboard handling ──

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (lightbox.classList.contains('active')) {
        closeLightbox();
      } else if (backdrop.classList.contains('active')) {
        closeOverlay();
      }
    }
    if (lightbox.classList.contains('active')) {
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    }
  });

  // ── Hash routing ──

  function checkHash() {
    var hash = window.location.hash.slice(1);
    if (hash) {
      openOverlay(hash);
    }
  }

  checkHash();
  window.addEventListener('hashchange', checkHash);

  // ── Theme toggle ──

  var toggle = document.getElementById('theme-toggle');
  var stored = localStorage.getItem('theme');
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      if (next === 'light') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', next);
      }
      localStorage.setItem('theme', next);
    });
  }
})();
