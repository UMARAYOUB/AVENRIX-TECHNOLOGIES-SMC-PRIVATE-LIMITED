document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. STICKY NAVBAR SCROLL EVENT
  // ==========================================================================
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Set Active Link in Navbar based on current pathname
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ==========================================================================
  // 2. MOBILE MENU DRAWER TOGGLE
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================================================
  // 3. INTERSECTION OBSERVER FOR SCROLL REVEAL
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================================================
  // 4. STAT STATISTICS COUNTER ANIMATION
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateStats = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const stepTime = Math.max(Math.floor(duration / target), 15);
    let current = 0;
    const increment = target > 500 ? Math.ceil(target / (duration / stepTime)) : 1;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = current + suffix;
      }
    }, stepTime);
  };

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => animateStats(num));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    statsObserver.observe(statsSection);
  }

  // ==========================================================================
  // 5. FAQ ACCORDION EXPANSION
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');
    
    if (header && body) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-body').style.maxHeight = '0';
          }
        });

        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
  });

  // ==========================================================================
  // 6. PORTFOLIO CAROUSEL SLIDER (HOME PAGE)
  // ==========================================================================
  const track = document.querySelector('.portfolio-slider-track');
  const prevBtn = document.querySelector('.portfolio-btn.prev');
  const nextBtn = document.querySelector('.portfolio-btn.next');

  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const items = document.querySelectorAll('.portfolio-slider .portfolio-item');
    const itemsCount = items.length;
    
    const updateSlider = () => {
      const isMobile = window.innerWidth <= 480;
      const isTablet = window.innerWidth <= 768 && window.innerWidth > 480;
      
      let itemsPerView = 3;
      if (isMobile) itemsPerView = 1;
      else if (isTablet) itemsPerView = 2;
      
      const maxIndex = Math.max(0, itemsCount - itemsPerView);
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      
      const itemWidth = items[0].getBoundingClientRect().width;
      const gap = 32;
      const offset = currentIndex * (itemWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
      
      prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
      prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
      nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
      nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
    };

    nextBtn.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 480;
      const isTablet = window.innerWidth <= 768 && window.innerWidth > 480;
      let itemsPerView = 3;
      if (isMobile) itemsPerView = 1;
      else if (isTablet) itemsPerView = 2;
      
      if (currentIndex < itemsCount - itemsPerView) {
        currentIndex++;
        updateSlider();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    window.addEventListener('resize', updateSlider);
    updateSlider();
  }

  // ==========================================================================
  // 7. PORTFOLIO FILTER TABS (PORTFOLIO PAGE)
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioGridItems = document.querySelectorAll('.portfolio-grid .portfolio-item');

  if (filterBtns.length && portfolioGridItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        portfolioGridItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = '';
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.opacity = '1';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================================================
  // 8. TECH STACK TABS (SERVICES PAGE)
  // ==========================================================================
  const techTabs = document.querySelectorAll('.tech-tab');
  const techGrids = document.querySelectorAll('.tech-grid');

  if (techTabs.length && techGrids.length) {
    techTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        techTabs.forEach(t => t.classList.remove('active'));
        techGrids.forEach(g => g.classList.remove('active'));
        
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-target');
        const targetGrid = document.getElementById(targetId);
        if (targetGrid) {
          targetGrid.classList.add('active');
        }
      });
    });
  }

  // ==========================================================================
  // 9. CONTACT FORM VALIDATION
  // ==========================================================================
  const contactForm = document.getElementById('avenrix-contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message-text').value.trim();

      if (!name || !email || !phone || !subject || !message) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Please fill out all required fields.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Please provide a valid email address.';
        return;
      }

      const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(phone)) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Please provide a valid phone number.';
        return;
      }

      formMessage.className = 'form-message success';
      formMessage.textContent = 'Thank you! Your message has been sent successfully. An AVENRIX expert will reach out to you shortly.';
      contactForm.reset();
    });
  }

  // ==========================================================================
  // 10. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==========================================================================
  // 11. HERO PARTICLE CANVAS ANIMATION
  // ==========================================================================
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;
    let mouseX = 0;
    let mouseY = 0;

    const resizeCanvas = () => {
      const heroSection = canvas.parentElement;
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Subtle mouse attraction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          this.x += dx * 0.0005;
          this.y += dy * 0.0005;
        }

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Pulse opacity
        this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.currentOpacity})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update(time);
        p.draw();
      });

      drawConnections();
      animFrameId = requestAnimationFrame(animate);
    };

    // Mouse tracking for interactive particles
    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    resizeCanvas();
    initParticles();
    animate(0);

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
  }

  // ==========================================================================
  // 12. CARD TILT EFFECT (3D Hover)
  // ==========================================================================
  const tiltCards = document.querySelectorAll('.card');
  
  if (window.innerWidth > 768) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // ==========================================================================
  // 13. TYPED TEXT EFFECT FOR HERO TAGLINE
  // ==========================================================================
  const heroTag = document.querySelector('.hero-tag');
  if (heroTag) {
    const originalText = heroTag.textContent.trim();
    // Remove the span (green dot) text content and get just the tagline
    const spans = heroTag.querySelectorAll('span');
    const textNode = Array.from(heroTag.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0);
    
    if (textNode) {
      const fullText = textNode.textContent.trim();
      textNode.textContent = '';
      let charIndex = 0;
      
      const typeWriter = () => {
        if (charIndex < fullText.length) {
          textNode.textContent += fullText.charAt(charIndex);
          charIndex++;
          setTimeout(typeWriter, 50);
        }
      };

      // Start typing when hero becomes visible
      const heroObserver = new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
          setTimeout(typeWriter, 500);
          obs.unobserve(entries[0].target);
        }
      }, { threshold: 0.5 });

      heroObserver.observe(heroTag);
    }
  }

  // ==========================================================================
  // 14. PARALLAX SCROLL FOR FLOATING ELEMENTS
  // ==========================================================================
  const floatingCards = document.querySelectorAll('.hero-floating-card, .hero-floating-card-2');
  
  if (floatingCards.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      floatingCards.forEach((card, index) => {
        const speed = index === 0 ? 0.03 : -0.02;
        card.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }

});
