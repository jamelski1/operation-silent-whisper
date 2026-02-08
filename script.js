/* ================================================
   OPERATION SILENT FREQUENCY
   Navigation & Animation Controller
   ================================================ */

(function () {
  'use strict';

  // --- STATE ---
  const state = {
    currentSection: 0,
    totalSections: 0,
    isTransitioning: false,
    transitionDuration: 600,
    sections: [],
    navDots: [],
  };

  // --- DOM REFERENCES ---
  const counterCurrent = document.querySelector('.current-section');
  const navDotsContainer = document.querySelector('.nav-dots');

  // --- INIT ---
  function init() {
    state.sections = Array.from(document.querySelectorAll('.section'));
    state.navDots = Array.from(document.querySelectorAll('.nav-dot'));
    state.totalSections = state.sections.length;

    bindEvents();
    goToSection(0, true);
  }

  // --- NAVIGATION ---
  function goToSection(index, immediate) {
    if (index < 0 || index >= state.totalSections) return;
    if (!immediate && state.isTransitioning) return;
    if (index === state.currentSection && !immediate) return;

    state.isTransitioning = true;

    const prev = state.sections[state.currentSection];
    const next = state.sections[index];

    // Remove active from all, add exiting to current
    if (!immediate && prev !== next) {
      prev.classList.remove('active');
      prev.classList.add('exiting');
    }

    // Activate new section
    next.classList.remove('exiting');
    next.classList.add('active');

    // Update nav dots
    state.navDots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });

    // Update counter
    counterCurrent.textContent = String(index + 1).padStart(2, '0');

    // Update state
    state.currentSection = index;

    // Clean up after transition
    var duration = immediate ? 0 : state.transitionDuration;
    setTimeout(function () {
      state.sections.forEach(function (s, i) {
        if (i !== index) {
          s.classList.remove('active', 'exiting');
        }
      });
      state.isTransitioning = false;
    }, duration);
  }

  function nextSection() {
    if (state.currentSection < state.totalSections - 1) {
      goToSection(state.currentSection + 1);
    }
  }

  function prevSection() {
    if (state.currentSection > 0) {
      goToSection(state.currentSection - 1);
    }
  }

  // --- PER-VIDEO MUTE TOGGLE ---
  function muteAllVideos() {
    document.querySelectorAll('.photo-frame').forEach(function (frame) {
      var video = frame.querySelector('video');
      var btn = frame.querySelector('.video-mute-btn');
      if (video) video.muted = true;
      if (btn) btn.classList.remove('playing');
    });
  }

  function toggleVideoAudio(frame) {
    var video = frame.querySelector('video');
    var btn = frame.querySelector('.video-mute-btn');
    if (!video || !btn) return;

    if (video.muted) {
      // Unmute this one, mute all others
      muteAllVideos();
      video.muted = false;
      btn.classList.add('playing');
    } else {
      video.muted = true;
      btn.classList.remove('playing');
    }
  }

  document.querySelectorAll('.video-mute-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleVideoAudio(btn.closest('.photo-frame'));
    });
  });

  // --- EVENT BINDING ---
  function bindEvents() {
    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      switch (e.key) {
        case 'm':
          // Toggle audio on the current section's video (if any)
          var currentFrame = state.sections[state.currentSection].querySelector('.photo-frame');
          if (currentFrame && currentFrame.querySelector('video')) {
            toggleVideoAudio(currentFrame);
          }
          return;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          nextSection();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          prevSection();
          break;
        case 'Home':
          e.preventDefault();
          goToSection(0);
          break;
        case 'End':
          e.preventDefault();
          goToSection(state.totalSections - 1);
          break;
      }
    });

    // Mouse wheel navigation
    var wheelThrottle = false;
    document.addEventListener('wheel', function (e) {
      if (wheelThrottle) return;
      wheelThrottle = true;

      // Check if the inner content is scrollable and not at edges
      var inner = state.sections[state.currentSection].querySelector('.section__inner');
      if (inner) {
        var atTop = inner.scrollTop <= 0;
        var atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 5;

        if (e.deltaY > 0 && !atBottom) {
          wheelThrottle = false;
          return; // Let the inner content scroll down
        }
        if (e.deltaY < 0 && !atTop) {
          wheelThrottle = false;
          return; // Let the inner content scroll up
        }
      }

      if (e.deltaY > 0) {
        nextSection();
      } else if (e.deltaY < 0) {
        prevSection();
      }

      setTimeout(function () {
        wheelThrottle = false;
      }, 800);
    }, { passive: true });

    // Nav dot clicks
    state.navDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var target = parseInt(dot.getAttribute('data-section'), 10);
        goToSection(target);
      });
    });

    // Click/tap to advance (only on main content, not on nav dots)
    document.addEventListener('click', function (e) {
      // Ignore clicks on navigation elements or links
      if (e.target.closest('.nav-dots') ||
          e.target.closest('a') ||
          e.target.closest('button')) {
        return;
      }

      // Click right half = next, left half = previous
      var x = e.clientX;
      var width = window.innerWidth;
      if (x > width * 0.65) {
        nextSection();
      } else if (x < width * 0.35) {
        prevSection();
      }
    });

    // Touch swipe support
    var touchStartX = 0;
    var touchStartY = 0;
    var touchStartTime = 0;

    document.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      var deltaX = e.changedTouches[0].clientX - touchStartX;
      var deltaY = e.changedTouches[0].clientY - touchStartY;
      var deltaTime = Date.now() - touchStartTime;

      // Minimum swipe distance and maximum time
      var minDistance = 50;
      var maxTime = 500;

      if (deltaTime > maxTime) return;

      // Determine if horizontal or vertical swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minDistance) {
        // Horizontal swipe
        if (deltaX < 0) {
          nextSection();
        } else {
          prevSection();
        }
      } else if (Math.abs(deltaY) > minDistance) {
        // Vertical swipe
        if (deltaY < 0) {
          nextSection();
        } else {
          prevSection();
        }
      }
    }, { passive: true });
  }

  // --- START ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
