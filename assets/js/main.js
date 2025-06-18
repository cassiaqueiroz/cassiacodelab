(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') &&
      !selectHeader.classList.contains('sticky-top') &&
      !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100
      ? selectBody.classList.add('scrolled')
      : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Nav menu links: smooth scroll for hashes + close mobile + active class.
   * External links open normally.
   */
  document.querySelectorAll('#navmenu a').forEach(link => {
    link.addEventListener('click', function (event) {
      const href = this.getAttribute('href');

      // Fecha o menu mobile em qualquer clique
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }

      if (href.startsWith('#')) {
        // Navegação interna
        event.preventDefault();
        // Atualiza classe active
        document.querySelectorAll('#navmenu .active').forEach(el => el.classList.remove('active'));
        this.classList.add('active');
        // Scroll suave
        const target = document.getElementById(href.slice(1));
        if (target) {
          window.scrollTo({ top: target.offsetTop - 50, behavior: 'smooth' });
        }
      }
      // Links externos: abre normalmente (use target="_blank" no HTML)
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add('active')
        : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll (AOS)
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Countdown timer
   */
  function updateCountDown(countDownItem) {
    const timeleft = new Date(countDownItem.getAttribute('data-count')).getTime()
      - new Date().getTime();
    const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    countDownItem.querySelector('.count-days').innerHTML = days;
    countDownItem.querySelector('.count-hours').innerHTML = hours;
    countDownItem.querySelector('.count-minutes').innerHTML = minutes;
    countDownItem.querySelector('.count-seconds').innerHTML = seconds;
  }

  document.querySelectorAll('.countdown').forEach(item => {
    updateCountDown(item);
    setInterval(() => updateCountDown(item), 1000);
  });

  /**
   * Initiate glightbox
   */
  GLightbox({ selector: '.glightbox' });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(isotopeItem => {
    let layout = isotopeItem.getAttribute('data-layout') || 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') || '*';
    let sort = isotopeItem.getAttribute('data-sort') || 'original-order';
    let initIsotope;

    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(btn => {
      btn.addEventListener('click', function () {
        isotopeItem.querySelector('.filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({ filter: this.getAttribute('data-filter') });
        aosInit();
      });
    });
  });

  /**
   * Easy selector helper
   */
  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  };

  /**
   * Hero type effect
   */
  const typedEl = select('.typed');
  if (typedEl) {
    let strings = typedEl.getAttribute('data-typed-items').split(',');
    new Typed('.typed', {
      strings: strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 40,
      backDelay: 2000
    });
  }

  /**
   * Highlight nav links on scroll
   */
  document.addEventListener("DOMContentLoaded", () => {
    const navLinks = select("#navmenu a", true);
    const sections = select("section", true);

    function removeActive() {
      navLinks.forEach(n => n.classList.remove('active'));
    }

    function highlightOnScroll() {
      let pos = window.scrollY + 300;
      sections.forEach(section => {
        if (pos >= section.offsetTop && pos < section.offsetTop + section.offsetHeight) {
          removeActive();
          const active = select(`#navmenu a[href="#${section.id}"]`);
          if (active) active.classList.add('active');
        }
      });
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        removeActive();
        const last = sections[sections.length - 1];
        const lastLink = select(`#navmenu a[href="#${last.id}"]`);
        lastLink ?? lastLink.classList.add('active');
      }
    }

    window.addEventListener('scroll', highlightOnScroll);
    highlightOnScroll();
  });

})();
