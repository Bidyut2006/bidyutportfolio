// Toggle the mobile navigation menu.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

// Keep the chosen light or dark appearance on every page.
const header = document.querySelector('.site-header');
let themeToggle = document.querySelector('.theme-toggle');

if (!themeToggle && header) {
  themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.type = 'button';
  themeToggle.innerHTML = '<span aria-hidden="true">☾</span>';
  const headerCta = header.querySelector('.top-cta');
  header.insertBefore(themeToggle, headerCta || null);
}

if (themeToggle) {
  const savedTheme = localStorage.getItem('portfolio-theme');
  const useDarkTheme = savedTheme === 'dark';
  document.body.classList.toggle('dark-mode', useDarkTheme);
  themeToggle.setAttribute('aria-pressed', String(useDarkTheme));
  themeToggle.setAttribute('aria-label', useDarkTheme ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.querySelector('span').textContent = useDarkTheme ? '☀' : '☾';

  themeToggle.addEventListener('click', () => {
    const darkModeEnabled = document.body.classList.toggle('dark-mode');
    localStorage.setItem('portfolio-theme', darkModeEnabled ? 'dark' : 'light');
    themeToggle.setAttribute('aria-pressed', String(darkModeEnabled));
    themeToggle.setAttribute('aria-label', darkModeEnabled ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.querySelector('span').textContent = darkModeEnabled ? '☀' : '☾';
  });
}

// Show the visitor's current local time beside the appearance control.
if (header && themeToggle) {
  const headerClock = document.createElement('time');
  headerClock.className = 'header-clock';
  headerClock.setAttribute('aria-label', 'Current local time');
  themeToggle.insertAdjacentElement('afterend', headerClock);

  const updateHeaderClock = () => {
    const now = new Date();
    headerClock.dateTime = now.toISOString();
    headerClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  updateHeaderClock();
  window.setInterval(updateHeaderClock, 1000);
}

function closeMenu() {
  if (!menuButton || !navigation) {
    return;
  }

  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('open');
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('open', !isOpen);
  });

  // Close the menu after a visitor chooses a page or section.
  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Let keyboard users dismiss the menu with Escape.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

// Highlight the navigation link for the section currently in view.
const navigationLinks = document.querySelectorAll('.navigation a[href^="#"]');
const pageSections = Array.from(navigationLinks)
  .map((link) => document.querySelector(link.hash))
  .filter((section) => section !== null);

if ('IntersectionObserver' in window && navigationLinks.length > 0) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navigationLinks.forEach((link) => {
        const isCurrentSection = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', isCurrentSection);

        if (isCurrentSection) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, {
    rootMargin: '-35% 0px -55% 0px',
  });

  pageSections.forEach((section) => sectionObserver.observe(section));
}

// Open a prepared email when the contact form is submitted.
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name')).trim();
    const email = String(formData.get('email')).trim();
    const subject = String(formData.get('subject')).trim();
    const message = String(formData.get('message')).trim();
    const emailSubject = `Portfolio inquiry: ${subject}`;
    const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:bidyutdas98162@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    const formStatus = document.querySelector('.form-status');

    if (formStatus) {
      formStatus.textContent = 'Your email app should open with your message ready to send.';
    }

    const confirmation = document.querySelector('.send-confirmation');
    const confirmationCard = confirmation?.querySelector('.send-confirmation__card');
    if (confirmation) {
      confirmation.classList.add('is-open');
      confirmation.setAttribute('aria-hidden', 'false');
      confirmationCard?.focus();
    }

    window.location.href = mailtoLink;
  });
}

// Cycle through services in a calm, readable typewriter treatment.
const typingText = document.querySelector('[data-typing-phrases]');

if (typingText && !prefersReducedMotion) {
  const phrases = typingText.dataset.typingPhrases.split('|');
  let phraseIndex = 0;
  let characterIndex = phrases[0].length;
  let removing = false;

  const typeNextCharacter = () => {
    const phrase = phrases[phraseIndex];
    typingText.textContent = phrase.slice(0, characterIndex);

    if (!removing && characterIndex === phrase.length) {
      removing = true;
      window.setTimeout(typeNextCharacter, 1500);
      return;
    }

    if (removing && characterIndex === 0) {
      removing = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      window.setTimeout(typeNextCharacter, 260);
      return;
    }

    characterIndex += removing ? -1 : 1;
    window.setTimeout(typeNextCharacter, removing ? 34 : 64);
  };

  window.setTimeout(typeNextCharacter, 1500);
}

// Keep the confirmation panel easy to dismiss with mouse, touch, or keyboard.
const sendConfirmation = document.querySelector('.send-confirmation');

if (sendConfirmation) {
  const closeConfirmation = () => {
    sendConfirmation.classList.remove('is-open');
    sendConfirmation.setAttribute('aria-hidden', 'true');
    contactForm?.querySelector('.send-button')?.focus();
  };

  sendConfirmation.querySelectorAll('[data-close-confirmation]').forEach((control) => {
    control.addEventListener('click', closeConfirmation);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sendConfirmation.classList.contains('is-open')) {
      closeConfirmation();
    }
  });
}

// Reveal cards as they enter the viewport without hiding content in older browsers.
const revealTargets = document.querySelectorAll('.service, .value-card, .contact-card, .follow-card, .project-card, .skill-bars article, .soft-skills article, .tool-list > div');
const prefersReducedMotion = window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
  });

  revealTargets.forEach((element, index) => {
    element.classList.add('scroll-reveal');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 80}ms`);
    revealObserver.observe(element);
  });
}

// Add a small pointer parallax to background shapes on mouse-driven devices.
const canUsePointerParallax = window.matchMedia
  && window.matchMedia('(pointer: fine)').matches
  && !prefersReducedMotion;

if (canUsePointerParallax) {
  const parallaxSections = document.querySelectorAll('.hero, .about-hero, .contact-hero');

  parallaxSections.forEach((section) => {
    const decorations = section.querySelectorAll(
      '.circle, .slash, .blob, .dots, .fine-lines, .contact-shape, .contact-dots, .contact-lines',
    );
    let animationFrame = null;

    section.addEventListener('pointermove', (event) => {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect();
        const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

        decorations.forEach((decoration, index) => {
          const depth = (index + 1) * 2.5;
          decoration.style.setProperty('--pointer-shift-x', `${pointerX * depth}px`);
          decoration.style.setProperty('--pointer-shift-y', `${pointerY * depth}px`);
        });

        animationFrame = null;
      });
    });

    section.addEventListener('pointerleave', () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      decorations.forEach((decoration) => {
        decoration.style.setProperty('--pointer-shift-x', '0px');
        decoration.style.setProperty('--pointer-shift-y', '0px');
      });
    });
  });
}
