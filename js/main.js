/**
 * Exodus Landing Page - Main JavaScript
 * Handles navigation, hero animations, and dynamic content
 */

// ===================================
// CONFIGURATION & CONSTANTS
// ===================================

const CONFIG = {
  WORD_ROTATION_INTERVAL: 3000,
  WORD_FADE_DURATION: 300,
  HERO_WORDS: [
    "WhatsApp Bot",
    "Telegram Bot",
    "Discord Bot",
    "Game Server",
    "AI Agent",
    "Cron Job",
    "Database",
    "Web App/API",
    "Webhook Receiver",
    "Automation Script",
  ],
  HERO_IMAGES: [
    "images/hero-1.png",
    "images/hero-2.png",
    "images/hero-3.png",
    "images/hero-4.png",
  ],
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Get a random integer between 0 and max (exclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number} Random integer
 */
const getRandomInt = (max) => Math.floor(Math.random() * max);

/**
 * Get a random item from an array
 * @param {Array} array - Source array
 * @returns {*} Random item from array
 */
const getRandomItem = (array) => array[getRandomInt(array.length)];

/**
 * Query selector wrapper with error handling
 * @param {string} selector - CSS selector
 * @returns {Element|null} DOM element or null
 */
const $ = (selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`);
  }
  return element;
};

/**
 * Query selector all wrapper
 * @param {string} selector - CSS selector
 * @param {Element} context - Parent element (optional)
 * @returns {NodeList} List of DOM elements
 */
const $$ = (selector, context = document) => context.querySelectorAll(selector);

// ===================================
// NAVIGATION MODULE
// ===================================

const Navigation = (() => {
  let isMenuOpen = false;

  /**
   * Toggle side menu visibility
   */
  const toggleMenu = () => {
    const sideMenu = $("#sideMenu");
    const navCta = $("#navCta");

    if (!sideMenu || !navCta) return;

    isMenuOpen = !isMenuOpen;
    sideMenu.classList.toggle("active", isMenuOpen);
    navCta.classList.toggle("active", isMenuOpen);
    navCta.setAttribute("aria-expanded", isMenuOpen);
  };

  /**
   * Close menu when clicking on links
   */
  const closeMenuOnLinkClick = () => {
    const sideMenu = $("#sideMenu");
    if (!sideMenu) return;

    const links = $$("a", sideMenu);
    links.forEach((link) => {
      link.addEventListener("click", () => {
        if (isMenuOpen) {
          toggleMenu();
        }
      });
    });
  };

  /**
   * Initialize navigation
   */
  const init = () => {
    const navCta = $("#navCta");
    if (!navCta) return;

    navCta.addEventListener("click", toggleMenu);
    closeMenuOnLinkClick();
  };

  return { init };
})();

// ===================================
// WORD ROTATION MODULE
// ===================================

const WordRotation = (() => {
  let currentIndex = 0;
  let intervalId = null;

  /**
   * Update the displayed word with fade effect
   * @param {Element} element - Target element
   * @param {string} newWord - New word to display
   */
  const updateWord = (element, newWord) => {
    element.style.opacity = "0";

    setTimeout(() => {
      element.textContent = newWord;
      element.style.opacity = "1";
    }, CONFIG.WORD_FADE_DURATION);
  };

  /**
   * Rotate to next word in sequence
   * @param {Element} element - Target element
   */
  const rotateNext = (element) => {
    currentIndex = (currentIndex + 1) % CONFIG.HERO_WORDS.length;
    updateWord(element, CONFIG.HERO_WORDS[currentIndex]);
  };

  /**
   * Start word rotation
   */
  const start = () => {
    const rotatingWordElement = $("#rotatingWord");
    if (!rotatingWordElement) return;

    // Set initial random word
    currentIndex = getRandomInt(CONFIG.HERO_WORDS.length);
    rotatingWordElement.textContent = CONFIG.HERO_WORDS[currentIndex];
    rotatingWordElement.style.transition = `opacity ${CONFIG.WORD_FADE_DURATION}ms ease`;

    // Start rotation interval
    intervalId = setInterval(() => {
      rotateNext(rotatingWordElement);
    }, CONFIG.WORD_ROTATION_INTERVAL);
  };

  /**
   * Stop word rotation
   */
  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  return { start, stop };
})();

// ===================================
// HERO IMAGE MODULE
// ===================================

const HeroImage = (() => {
  /**
   * Set a random hero image
   */
  const setRandomImage = () => {
    const heroImgElement = $("#heroImg");
    if (!heroImgElement) return;

    const randomImage = getRandomItem(CONFIG.HERO_IMAGES);
    heroImgElement.src = randomImage;
  };

  /**
   * Initialize hero image
   */
  const init = () => {
    setRandomImage();
  };

  return { init };
})();

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

/**
 * Preload critical images for better performance
 */
const preloadImages = () => {
  CONFIG.HERO_IMAGES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

// ===================================
// APPLICATION INITIALIZATION
// ===================================

/**
 * Initialize all modules when DOM is ready
 */
const initApp = () => {
  try {
    Navigation.init();
    WordRotation.start();
    HeroImage.init();
    preloadImages();
  } catch (error) {
    console.error("Error initializing application:", error);
  }
};

// Wait for DOM to be fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// ===================================
// CLEANUP ON PAGE UNLOAD
// ===================================

window.addEventListener("beforeunload", () => {
  WordRotation.stop();
});
