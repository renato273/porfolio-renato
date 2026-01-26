// ===== AÑO ACTUAL =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===== TOGGLE DE TEMA (DÍA/NOCHE) =====
const themeToggle = document.getElementById("theme-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Obtener tema guardado o usar preferencia del sistema
function getTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme;
  }
  return prefersDarkScheme.matches ? "dark" : "light";
}

// Aplicar tema
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  
  // Actualizar icono del toggle
  const sunIcon = themeToggle?.querySelector(".sun");
  const moonIcon = themeToggle?.querySelector(".moon");
  
  if (sunIcon && moonIcon) {
    if (theme === "light") {
      sunIcon.style.display = "none";
      moonIcon.style.display = "flex";
    } else {
      sunIcon.style.display = "flex";
      moonIcon.style.display = "none";
    }
  }
}

// Cambiar tema
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
  
  // Animación del botón
  themeToggle?.classList.add("switching");
  setTimeout(() => {
    themeToggle?.classList.remove("switching");
  }, 300);
}

// Event listener para el toggle
themeToggle?.addEventListener("click", toggleTheme);

// Aplicar tema inicial
setTheme(getTheme());

// Escuchar cambios en preferencia del sistema
prefersDarkScheme.addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    setTheme(e.matches ? "dark" : "light");
  }
});

// ===== ANIMACIÓN DE BADGES =====
document.querySelectorAll(".badge").forEach((badge) => {
  badge.addEventListener("mouseenter", () => badge.classList.add("glow"));
  badge.addEventListener("mouseleave", () => badge.classList.remove("glow"));
});

// ===== SCROLL REVEAL - ANIMACIÓN DE SECCIONES =====
function revealSections() {
  const sections = document.querySelectorAll("section");
  const windowHeight = window.innerHeight;
  const revealPoint = 100;

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    
    if (sectionTop < windowHeight - revealPoint) {
      section.classList.add("visible");
    }
  });
}

// Ejecutar al cargar y al hacer scroll
window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);

// ===== EFECTO PARALLAX SUAVE EN HERO =====
const hero = document.querySelector(".hero");
const heroPhoto = document.querySelector(".hero-photo");

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const rate = scrolled * 0.3;
  
  if (hero && scrolled < window.innerHeight) {
    hero.style.backgroundPositionY = `${rate}px`;
  }
});

// ===== ANIMACIÓN DE TYPING EN EL TÍTULO =====
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = "";
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// ===== EFECTO RIPPLE EN BOTONES Y CARDS =====
function createRipple(event) {
  const element = event.currentTarget;
  const ripple = document.createElement("span");
  
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(244, 211, 94, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-effect 0.6s ease-out;
    pointer-events: none;
  `;
  
  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

// Agregar efecto ripple a las secciones
document.querySelectorAll("section").forEach((section) => {
  section.addEventListener("click", createRipple);
});

// ===== ANIMACIÓN DE TIMELINE ITEMS =====
function animateTimeline() {
  const timelineItems = document.querySelectorAll(".timeline-item");
  
  timelineItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-20px)";
    item.style.transition = `all 0.5s ease ${index * 0.1}s`;
  });
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll(".timeline-item");
        items.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateX(0)";
          }, index * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  document.querySelectorAll(".timeline").forEach((timeline) => {
    observer.observe(timeline);
  });
}

animateTimeline();

// ===== SMOOTH SCROLL PARA ENLACES INTERNOS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

// ===== EFECTO DE CURSOR PERSONALIZADO (OPCIONAL) =====
const cursor = document.createElement("div");
cursor.className = "custom-cursor";
cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-outline"></div>';

// Solo activar en pantallas grandes
if (window.innerWidth > 768) {
  document.body.appendChild(cursor);
  
  const cursorDot = cursor.querySelector(".cursor-dot");
  const cursorOutline = cursor.querySelector(".cursor-outline");
  
  // Estilos del cursor
  const cursorStyles = document.createElement("style");
  cursorStyles.textContent = `
    .custom-cursor {
      pointer-events: none;
      position: fixed;
      z-index: 9999;
    }
    .cursor-dot {
      width: 8px;
      height: 8px;
      background: var(--resalte);
      border-radius: 50%;
      position: fixed;
      transform: translate(-50%, -50%);
      transition: transform 0.1s ease;
      z-index: 10000;
    }
    .cursor-outline {
      width: 30px;
      height: 30px;
      border: 2px solid var(--resalte);
      border-radius: 50%;
      position: fixed;
      transform: translate(-50%, -50%);
      transition: all 0.15s ease-out;
      opacity: 0.5;
      z-index: 9999;
    }
    .cursor-hover .cursor-outline {
      width: 50px;
      height: 50px;
      opacity: 0.3;
    }
    .cursor-hover .cursor-dot {
      transform: translate(-50%, -50%) scale(1.5);
    }
    @keyframes ripple-effect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(cursorStyles);
  
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;
  
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });
  
  // Animación suave del outline
  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // Efecto hover en elementos interactivos
  const interactiveElements = document.querySelectorAll("a, button, .badge, section, .ref-card");
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
  });
}

// ===== GALERÍA DE PROYECTOS =====
function initProjectGalleries() {
  const projectCards = document.querySelectorAll(".project-card");
  
  projectCards.forEach((card) => {
    const gallery = card.querySelector(".gallery-container");
    const images = gallery.querySelectorAll(".gallery-image");
    const dots = card.querySelectorAll(".dot");
    const prevBtn = card.querySelector(".gallery-btn.prev");
    const nextBtn = card.querySelector(".gallery-btn.next");
    let currentIndex = 0;
    let autoSlideInterval;
    
    function showImage(index) {
      // Manejar índice circular
      if (index >= images.length) index = 0;
      if (index < 0) index = images.length - 1;
      currentIndex = index;
      
      // Actualizar imágenes
      images.forEach((img, i) => {
        img.classList.toggle("active", i === currentIndex);
      });
      
      // Actualizar dots
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
    
    // Event listeners para botones
    nextBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      nextImage();
      resetAutoSlide();
    });
    
    prevBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      prevImage();
      resetAutoSlide();
    });
    
    // Event listeners para dots
    dots.forEach((dot, i) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        showImage(i);
        resetAutoSlide();
      });
    });
    
    // Auto-slide
    function startAutoSlide() {
      autoSlideInterval = setInterval(nextImage, 4000);
    }
    
    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }
    
    // Pausar auto-slide cuando el mouse está sobre la galería
    card.addEventListener("mouseenter", () => {
      clearInterval(autoSlideInterval);
    });
    
    card.addEventListener("mouseleave", () => {
      startAutoSlide();
    });
    
    // Iniciar auto-slide
    startAutoSlide();
    
    // Click en imagen para abrir lightbox
    images.forEach((img) => {
      img.addEventListener("click", () => {
        openLightbox(images, currentIndex);
      });
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

// Event listeners del lightbox
lightboxClose?.addEventListener("click", closeLightbox);
lightboxNext?.addEventListener("click", lightboxNextImage);
lightboxPrev?.addEventListener("click", lightboxPrevImage);

// Cerrar lightbox con click fuera de la imagen
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Cerrar lightbox con tecla Escape, navegar con flechas
document.addEventListener("keydown", (e) => {
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

// Inicializar galerías
initProjectGalleries();

// ===== MENSAJE EN CONSOLA =====
console.log(
  "%c¡Hola! 👋 Gracias por visitar mi portafolio.",
  "color: #f4d35e; font-size: 16px; font-weight: bold;"
);
console.log(
  "%c¿Interesado en colaborar? ¡Contáctame!",
  "color: #cdd7f0; font-size: 14px;"
);
