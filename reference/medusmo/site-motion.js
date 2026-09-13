$(window).on("beforeunload", function () {
  $("body").hide();
  $(window).scrollTop(0);
});

// Register GSAP plugins and custom easing functions
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, ScrollToPlugin);
CustomEase.create("loader", "0.83, 0, 0.17, 1");
CustomEase.create("loader2", "0.77, 0, 0.175, 1");
CustomEase.create("contact1", "0.89, 0, 0.15, 0.99");

// Common Code for All Resolutions
function loadCommonCode() {
  document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with the class .home-steps2_dropdown
    const dropdowns = document.querySelectorAll(".home-steps2_dropdown");

    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", () => {
        // Check if the clicked dropdown already has the .is-open class
        if (dropdown.classList.contains("is-open")) return;

        // Remove the .is-open class from any currently open dropdown
        dropdowns.forEach((d) => d.classList.remove("is-open"));

        // Add the .is-open class to the clicked dropdown
        dropdown.classList.add("is-open");
      });
    });

    // KK: Programmatically click the first dropdown if it exists
    if (dropdowns.length > 0) {
      dropdowns[0].click();
    }
  });

  let isScrolling = false;
  // Select the video element by its id
  const video = document.getElementById("heroVideo");

  // Contact form open and close animations
  let contactFormOpen;

  function contactFormOpenAnimation() {
    const contactFormWrapper = document.querySelector(
      ".contact-modal_main-wrapper"
    );
    const contactForm = document.querySelector(
      ".contact-modal_content-wrapper"
    );
    const contactOverlay = document.querySelector(
      ".contact-modal_overlay-shadow"
    );
    const contactCursorOverlay = document.querySelector(
      ".contact_modal-cursor-trigger"
    );

    const contactModalImg = document.querySelector(".contact-modal_img");
    const contactModalScrollWrapper = document.querySelector(
      ".contact-modal_scroll-wrapper"
    );

    if (
      !contactFormWrapper ||
      !contactForm ||
      !contactModalImg ||
      !contactModalScrollWrapper
    ) {
      console.error("Modal elements not found");
      return;
    }

    contactFormOpen = gsap.timeline({ paused: true });

    contactFormOpen
      // Animate contactFormWrapper from 0% width to 100%
      .fromTo(
        contactFormWrapper,
        { width: "0%" }, // Starting point
        {
          width: "100%", // Ending point
          duration: 1.2,
          ease: "contact1",
        }
      )
      // Animate contactForm from 0% width to 100%
      .fromTo(
        contactForm,
        { width: "0%" }, // Starting point
        {
          width: "100%", // Ending point
          duration: 1.2,
          ease: "contact1",
        },
        "-=1.2" // Overlap with the previous animation
      )
      // Animate contactForm from 0% width to 100%
      .fromTo(
        contactOverlay,
        { opacity: "0%" }, // Starting point
        {
          opacity: "100%", // Ending point
          duration: 0.2,
          ease: "in",
        },
        "-=1.2" // Overlap with the previous animation
      )

      // Animate contactModalImg opacity from 0 to 1
      .fromTo(
        contactModalImg,
        { opacity: 0 }, // Starting point
        {
          opacity: 1, // Ending point
          duration: 0.6,
          delay: 0, // Delay for 1 second
        }
      )
      // Animate contactForm from 0% width to 100%
      .fromTo(
        contactCursorOverlay,
        { autoAlpha: 0 }, // Starting point
        {
          autoAlpha: 1, // Ending point
          duration: 0.1,
          ease: "in",
        },
        "-=0.6" // Overlap with the previous animation
      )
      // Animate contactModalScrollWrapper opacity from 0 to 1
      .fromTo(
        contactModalScrollWrapper,
        { opacity: 0 }, // Starting point
        {
          opacity: 1, // Ending point
          duration: 0.6,
          delay: 0.1, // Delay for 1 second
        },
        "<" // Starts at the same time as the contactModalImg animation
      );
  }

  function openContactModal() {
    if (contactFormOpen) {
      contactFormOpen.play();
      document.body.classList.add("is-scroll-offs");
      lenis.stop();
    } else {
      console.error("Contact form animation not initialized");
    }
  }

  function closeContactModal() {
    if (contactFormOpen) {
      contactFormOpen.timeScale(1).reverse();
      document.body.classList.remove("is-scroll-offs");
      lenis.start();
    } else {
      console.error("Contact form animation not initialized");
    }
  }

  // Close modal on ESC key
  function closeContactModalOnEsc() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeContactModal();
      }
    });
  }

  // Initialize animations and event listeners
  document.addEventListener("DOMContentLoaded", () => {
    contactFormOpenAnimation();
    closeContactModalOnEsc();

    const closeButton = document.querySelector(".contact-modal_close-button");
    const overlay = document.querySelector(".contact-modal_overlay");
    const openButtons = document.querySelectorAll(".is-open-contact");

    if (closeButton) {
      closeButton.addEventListener("click", closeContactModal);
    } else {
      console.error("Close button not found");
    }

    if (overlay) {
      overlay.addEventListener("click", closeContactModal);
    } else {
      console.error("Overlay not found");
    }

    if (openButtons.length > 0) {
      openButtons.forEach((button) => {
        button.addEventListener("click", openContactModal);
      });
    } else {
      console.error("No buttons with the class .is-open-contact found");
    }
  });

  // Hero move to reveal footer
  function revealFooter() {
    const footer = document.querySelector(".is-footer-2");
    if (footer) {
      gsap.to("#heroSection", {
        scrollTrigger: {
          trigger: "#bottomWrapper",
          start: "top bottom",
          toggleActions: "restart none none reverse",
        },
        autoAlpha: 0,
      });
    }
  }
  // Call the function to activate the animation
  revealFooter();

  gsap.registerPlugin(ScrollTrigger);

  // Custom cursor text change function
  window.customCursorText = function (e) {
    e.addEventListener("mouseenter", () => {
      const wideCursorTextValue = e.getAttribute("wideCursorText");
      const customCursorTextElement = document.querySelector(
        ".custom_cursor_text"
      );
      if (customCursorTextElement) {
        customCursorTextElement.innerHTML = wideCursorTextValue;
      }
    });

    e.addEventListener("mouseleave", () => {
      const customCursorTextElement = document.querySelector(
        ".custom_cursor_text"
      );
      if (customCursorTextElement) {
        customCursorTextElement.innerHTML = ""; // Clear text on mouse leave
      }
    });
  };

  // Initialize custom cursor text on all elements with wideCursorText attribute
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[wideCursorText]").forEach((element) => {
      window.customCursorText(element);
    });
  });

  // Initial settings to avoid flash before animations start
  gsap.set("#heroOverlay", { opacity: 0 });
  gsap.set("#heroBgImage", { scale: 1 });

  gsap.to("#heroOverlay", {
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      trigger: "#heroOverlayTrigger",
      start: "top bottom", // Animation starts when #heroOverlayTrigger hits bottom of viewport
      end: "top top", // Animation ends when #heroOverlayTrigger reaches top of viewport
      scrub: true, // Smooth scroll-tied animation
    },
  });

  gsap.to("#heroBgImage", {
    scale: 1.1,
    ease: "none",
    scrollTrigger: {
      trigger: "#heroOverlayTrigger",
      start: "top bottom",
      end: "top top",
      scrub: true,
    },
  });

  // Initialize Lenis for smooth scrolling
  let lenis;

  if (
    typeof Webflow !== "undefined" &&
    typeof Webflow.env === "function" &&
    Webflow.env("editor") === undefined
  ) {
    lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.7,
      gestureOrientation: "vertical",
      normalizeWheel: false,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } else {
    console.warn(
      "Webflow environment not detected or Webflow.env is not a function."
    );
  }

  // Function to stop Lenis and save scroll position
  function stopLenisScroll() {
    savedScrollPos = lenis.scroll; // Capture current scroll position
    lenis.stop();
    window.scrollTo(0, savedScrollPos); // Apply saved position to prevent jump
  }

  // Function to start Lenis and reset position if necessary
  function startLenisScroll() {
    lenis.start();
    lenis.scrollTo(savedScrollPos, { immediate: true }); // Smooth scroll to saved position
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Check if the screen width is greater than 991px
    if (window.innerWidth > 991) {
      // Stop Lenis scrolling
      stopLenisScroll();

      // Restart Lenis after 6.7 seconds
      setTimeout(function () {
        startLenisScroll();
        // Scroll page 100px down with custom easing
        scrollPageDown();
      }, 6700);
    }
  });

  // Event listeners for start/stop toggle elements
  $("[data-lenis-start]").on("click", function () {
    startLenisScroll();
  });

  $("[data-lenis-stop]").on("click", function () {
    stopLenisScroll();
  });

  $("[data-lenis-toggle]").on("click", function () {
    $(this).toggleClass("stop-scroll");
    if ($(this).hasClass("stop-scroll")) {
      stopLenisScroll();
    } else {
      startLenisScroll();
    }
  });

  function animateElementInView(element, options = {}) {
    if (!element) {
      console.error("animateElementInView: Target element not found.");
      return;
    }

    const {
      x = "10%",
      opacity = 0,
      start = "top bottom",
      end = "bottom bottom-=25%",
      scrub = 1,
      once = true,
      ease = "linear",
    } = options;

    gsap.fromTo(
      element,
      { opacity: 0, x: x },
      {
        opacity: 1,
        x: "0%",
        ease: ease,
        scrollTrigger: {
          trigger: element,
          start: start,
          end: end,
          scrub: scrub,
          toggleActions: once
            ? "play none none none"
            : "restart none none none",
        },
      }
    );
  }

  function initializeSwiper() {
    const sliders = document.querySelectorAll(".is-slider-inview");

    sliders.forEach((slider, index) => {
      const swiperElement = slider.querySelector(".swiper");
      if (!swiperElement) {
        console.warn(`Swiper element not found in slider #${index}`);
        return;
      }

      console.log(`Initializing Swiper for slider #${index}`, slider);

      const loopMode = slider.getAttribute("loop-mode") === "true";
      const sliderDuration =
        parseInt(slider.getAttribute("slider-duration"), 10) || 300;

      const swiper = new Swiper(swiperElement, {
        speed: sliderDuration,
        loop: loopMode,
        autoHeight: false,
        followFinger: true,
        freeMode: false,
        slideToClickedSlide: false,
        slidesPerView: "auto",
        rewind: false,
        mousewheel: { forceToAxis: true },
        breakpoints: {
          0: { spaceBetween: 16, slidesPerView: "auto" }, // Mobile
          992: { spaceBetween: 16, slidesPerView: "auto" }, // Desktop
        },
      });

      swiper.on("init", () => {
        console.log(`Swiper #${index} initialized`);
        animateElementInView(slider);
      });

      swiper.init();
    });
  }

  // Main logic
  window.onload = () => {
    console.log("Window loaded. Initializing...");
    initializeSwiper();
    // Initialize custom cursor
  };
  document.addEventListener("DOMContentLoaded", function () {
    // Function to shuffle elements
    function shuffleSlides(sliderElement) {
      const wrapper = sliderElement.querySelector(".swiper-wrapper");
      const slides = Array.from(wrapper.children); // Get all slide elements as an array
      for (let i = slides.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index
        [slides[i], slides[j]] = [slides[j], slides[i]]; // Swap slides
      }
      slides.forEach((slide) => wrapper.appendChild(slide)); // Append in shuffled order
    }

    document
      .querySelectorAll(".is-slider-inview-2")
      .forEach(function (sliderElement, index) {
        let loopMode = false;
        if (sliderElement.getAttribute("loop-mode") === "true") {
          loopMode = true;
        }
        let sliderDuration = 300;
        if (sliderElement.getAttribute("slider-duration") !== null) {
          sliderDuration = +sliderElement.getAttribute("slider-duration");
        }

        // Shuffle slides before Swiper initialization
        shuffleSlides(sliderElement);

        const swiper = new Swiper(sliderElement.querySelector(".swiper"), {
          speed: sliderDuration,
          loop: loopMode,
          autoHeight: false,
          followFinger: true,
          freeMode: false,
          slideToClickedSlide: false,
          slidesPerView: "auto",
          rewind: false,
          mousewheel: {
            forceToAxis: true,
          },
          breakpoints: {
            // mobile landscape
            0: {
              spaceBetween: 20,
              slidesPerView: "auto",
            },
            // desktop
            992: {
              spaceBetween: 32,
              slidesPerView: "auto",
            },
          },
        });
      });
  });

  // Animate cursor movement
  function initializeCustomCursor() {
    const cursorWrapper = document.querySelector(".custom_cursor_wrapper");
    if (!cursorWrapper) return;

    document.addEventListener("mousemove", (e) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const xPos = (e.clientX / viewportWidth - 0.5) * 100;
      const yPos = (e.clientY / viewportHeight - 0.5) * 100;

      gsap.to(cursorWrapper, {
        x: `${xPos}vw`,
        y: `${yPos}vh`,
        ease: "power2.out",
        duration: 0.3,
      });
    });
  }

  initializeCustomCursor();

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

  // Define custom easing functions
  CustomEase.create("loader", "0.83, 0, 0.17, 1");
  CustomEase.create("loader2", "0.77, 0, 0.175, 1");

  document.addEventListener("DOMContentLoaded", function () {
    // Main animation setup for all elements
    document
      .querySelectorAll(".is-split-text, #FooterBottom1, #FooterBottom2")
      .forEach((element) => {
        let triggerElement;
        if (element.id === "FooterBottom1") {
          triggerElement = "#FooterTrigger1";
        } else if (element.id === "FooterBottom2") {
          triggerElement = "#FooterTrigger2";
        } else {
          triggerElement = element; // Default trigger is the element itself for .is-split-text
        }

        // Split text into lines
        const splitText = new SplitText(element, {
          type: "lines",
          linesClass: "split-line",
        });

        // Wrap each line in a div with overflow hidden
        splitText.lines.forEach((line) => {
          const wrapper = document.createElement("div");
          wrapper.classList.add("line-wrapper");
          wrapper.style.overflow = "hidden";
          line.parentNode.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });

        // Animate each line inside the wrapper with stagger and custom easing
        gsap.from(splitText.lines, {
          y: "100%",
          duration: 1.2,
          ease: "loader2",
          stagger: 0.2,
          scrollTrigger: {
            trigger: triggerElement,
            start: "top bottom",
            end: "top 70%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });

    // MutationObserver to detect when #loaderTrigger display changes to "flex"
    const loaderTrigger = document.querySelector("#loaderTrigger");
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          getComputedStyle(loaderTrigger).display === "flex"
        ) {
          observer.disconnect(); // Stop observing after trigger

          // Split #loaderSplit into lines and wrap each line
          const loaderSplitText = new SplitText("#loaderSplit", {
            type: "lines",
            linesClass: "split-line",
          });

          loaderSplitText.lines.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("line-wrapper");
            wrapper.style.overflow = "hidden";
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });

          // Animate each line in #loaderSplit as defined
          gsap.from(loaderSplitText.lines, {
            y: "100%", // Animate from below
            duration: 1.2,
            ease: "loader2",
            stagger: 0.2,
          });
          break;
        }
      }
    });

    // Start observing #loaderTrigger for attribute changes
    observer.observe(loaderTrigger, { attributes: true });
  });
  document.addEventListener("DOMContentLoaded", function () {
    // Function to set up animations for elements with .is-t-m inside .dark-slider_left-text
    function animateText(element, direction = "forward") {
      const splitText = new SplitText(element, {
        type: "lines",
        linesClass: "split-line",
      });

      // Wrap each line in a div with overflow hidden
      splitText.lines.forEach((line) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("line-wrapper");
        wrapper.style.overflow = "hidden";
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

      // Create the timeline for the animation
      const tl = gsap.timeline();

      // Add animation based on the direction
      if (direction === "forward") {
        tl.from(splitText.lines, {
          y: "100%",
          duration: 1.2,
          ease: "loader2",
          stagger: 0.2,
        });
      } else {
        tl.to(splitText.lines, {
          y: "100%",
          duration: 1.2,
          ease: "loader2",
          stagger: 0.2,
        });
      }
    }
  });
}

// Code for Screen Width Above 991px
function loadDesktopCode() {
  // Select all trigger, target, absolute, and number elements
  let triggersDark = $(".dark-slider_trigger-item");
  let imagesOverlay = $(".dark-slider_img-overlay");
  let absolutesDark = $(".dark-slider_left-text");
  let stickyNumberDark = $(".is-dark-slider_number"); // Number element to update
  let rightPanelsDark = $(".dark-slider_right"); // Panels to animate height
  let imagesDark = $(".dark-slider_right .dark-slider_img"); // Child elements to animate scale and Y transform

  // Function to update the sticky number based on which .dark-slider_left-text is active
  function updateStickyNumberDark(index) {
    stickyNumberDark.text(index + 1); // Update number (1-based index)
  }

  // Function to handle the scroll logic for any set of elements
  function setupScrollLogicDark(targetsDark) {
    triggersDark.each(function (index) {
      ScrollTrigger.create({
        trigger: $(this),
        start: "top 50%",
        onEnter: () => {
          targetsDark.eq(index).addClass("is-active");
          if (index > 0) {
            targetsDark.eq(index - 1).addClass("is-past");
          }
          updateStickyNumberDark(index); // Update number when a section becomes active
        },
        onLeaveBack: () => {
          targetsDark.eq(index).removeClass("is-active");
          if (index > 0) {
            targetsDark.eq(index - 1).removeClass("is-past");
          }
          updateStickyNumberDark(index - 1); // Update number when scrolling back up
        },
      });
    });
  }

  // Apply the logic for .dark-slider_left-text
  setupScrollLogicDark(absolutesDark);

  // Animate the height of .dark-slider_right elements, except the first one
  rightPanelsDark.each(function (index) {
    if (index > 0) {
      gsap.fromTo(
        $(this),
        { height: "0vh" },
        {
          height: "100vh",
          scrollTrigger: {
            trigger: triggersDark.eq(index),
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
          ease: "none",
        }
      );
    }
  });

  // Scale and Y transform animations for .dark-slider_img elements
  imagesDark.each(function (index) {
    if (index === 0) {
      // For the first image, animate scale on the first trigger
      gsap.fromTo(
        $(this),
        { scale: 1.2 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: triggersDark.eq(0), // Trigger on the first item
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
          ease: "none",
        }
      );

      // Animate Y transform from 0% to -15% on the second trigger
      gsap.fromTo(
        $(this),
        { yPercent: 0 },
        {
          yPercent: -15,
          scrollTrigger: {
            trigger: triggersDark.eq(1), // Trigger on the second item
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
          ease: "none",
        }
      );
    } else if (index > 0) {
      // For other images, animate the height while previous image transforms Y
      gsap.fromTo(
        $(this),
        { height: "0vh", scale: 1.2 },
        {
          height: "100vh",
          scale: 1,
          scrollTrigger: {
            trigger: triggersDark.eq(index),
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
          ease: "none",
        }
      );

      // Trigger Y-axis transform for the previous image
      gsap.fromTo(
        imagesDark.eq(index - 1),
        { yPercent: 0 },
        {
          yPercent: -15,
          scrollTrigger: {
            trigger: triggersDark.eq(index), // Trigger when this item starts
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
          ease: "none",
        }
      );
      gsap.fromTo(
        imagesOverlay.eq(index - 1),
        { opacity: 0 },
        {
          opacity: 0.9,
          scrollTrigger: {
            trigger: triggersDark.eq(index), // Trigger when this item starts
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
          ease: "none",
        }
      );
    }
  });
  // ScrollTrigger for the first scroll-trigger-1
  ScrollTrigger.create({
    trigger: '[mask-scroll-item="scroll-trigger-1"]',
    start: "bottom bottom",
    end: "bottom top",
    onEnter: () =>
      gsap.to('[mask-scroll-item="item"]', {
        yPercent: -100,
        duration: 0.6,
        ease: "power1.out",
      }),
    onLeaveBack: () =>
      gsap.to('[mask-scroll-item="item"]', {
        yPercent: 0,
        duration: 0.6,
        ease: "power1.out",
      }),
  });

  // ScrollTrigger for the second scroll-trigger-2
  ScrollTrigger.create({
    trigger: '[mask-scroll-item="scroll-trigger-2"]',
    start: "bottom bottom",
    end: "bottom top",
    onEnter: () =>
      gsap.to('[mask-scroll-item="item"]', {
        yPercent: -200,
        duration: 0.6,
        ease: "power1.out",
      }),
    onLeaveBack: () =>
      gsap.to('[mask-scroll-item="item"]', {
        yPercent: -100,
        duration: 0.6,
        ease: "power1.out",
      }),
  });

  // Select all trigger, target, bottom, Z elements, and the sticky number
  let triggers = $(".home-sticky_trigger-item");
  let absolutes = $(".home-sticky_item-absolute");
  let bottoms = $(".home-sticky_bottom-item");
  let topBars = $(".home-sticky_scroll-progress"); // Z elements
  let stickyNumber = $(".is-home-sticky-number"); // Number element to update

  // Function to update the sticky number based on which .home-sticky_item-absolute is active
  function updateStickyNumber(index) {
    stickyNumber.text(index + 1); // Update number (1-based index)
  }

  // Function to handle the scroll logic for any set of elements
  function setupScrollLogic(targets) {
    triggers.each(function (index) {
      ScrollTrigger.create({
        trigger: $(this),
        start: "top bottom", // The trigger for Y elements stays the same
        onEnter: () => {
          targets.eq(index).addClass("is-active");
          if (index > 0) {
            targets.eq(index - 1).addClass("is-past");
          }
          updateStickyNumber(index); // Update number when a section becomes active
        },
        onLeaveBack: () => {
          targets.eq(index).removeClass("is-active");
          if (index > 0) {
            targets.eq(index - 1).removeClass("is-past");
          }
          updateStickyNumber(index - 1); // Update number when scrolling back up
        },
      });
    });
  }

  // Apply the logic for both .home-sticky_item-absolute and .home-sticky_bottom-item
  setupScrollLogic(absolutes);
  setupScrollLogic(bottoms);

  // Animate the width of .section-title_top-bar.is-bottom (Z) elements
  topBars.each(function (index) {
    gsap.to($(this), {
      width: "100%",
      scrollTrigger: {
        trigger: triggers.eq(index),
        start: "top bottom", // This stays the same for all X elements
        end: "bottom bottom",
        scrub: true,
      },
      ease: "none",
    });
  });

  // Select the trigger element
  const videoTrigger = document.getElementById("videotrigger"); // Ensure #videotrigger exists

  // Function to check display property and play/pause the video
  function checkVideoTrigger() {
    const display = window.getComputedStyle(videoTrigger).display;
    if (display === "flex") {
      video.play();
    } else {
      video.pause();
    }
  }

  // Use a MutationObserver to monitor changes to the `style` attribute of #videotrigger
  const observer = new MutationObserver(() => {
    checkVideoTrigger();
  });

  // Observe changes to the `style` attribute
  observer.observe(videoTrigger, { attributes: true });

  // Run the function initially to ensure correct state
  checkVideoTrigger();

  //Sphere move up
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".is-sphere-move-2", {
    y: "-100vh",
    ease: "none",
    scrollTrigger: {
      trigger: ".sphere-move-trigger",
      start: "top bottom", // Trigger starts when top of the element hits the bottom of the viewport (0% point)
      end: "bottom bottom", // Ends when bottom of the element hits the bottom of the viewport (100% point)
      scrub: true, // Smoothly animates during scroll
    },
  });

  gsap.registerPlugin(ScrollTrigger);

  // Create a timeline that controls the movement
  let sphereMoveTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".sphere-move_first-move-trigger",
      start: "top bottom",
      endTrigger: ".sphere-move-trigger",
      end: "bottom bottom",
      scrub: true,
    },
  });

  // First part: Move from 0 to -50vh
  sphereMoveTimeline.to(".sphere-move_sphere-img", {
    y: "-50vh",
    ease: "none",
  });

  // Second part: Move from -50vh to -100vh
  sphereMoveTimeline.to(".sphere-move_sphere-img", {
    y: "-100vh",
    ease: "none",
  });

  gsap.to(".sphere-move_mask", {
    height: "200vh",
    ease: "none",
    scrollTrigger: {
      trigger: ".sphere-move-trigger",
      start: "top bottom", // Trigger starts when top of the element hits the bottom of the viewport (0% point)
      end: "bottom bottom", // Ends when bottom of the element hits the bottom of the viewport (100% point)
      scrub: true, // Smoothly animates during scroll
    },
  });

  /*
  // Select all triggers, targets, and the number display element for the second section
  let triggers2 = $(".home-steps2_table-trigger-item");
  let targets2 = $(".home-steps2_table-item");
  let steps2Number = $(".is-home-steps2_number"); // Number element to update

  // Function to update the displayed number based on the active item index
  function updateSteps2Number(index) {
    steps2Number.text(index + 1); // Update number to 1-based index
  }

  // Function to handle scroll logic for the second set of elements
  function setupScrollLogicForSection2() {
    triggers2.each(function (index) {
      ScrollTrigger.create({
        trigger: $(this),
        start: "top bottom",
        onEnter: () => {
          targets2.eq(index).addClass("is-active");
          if (index > 0) {
            targets2.eq(index - 1).addClass("is-past");
          }
          updateSteps2Number(index); // Update the number display when entering
        },
        onLeaveBack: () => {
          targets2.eq(index).removeClass("is-active");
          if (index > 0) {
            targets2.eq(index - 1).removeClass("is-past");
          }
          updateSteps2Number(index - 1); // Update number when scrolling back up
        },
      });
    });
  }
*/
  // Initialize scroll logic for the second section
  //  setupScrollLogicForSection2();
}

// Code for Screen Width Below 991px
function loadMobileCode() {
  // 3 steps mobile slider

  let currentY = 0;

  const targets = document.querySelectorAll('[mask-scroll-item="item"]');
  const prevButton = document.querySelector(".is-sphere-prev");
  const nextButton = document.querySelector(".is-sphere-next");

  prevButton.classList.add("is-disabled");

  function updateTransform() {
    targets.forEach((target) => {
      target.style.transition = "transform 0.3s ease-out";
      target.style.transform = `translateY(${currentY}%)`;
    });

    if (currentY >= 0) {
      prevButton.classList.add("is-disabled");
    } else {
      prevButton.classList.remove("is-disabled");
    }

    if (currentY <= -200) {
      nextButton.classList.add("is-disabled");
    } else {
      nextButton.classList.remove("is-disabled");
    }
  }

  prevButton.addEventListener("click", () => {
    if (currentY < 0) {
      currentY += 100;
      updateTransform();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentY > -200) {
      currentY -= 100;
      updateTransform();
    }
  });
}

// Main function to check screen size and load respective code
function initializeCode() {
  const screenWidth = window.innerWidth;

  loadCommonCode(); // Load common code for all resolutions
  if (screenWidth > 991) {
    loadDesktopCode(); // Load desktop-specific code
  } else {
    loadMobileCode(); // Load mobile-specific code
  }
}

// Reload page on resizing past 991px breakpoint
let lastWidthAboveBreakpoint = window.innerWidth > 991;
window.addEventListener("resize", () => {
  const isWidthNowAboveBreakpoint = window.innerWidth > 991;
  if (isWidthNowAboveBreakpoint !== lastWidthAboveBreakpoint) {
    location.reload(); // Reload page if crossing breakpoint
  }
  lastWidthAboveBreakpoint = isWidthNowAboveBreakpoint;
});

// Run on initial load
initializeCode();
