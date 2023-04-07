"use strict";

// Selectors
const sections = document.querySelectorAll("section");
const nextBtn = document.querySelector(".next");
const customIcon = document.querySelector(".my-custom-scroll-icon");
const navButtons = document.querySelectorAll("header nav ul li");
const slide1Bottom = document.querySelector(".effect-slide1.bottom");
const slide2Bottom = document.querySelector(".effect-slide2.bottom");
const slide1Top = document.querySelector(".effect-slide1.top");
const slide2Top = document.querySelector(".effect-slide2.top");






// Variables
let index = 0;
let isAnimating = false;
let isNavAnimating = false;
let lastTime = new Date().getTime();
let switchWheelEvent = false;
let confirmSwitchSection = 0;
const animationDuration = 1600;







// Functions
function toggleText(index, state) {
  sections[index]
    .querySelector(".text")
    .classList.toggle("show", state === "show");
}
toggleText(0, "show");

/*+++++++++++++++++++++++++++*/

function handleNextBtn() {
  if (isAnimating || index > 2) return;
  isAnimating = true;

  toggleText(index, "hide");

  index++;
  sections.forEach((section, i) => {
    if (i === index) {
      navButtons.forEach((button) => {
        button.classList.remove("active");
      });
      navButtons[i].classList.add("active");

      toggleText(i, "show");

      slide1Top.classList.add("active");
      slide2Top.classList.add("active");
      setTimeout(() => {
        slide1Top.classList.remove("active");
        slide2Top.classList.remove("active");
        isAnimating = false;
      }, 2000);

      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth" });
      }, 800);
    }

    showHideIcon();
  });
}

/*+++++++++++++++++++++++++++*/

function handleWheel(e) {
  if (switchWheelEvent) {
    confirmSwitchSection++;
    if (confirmSwitchSection === 15) {
      confirmSwitchSection = 0;
      const currentTime = new Date().getTime();
      if (isAnimating || currentTime - lastTime < animationDuration) return;
      isAnimating = true;

      const direction = e.deltaY > 0 ? "top" : "bottom";
      let newIndex = index + (direction === "top" ? 1 : -1);

      if (newIndex < 0 || newIndex >= sections.length) {
        newIndex = 0;
        isAnimating = false;
        return;
      }

      lastTime = currentTime;
      handleSlideAnimation(direction, newIndex);
      showHideIcon();
    }
  }
}

/*+++++++++++++++++++++++++++*/

function handleSlideAnimation(direction, newIndex) {
  const slide1 = direction === "top" ? slide1Top : slide1Bottom;
  const slide2 = direction === "top" ? slide2Top : slide2Bottom;

  toggleText(index, "hide");

  index = newIndex;

  sections.forEach((section, i) => {
    if (i === index) {
      navButtons.forEach((button) => {
        button.classList.remove("active");
      });
      navButtons[i].classList.add("active");

      toggleText(i, "show");

      slide1.classList.add("active");
      slide2.classList.add("active");
      setTimeout(() => {
        slide1.classList.remove("active");
        slide2.classList.remove("active");
        isAnimating = false;
      }, 2000);

      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth" });
      }, 800);
    }
  });
}

/*+++++++++++++++++++++++++++*/

function handleNavButtonClick(indexBtn) {
  // If an animation is currently in progress, don't allow another checkbox change
  if (isAnimating || isNavAnimating) return;

  isNavAnimating = true;
  switchWheelEvent = true;

  // Find the index of the currently active section
  const activeIndex = Array.from(navButtons).findIndex((navButton) =>
    navButton.classList.contains("active")
  );

  // If the clicked nav button is already active, don't do anything else
  if (indexBtn === activeIndex) {
    isNavAnimating = false;
    return;
  }

  handleSlideAnimation(indexBtn > activeIndex ? "top" : "bottom", indexBtn);

  // This will tell the `handleWheel()` function that the animation is running
  isAnimating = true;
  setTimeout(() => {
    isNavAnimating = false;
    isAnimating = false;
  }, 2000);

  showHideIcon();
}

/*+++++++++++++++++++++++++++*/

/* show hide scroll icon depending of last section*/
function showHideIcon() {
  setTimeout(() =>customIcon.style.display = index === sections.length - 1 ? "none" : "block", 1000);
}







// Events
nextBtn.addEventListener("click", () => handleNextBtn());
window.addEventListener("wheel", (e) => handleWheel(e), { passive: false });

navButtons.forEach((button, indexBtn) => {
  button.addEventListener("click", () => {
    handleNavButtonClick(indexBtn);
  });
});

/*+++++++++++++++++++++++++++*/

sections.forEach((section, i) => {
  section.addEventListener("scroll", () => {
    // Check if its first section
    if (section.scrollTop === 0 && i === 0) return;


    // Check if scroll bar is on the top of the section
    if (section.scrollTop === 0) {
      switchWheelEvent = true;
      window.addEventListener("wheel", (e) => handleWheel(e), {
        passive: false,
      });
      return;
    } else switchWheelEvent = false;


    // Make last section switch to previous section
    if (sections.length - 1 === i) {
      if (section.scrollTop === 0) {
        switchWheelEvent = true;
        window.addEventListener("wheel", (e) => handleWheel(e), {
          passive: false,
        });
        return;
      } else switchWheelEvent = false;
      switchWheelEvent = false;
      return;
    }


    // Check if its last section
    if (section.scrollHeight - 1 < section.scrollTop + section.clientHeight) {
      switchWheelEvent = true;
      window.addEventListener("wheel", (e) => handleWheel(e), {
        passive: false,
      });
    } else switchWheelEvent = false;

    section.scrollIntoView({ behavior: "smooth" });
  });
});
