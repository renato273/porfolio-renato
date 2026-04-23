// ===== META DESIGN SYSTEM - PORTFOLIO JS ===== //

// ===== YEAR =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById("theme-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const preloader = document.getElementById("preloader");

const themeOverlay = document.createElement("div");
themeOverlay.className = "theme-transition-overlay";
document.body.appendChild(themeOverlay);

function getTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) return savedTheme;
  return prefersDarkScheme.matches ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  themeOverlay.classList.add("active");
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
  setTimeout(() => themeOverlay.classList.remove("active"), 260);
}

themeToggle?.addEventListener("click", toggleTheme);
setTheme(getTheme());

prefersDarkScheme.addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    setTheme(e.matches ? "dark" : "light");
  }
});

// ===== NAVIGATION =====
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle?.addEventListener("click", () => {
  navLinks?.classList.toggle("active");
});

// Close nav on link click
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("active");
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const navHeight = document.querySelector(".nav")?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  });
});

// Active nav link on scroll
const navAnchors = document.querySelectorAll(".nav-links a");
const sectionById = Array.from(navAnchors)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      navAnchors.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === id);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
);

sectionById.forEach((section) => sectionObserver.observe(section));

// ===== SCROLL REVEAL =====
function revealSections() {
  const sections = document.querySelectorAll("section");
  const windowHeight = window.innerHeight;
  const revealPoint = 100;

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < windowHeight - revealPoint) {
      section.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);

// Stagger reveal for cards and items
document.querySelectorAll(".project-card, .contact-item, .ref-card, .timeline-item").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 40, 260)}ms`;
});

// ===== BADGES HOVER =====
document.querySelectorAll(".badge").forEach(badge => {
  badge.addEventListener("mouseenter", () => badge.classList.add("active"));
  badge.addEventListener("mouseleave", () => badge.classList.remove("active"));
});

// ===== PROJECT GALLERIES =====
function initProjectGalleries() {
  const projectCards = document.querySelectorAll(".project-card");
  
  projectCards.forEach(card => {
    const gallery = card.querySelector(".gallery-container");
    const images = gallery?.querySelectorAll(".gallery-image");
    const dots = card.querySelectorAll(".dot");
    const prevBtn = card.querySelector(".gallery-btn.prev");
    const nextBtn = card.querySelector(".gallery-btn.next");
    
    if (!images || images.length === 0) return;
    
    let currentIndex = 0;
    let autoSlideInterval;
    
    function showImage(index) {
      if (index >= images.length) index = 0;
      if (index < 0) index = images.length - 1;
      currentIndex = index;
      
      images.forEach((img, i) => {
        img.classList.toggle("active", i === currentIndex);
      });
      
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }
    
    function nextImage() {
      showImage(currentIndex + 1);
    }
    
    function prevImage() {
      showImage(currentIndex - 1);
    }
    
    nextBtn?.addEventListener("click", e => {
      e.stopPropagation();
      nextImage();
      resetAutoSlide();
    });
    
    prevBtn?.addEventListener("click", e => {
      e.stopPropagation();
      prevImage();
      resetAutoSlide();
    });
    
    dots.forEach((dot, i) => {
      dot.addEventListener("click", e => {
        e.stopPropagation();
        showImage(i);
        resetAutoSlide();
      });
    });
    
    function startAutoSlide() {
      autoSlideInterval = setInterval(nextImage, 4000);
    }
    
    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }
    
    card.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
    card.addEventListener("mouseleave", () => startAutoSlide());
    
    startAutoSlide();
    
    images.forEach(img => {
      img.addEventListener("click", () => openLightbox(images, currentIndex));
    });
  });
}

// ===== LIGHTBOX =====
const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox?.querySelector(".lightbox-image");
const lightboxClose = lightbox?.querySelector(".lightbox-close");
const lightboxPrev = lightbox?.querySelector(".lightbox-btn.prev");
const lightboxNext = lightbox?.querySelector(".lightbox-btn.next");

let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(images, index) {
  lightboxImages = Array.from(images).map(img => img.src);
  lightboxIndex = index;
  updateLightboxImage();
  lightbox?.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox?.classList.remove("active");
  document.body.style.overflow = "";
}

function updateLightboxImage() {
  if (lightboxImage && lightboxImages[lightboxIndex]) {
    lightboxImage.src = lightboxImages[lightboxIndex];
  }
}

function lightboxNextImage() {
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  updateLightboxImage();
}

function lightboxPrevImage() {
  lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage();
}

lightboxClose?.addEventListener("click", closeLightbox);
lightboxNext?.addEventListener("click", lightboxNextImage);
lightboxPrev?.addEventListener("click", lightboxPrevImage);

lightbox?.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", e => {
  if (!lightbox?.classList.contains("active")) return;
  
  switch (e.key) {
    case "Escape":
      closeLightbox();
      break;
    case "ArrowRight":
      lightboxNextImage();
      break;
    case "ArrowLeft":
      lightboxPrevImage();
      break;
  }
});

// ===== NAVBAR SCROLL EFFECT =====
const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    nav?.classList.add("scrolled");
  } else {
    nav?.classList.remove("scrolled");
  }
});

// ===== HERO PARALLAX (SUBTLE) =====
const hero = document.querySelector(".hero");
const heroPhoto = document.querySelector(".hero-photo");
const heroTitle = document.querySelector(".hero-text h1");

if (hero) {
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (heroPhoto) {
      heroPhoto.style.transform = `translate(${x * 10}px, ${y * 10}px) scale(1.02)`;
    }
    if (heroTitle) {
      heroTitle.style.transform = `translate(${x * 6}px, ${y * 6}px)`;
    }
  });

  hero.addEventListener("mouseleave", () => {
    if (heroPhoto) heroPhoto.style.transform = "";
    if (heroTitle) heroTitle.style.transform = "";
  });
}

// ===== MAGNETIC BUTTON EFFECT =====
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

// ===== INITIALIZE =====
initProjectGalleries();

// ===== PRELOADER =====
document.body.classList.add("is-loading");
window.addEventListener("load", () => {
  setTimeout(() => {
    preloader?.classList.add("hidden");
    document.body.classList.remove("is-loading");
  }, 650);
});

// ===== CONSOLE MESSAGE =====
console.log(
  "%c👋 ¡Hola! Gracias por visitar mi portafolio.",
  "color: #0064E0; font-size: 16px; font-weight: bold;"
);
console.log(
  "%c¿Interesado en colaborar? ¡Contáctame!",
  "color: #5D6C7B; font-size: 14px;"
);
