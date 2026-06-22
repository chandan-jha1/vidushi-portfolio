/* -------------------------------------------------------------
   Vidushi Jha's Premium Portfolio Interactivity & Animations Script
   Custom theme toggler features and listeners added
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. STICKY HEADER SCROLL STATE
  const header = document.querySelector('.site-header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // check on load

  
  // 2. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Unobserve to keep element visible once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });


  // 3. SKILL BARS FILL & COUNTER ANIMATION
  const skillSection = document.getElementById('skills');
  const skillFills = document.querySelectorAll('.skill-bar-fill');
  const skillVals = document.querySelectorAll('.skill-val');
  let skillsAnimated = false;

  const animateSkills = () => {
    skillFills.forEach((fill, index) => {
      const valEl = skillVals[index];
      const targetPercent = parseInt(valEl.getAttribute('data-target'), 10);
      
      // Animate Bar Fill Width
      fill.style.width = `${targetPercent}%`;

      // Animate Numerical Value counter
      let currentVal = 0;
      const duration = 1200; // ms
      const stepTime = Math.abs(Math.floor(duration / targetPercent));
      
      const timer = setInterval(() => {
        currentVal++;
        valEl.textContent = `${currentVal}%`;
        if (currentVal >= targetPercent) {
          clearInterval(timer);
          valEl.textContent = `${targetPercent}%`;
        }
      }, stepTime);
    });
  };

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !skillsAnimated) {
        animateSkills();
        skillsAnimated = true;
        skillObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.25
  });

  if (skillSection) {
    skillObserver.observe(skillSection);
  }


  // 4. SCROLLSPY NAV LINK ACTIVE STATE
  const sections = document.querySelectorAll('main > section, main > div, #home');
  const navItems = document.querySelectorAll('.nav-item');

  const updateActiveNavLink = () => {
    let scrollPos = window.scrollY + 100; // offset
    
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((item) => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // check on load


  // 5. EMAIL COPY-TO-CLIPBOARD WITH FEEDBACK
  const copyBtn = document.querySelector('.copy-email-btn');
  const statusMsg = document.querySelector('.copy-status-msg');

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email');
      try {
        await navigator.clipboard.writeText(email);
        statusMsg.textContent = 'Email copied to clipboard successfully!';
        statusMsg.style.color = '#10b981'; // Green feedback
        
        // Clear message after delay
        setTimeout(() => {
          statusMsg.textContent = '';
        }, 3000);
      } catch (err) {
        statusMsg.textContent = `Could not copy. Please email directly: ${email}`;
        statusMsg.style.color = '#f59e0b'; // Amber fallback
      }
    });
  }


  // 6. INTERACTIVE CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('portfolio-contact-form');
  const successOverlay = document.getElementById('form-success-overlay');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const submitBtn = contactForm ? contactForm.querySelector('.btn-submit') : null;

  if (contactForm && successOverlay) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate API call state / button spinner
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Message... <span class="submit-spinner"></span>';
      }

      setTimeout(() => {
        // Show success overlay
        successOverlay.classList.add('active');
        
        // Reset form inputs
        contactForm.reset();
        
        // Reset button content
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message <span class="submit-icon">&rarr;</span>';
        }
      }, 1500);
    });

    // Reset Form Success State
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        successOverlay.classList.remove('active');
      });
    }
  }


  // 7. HERO PORTRAIT MOUSE TILT INTERACTION
  const portraitContainer = document.querySelector('.portrait-container');
  const glowRing = document.querySelector('.gradient-glow-ring');
  const floatingBadges = document.querySelectorAll('.floating-badge');

  if (portraitContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    portraitContainer.addEventListener('mousemove', (e) => {
      const rect = portraitContainer.getBoundingClientRect();
      const x = e.clientX - rect.left; // mouse x within element
      const y = e.clientY - rect.top;  // mouse y within element
      
      // Calculate tilt angles based on position relative to center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10; // max 10deg
      const rotateY = ((x - centerX) / centerX) * 10;  // max 10deg
      
      // Apply tilt to photo
      const photo = portraitContainer.querySelector('.profile-photo');
      if (photo) {
        photo.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }

      // Slightly shift glow ring in opposite direction
      if (glowRing) {
        const moveX = ((x - centerX) / centerX) * -15; // max 15px
        const moveY = ((y - centerY) / centerY) * -15; // max 15px
        glowRing.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        glowRing.style.filter = 'blur(18px)';
      }
    });

    portraitContainer.addEventListener('mouseleave', () => {
      // Reset styles
      const photo = portraitContainer.querySelector('.profile-photo');
      if (photo) {
        photo.style.transform = '';
      }
      if (glowRing) {
        glowRing.style.transform = '';
        glowRing.style.filter = '';
      }
    });
  }

  // 8. DARK / LIGHT MODE FEATURE TOGGLE
  const themeToggleBtn = document.getElementById('theme-toggle');
  const moonIcon = themeToggleBtn ? themeToggleBtn.querySelector('.moon-icon') : null;
  const sunIcon = themeToggleBtn ? themeToggleBtn.querySelector('.sun-icon') : null;

  if (themeToggleBtn) {
    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    const setLightTheme = () => {
      document.documentElement.classList.add('light-theme');
      if (moonIcon && sunIcon) {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
      }
      localStorage.setItem('theme', 'light');
    };

    const setDarkTheme = () => {
      document.documentElement.classList.remove('light-theme');
      if (moonIcon && sunIcon) {
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
      }
      localStorage.setItem('theme', 'dark');
    };

    // Initialize Theme
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
      setLightTheme();
    } else {
      setDarkTheme();
    }

    // Toggle Theme Click Event
    themeToggleBtn.addEventListener('click', () => {
      const isLightNow = document.documentElement.classList.contains('light-theme');
      if (isLightNow) {
        setDarkTheme();
      } else {
        setLightTheme();
      }
    });
  }
});
