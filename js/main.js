/**
 * Blue Flame Heating & Cooling - Main Logic & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Dynamic Header: Dark matching Banner at Top -> White on Scroll
  const header = document.querySelector('.bf-header');
  if (header) {
    const singleBrandImg = header.querySelector('.bf-brand-img:not(.bf-brand-img-white):not(.bf-brand-img-dark)');
    const updateHeaderScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled) {
        header.classList.add('bf-header--scrolled');
        if (singleBrandImg && singleBrandImg.src.includes('blueflameheatingcooling-white.png')) {
          singleBrandImg.src = singleBrandImg.src.replace('blueflameheatingcooling-white.png', 'blueflameheatingcooling.png');
        }
      } else {
        header.classList.remove('bf-header--scrolled');
        if (singleBrandImg && singleBrandImg.src.includes('blueflameheatingcooling.png') && !singleBrandImg.src.includes('-white')) {
          singleBrandImg.src = singleBrandImg.src.replace('blueflameheatingcooling.png', 'blueflameheatingcooling-white.png');
        }
      }
    };
    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    updateHeaderScroll();
  }

  // 1. Mobile Drawer Toggle
  const mobileToggle = document.getElementById('bfMobileToggle');
  const mobileDrawer = document.getElementById('bfMobileDrawer');
  const mobileClose = document.getElementById('bfMobileClose');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    });

    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 1b. Mobile Drawer Services Accordion
  const drawerAccordions = document.querySelectorAll('.bf-drawer-accordion');
  drawerAccordions.forEach(acc => {
    const btn = acc.querySelector('.bf-drawer-accordion-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        acc.classList.toggle('open');
      });
    }
  });

  // Auto-upgrade flat drawer nav links to accordion if present
  const drawerNav = document.querySelector('.bf-drawer-nav');
  if (drawerNav && !drawerNav.querySelector('.bf-drawer-accordion')) {
    const sublinks = Array.from(drawerNav.querySelectorAll('a[href^="services-"]'));
    const allServicesLink = drawerNav.querySelector('a[href="services.html"]');
    if (sublinks.length > 0 && allServicesLink) {
      const isServiceActive = window.location.pathname.includes('service');
      const accordion = document.createElement('div');
      accordion.className = `bf-drawer-accordion ${isServiceActive ? 'open' : ''}`;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `bf-drawer-accordion-btn ${isServiceActive ? 'active' : ''}`;
      btn.innerHTML = `<span>Services</span><svg class="bf-drawer-accordion-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>`;

      const submenu = document.createElement('div');
      submenu.className = 'bf-drawer-submenu';

      const firstSublink = document.createElement('a');
      firstSublink.href = 'services.html';
      firstSublink.className = `bf-drawer-sublink ${allServicesLink.classList.contains('active') ? 'active' : ''}`;
      firstSublink.textContent = 'All Services Overview';
      submenu.appendChild(firstSublink);

      sublinks.forEach(link => {
        const sub = document.createElement('a');
        sub.href = link.getAttribute('href');
        sub.className = `bf-drawer-sublink ${link.classList.contains('active') ? 'active' : ''}`;
        sub.textContent = link.textContent.replace(/^•\s*/, '').trim();
        submenu.appendChild(sub);
        link.remove();
      });

      accordion.appendChild(btn);
      accordion.appendChild(submenu);
      drawerNav.insertBefore(accordion, allServicesLink);
      allServicesLink.remove();

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        accordion.classList.toggle('open');
      });
    }
  }

  // 2. FAQ Accordion Logic
  const accordionItems = document.querySelectorAll('.bf-accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.bf-accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        accordionItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 3. Direct Click-to-Call Dispatch Action Tracking
  const callButtons = document.querySelectorAll('a[href^="tel:"]');
  callButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Direct dispatch telemetry / visual press feedback
      btn.style.transform = 'scale(0.98)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    });
  });

  // 5. Dual-Role View (Consumer vs Field Technician)
  const roleButtons = document.querySelectorAll('.bf-role-btn');
  const savedRole = localStorage.getItem('hvac_user_role') || 'consumer';

  function applyRole(role) {
    if (role === 'employee' || role === 'technician') {
      document.body.classList.add('role-tech');
    } else {
      document.body.classList.remove('role-tech');
    }
    roleButtons.forEach(btn => {
      if (btn.dataset.role === role) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  applyRole(savedRole);

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetRole = btn.dataset.role;
      localStorage.setItem('hvac_user_role', targetRole);
      applyRole(targetRole);
    });
  });

  // 6. Generic Accordion Support for Inner Pages (.accordion-item)
  const genericAccordions = document.querySelectorAll('.accordion-item');
  genericAccordions.forEach(item => {
    const header = item.querySelector('.accordion-header, .accordion-btn');
    const content = item.querySelector('.accordion-content');
    if (header && content) {
      // Set initial accessibility states
      const isInitiallyActive = item.classList.contains('active');
      header.setAttribute('aria-expanded', isInitiallyActive ? 'true' : 'false');
      if (isInitiallyActive) {
        content.style.maxHeight = content.scrollHeight + 'px';
      }

      header.addEventListener('click', () => {
        const isCurrentlyActive = item.classList.contains('active');
        const wrapper = item.closest('.accordion-wrapper');

        // If data-single-open="true", close all siblings when opening this one
        if (!isCurrentlyActive && wrapper && wrapper.dataset.singleOpen === 'true') {
          wrapper.querySelectorAll('.accordion-item.active').forEach(sibling => {
            sibling.classList.remove('active');
            const sibHeader = sibling.querySelector('.accordion-header, .accordion-btn');
            const sibContent = sibling.querySelector('.accordion-content');
            if (sibHeader) sibHeader.setAttribute('aria-expanded', 'false');
            if (sibContent) sibContent.style.maxHeight = null;
          });
        }

        item.classList.toggle('active');
        const nowActive = item.classList.contains('active');
        header.setAttribute('aria-expanded', nowActive ? 'true' : 'false');
        if (nowActive) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = null;
        }
      });
    }
  });

  // 7. Back-to-Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 8. Interactive HVAC Financing Calculator (financing.html)
  const loanSlider = document.getElementById('loanAmountSlider');
  const loanDisplay = document.getElementById('loanAmountDisplay');
  const termButtons = document.querySelectorAll('#loanTermButtons .term-btn');
  const monthlyDisplay = document.getElementById('monthlyPaymentVal');
  const interestDisplay = document.getElementById('totalInterestVal');
  const termSummary = document.getElementById('loanTermSummary');

  if (loanSlider && monthlyDisplay) {
    let currentTerm = 36;
    let currentApr = 0;

    // Detect initial active term button
    const initialActiveBtn = document.querySelector('#loanTermButtons .term-btn.active');
    if (initialActiveBtn) {
      currentTerm = parseInt(initialActiveBtn.getAttribute('data-term'), 10) || 36;
      currentApr = parseFloat(initialActiveBtn.getAttribute('data-apr')) || 0;
    }

    function recalculateFinancing() {
      const amount = parseFloat(loanSlider.value) || 6500;
      if (loanDisplay) {
        loanDisplay.textContent = '$' + amount.toLocaleString('en-US');
      }

      let monthly = 0;
      let totalInterest = 0;

      if (currentApr === 0) {
        monthly = amount / currentTerm;
        totalInterest = 0;
      } else {
        const monthlyRate = (currentApr / 100) / 12;
        monthly = (amount * monthlyRate * Math.pow(1 + monthlyRate, currentTerm)) / (Math.pow(1 + monthlyRate, currentTerm) - 1);
        totalInterest = (monthly * currentTerm) - amount;
      }

      monthlyDisplay.textContent = '$' + Math.round(monthly) + ' / mo';
      if (interestDisplay) {
        interestDisplay.textContent = '$' + totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      if (termSummary) {
        termSummary.textContent = `${currentTerm}-Month ${currentApr === 0 ? '0% APR' : currentApr + '% APR'} Plan`;
      }
    }

    loanSlider.addEventListener('input', recalculateFinancing);

    termButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        termButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTerm = parseInt(btn.getAttribute('data-term'), 10) || 36;
        currentApr = parseFloat(btn.getAttribute('data-apr')) || 0;
        recalculateFinancing();
      });
    });

    // Run initial calculation
    recalculateFinancing();
  }

  // 9. Contact Page Priority Dispatch & Booking Form (contact.html)
  const contactForm = document.getElementById('contactBookingForm');
  const bookingSuccessBox = document.getElementById('bookingSuccessBox');
  const bookingSubmitBtn = document.getElementById('bookingSubmitBtn');

  if (contactForm && bookingSuccessBox) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (bookingSubmitBtn) {
        bookingSubmitBtn.disabled = true;
        bookingSubmitBtn.innerHTML = `
          <svg class="svg-icon" style="animation: spin 0.8s linear infinite;"><use href="#icon-refresh"></use></svg>
          <span>Submitting Dispatch Ticket...</span>
        `;
      }

      setTimeout(() => {
        contactForm.style.display = 'none';
        bookingSuccessBox.style.display = 'block';
        bookingSuccessBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 650);
    });
  }
});
