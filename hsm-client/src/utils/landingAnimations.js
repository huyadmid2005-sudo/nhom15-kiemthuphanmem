// Landing Page Animation Utilities

// Check browser support for background-clip: text
const detectBackgroundClipSupport = () => {
  const testElement = document.createElement("div");
  testElement.style.backgroundClip = "text";
  testElement.style.webkitBackgroundClip = "text";

  const supportsBackgroundClip =
    testElement.style.backgroundClip === "text" ||
    testElement.style.webkitBackgroundClip === "text";

  // Add fallback class if browser doesn't support background-clip: text
  if (!supportsBackgroundClip) {
    document.documentElement.classList.add("no-backgroundcliptext");
  }

  return supportsBackgroundClip;
};

// Initialize browser feature detection
export const initFeatureDetection = () => {
  detectBackgroundClipSupport();
};

// Intersection Observer for scroll animations
export const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");

        // Handle stat counters
        if (entry.target.classList.contains("stat-number")) {
          animateCounter(entry.target);
        }

        // Stagger animation for children
        if (entry.target.classList.contains("stagger-children")) {
          const children = entry.target.querySelectorAll(".stagger-child");
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("animate-in");
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  const animatableElements = document.querySelectorAll(
    [
      ".stat-item",
      ".service-card",
      ".feature-item",
      ".contact-item",
      ".form-group",
      ".footer-section",
      ".hero-content",
      ".hero-image",
      ".section-header",
    ].join(", ")
  );

  animatableElements.forEach((el) => {
    observer.observe(el);
  });
};

// Counter animation for statistics
export const animateCounter = (element) => {
  const target = parseInt(element.textContent.replace(/[^\d.]/g, ""));
  const hasDecimal = element.textContent.includes(".");
  const suffix = element.textContent.replace(/[\d.]/g, "");
  let current = 0;
  const increment = target / 100;
  const duration = 2000; // 2 seconds
  const stepTime = duration / 100;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    let displayValue = hasDecimal ? current.toFixed(1) : Math.floor(current);
    element.textContent = displayValue + suffix;
  }, stepTime);
};

// Smooth scroll with easing
export const smoothScrollTo = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const targetPosition = element.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 800;
  let start = null;

  const animation = (currentTime) => {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  const easeInOutCubic = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  };

  requestAnimationFrame(animation);
};

// Parallax effect for hero section
export const initParallaxEffect = () => {
  const hero = document.querySelector(".hero");
  const heroCard = document.querySelector(".hero-card");

  if (!hero || !heroCard) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const cardRate = scrolled * 0.2;

    hero.style.transform = `translateY(${rate}px)`;
    heroCard.style.transform = `translateY(${cardRate}px) rotate(5deg)`;
  });
};

// Magnetic cursor effect for buttons
export const initMagneticEffect = () => {
  const magneticElements = document.querySelectorAll(
    ".btn-primary, .btn-secondary, .service-card, .stat-item"
  );

  magneticElements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "translate(0, 0)";
    });
  });
};

// Initialize all animations
export const initAllAnimations = () => {
  // Wait for DOM to be fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initFeatureDetection();
      initScrollAnimations();
      initParallaxEffect();
      initMagneticEffect();
    });
  } else {
    initFeatureDetection();
    initScrollAnimations();
    initParallaxEffect();
    initMagneticEffect();
  }
};

// Typing animation for hero title
export const initTypingAnimation = (elementSelector, text, speed = 100) => {
  const element = document.querySelector(elementSelector);
  if (!element) return;

  let i = 0;
  element.innerHTML = "";

  const typeWriter = () => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  };

  setTimeout(typeWriter, 500); // Start after 500ms delay
};

// Floating animation trigger
export const triggerFloatingAnimation = (elementSelector) => {
  const element = document.querySelector(elementSelector);
  if (element) {
    element.style.animation = "floating 6s ease-in-out infinite";
  }
};

// Page load animation sequence
export const initPageLoadSequence = () => {
  const timeline = [
    { selector: ".header", delay: 0 },
    { selector: ".hero-content", delay: 200 },
    { selector: ".hero-image", delay: 400 },
    { selector: ".stats", delay: 600 },
  ];

  timeline.forEach(({ selector, delay }) => {
    setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add("animate-in");
      }
    }, delay);
  });
};
