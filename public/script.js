// Navbar Mobile Handle
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("show");
});

// Category Handle
const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false,
  isAutoPlay = true,
  startX,
  startScrollLeft,
  timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
  });
});

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  // Records the initial cursor and scroll position of the carousel
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return; // if isDragging is false return from here
  // Updates the scroll position of the carousel based on the cursor movement
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

const infiniteScroll = () => {
  // If the carousel is at the beginning, scroll to the end
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
  // If the carousel is at the end, scroll to the beginning
  else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  // Clear existing timeout & start autoplay if mouse is not hovering over carousel
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};

const autoPlay = () => {
  if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
  // Autoplay the carousel after every 2500 ms
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
};
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

//=========================================================================================
// Disable Interaction Temporary
function enableInteractionAfterDelay(elementId, className, delay) {
  const element = document.getElementById(elementId);

  setTimeout(() => {
    element.classList.remove(className);
  }, delay);
}
//=========================================================================================
// Animation Slide Down Category
document.addEventListener("DOMContentLoaded", function () {
  const cardImages = document.querySelectorAll(".card .img");
  setInterval(animateBrightness, 2000);

  // Function to check if an element is in the viewport
  function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top <= window.innerHeight && rect.bottom >= 0;
  }

  // Function to toggle the animation class
  function toggleAnimation() {
    cardImages.forEach((img) => {
      if (isElementInViewport(img)) {
        img.classList.add("animate-img-category");
        enableInteractionAfterDelay(
          "category-section",
          "disable-interaction",
          2000
        );
      }
    });
  }

  // Initial check and scroll event listener
  toggleAnimation();
  window.addEventListener("scroll", toggleAnimation);
});

function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/* function resetAnimation(element) {
  element.style.animation = ""; // Reset the animation
} */

function handleScrollAnimation() {
  const cardImages = document.querySelectorAll(".card .img");
  cardImages.forEach((element) => {
    if (isElementInViewport(element)) {
      element.classList.add("animate-img-category");
      enableInteractionAfterDelay(
        "category-section",
        "disable-interaction",
        2000
      );
    } /* else {
      resetAnimation(element);
    } */
  });
}

// Attach the event listener to scroll event
window.addEventListener("scroll", handleScrollAnimation);

//=========================================================================================
// Animation Bar Number Increment
const bars = document.querySelectorAll(".bar-5");

// Fungsi untuk mengatur ulang animasi pada elemen bar
function resetAnimation(bar) {
  bar.style.width = "0%";
  bar.querySelector("h5").textContent = "0%";
}

// Fungsi untuk mengaktifkan animasi pada elemen bar
function animateBar(bar) {
  const width = parseFloat(bar.style.getPropertyValue("--width")) || 0;
  const duration = 1150; // Durasi animasi dalam milidetik
  const interval = 10; // Interval untuk mengupdate animasi dalam milidetik
  const increment = (width * interval) / duration;
  let currentWidth = 0;

  function updateWidth() {
    if (currentWidth < width) {
      currentWidth += increment;
      bar.style.width = currentWidth + "%";
      bar.querySelector("h5").textContent = Math.round(currentWidth) + "%";
      requestAnimationFrame(updateWidth);
    }
  }

  updateWidth();
}

// Buat observer untuk memantau masuknya elemen ke viewport
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        resetAnimation(bar);
        animateBar(bar);
        observer.unobserve(bar); // Hentikan pengamatan setelah animasi terpicu
      }
    });
  },
  { threshold: 1 }
);

// Tambahkan observer pada setiap elemen bar
bars.forEach((bar) => {
  observer.observe(bar);
});

//=========================================================================================
// Viewport Bar Animation Trigger
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/* function resetAnimation(element) {
    element.style.animation = ""; // Reset the animation
} */

function handleScrollAnimation() {
  const elements = document.querySelectorAll(".bar-5");
  elements.forEach((element) => {
    if (isElementInViewport(element)) {
      element.style.animation = "moveRight 2s ease-out forwards";
    } /* else {
      resetAnimation(element);
    } */
  });
}

// Attach the event listener to scroll event
window.addEventListener("scroll", handleScrollAnimation);

//=========================================================================================
// Music Play Handle
const playIcon = document.getElementById("playIcon");
const musicBar = document.getElementById("musicBar");
const musicTitle = document.getElementById("musicTitle");
const musicCdContainer = document.querySelector(".music-cd");
const audio = new Audio("assets/music/music.mp3");

let isPlaying = false;

playIcon.addEventListener("click", () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    playIcon.classList.add("zoom-in");
    setTimeout(() => {
      playIcon.classList.remove("zoom-in");
    }, 300);
    playIcon.classList.remove("fa-circle-play");
    playIcon.classList.add("fa-circle-pause");
    musicBar.classList.add("music-play");
    setTimeout(() => {
      musicCdContainer.classList.toggle("active");
    }, 400);
    setTimeout(() => {
      musicTitle.classList.toggle("active");
    }, 400);
    audio.play();
  } else {
    playIcon.classList.add("zoom-in");
    setTimeout(() => {
      playIcon.classList.remove("zoom-in");
    }, 300);
    playIcon.classList.remove("fa-circle-pause");
    setTimeout(() => {
      musicBar.classList.remove("music-play");
    }, 200);
    playIcon.classList.add("fa-circle-play");
    musicCdContainer.classList.remove("active");
    musicTitle.classList.remove("active");
    audio.pause();
  }
});

//=========================================================================================
// Logo Animation
function animateBrightness() {
  const logo = document.getElementById("brighteningLogo");

  logo.classList.add("brightness-animation");

  setTimeout(() => {
    logo.classList.remove("brightness-animation");
  }, 1000);
}

//=========================================================================================
// Category Project Selection Handler
const projectStacks = document.querySelectorAll(".project-select-stack");

function updateProjects(categoryId) {
  const projects = [
    document.getElementById("web-development"),
    document.getElementById("game-development"),
    document.getElementById("graphic-design"),
  ];

  projects.forEach(function (project) {
    project.classList.remove("container-crew", "container-crew-visible");

    const selected = project.id === categoryId;

    if (selected) {
      project.classList.add("container-crew-visible", "fade-in");
    }

    if (!selected) {
      project.classList.add("container-crew");
    }
  });
}

projectStacks.forEach((stack) => {
  stack.addEventListener("click", function () {
    projectStacks.forEach((s) => {
      s.style.backgroundColor = "#ffffff";
    });

    const categoryId = stack.getAttribute("data-category");

    updateProjects(categoryId);

    stack.style.backgroundColor = "#f9d731";
  });
});

//? Hero Text Typing Handler
const dynamicText = document.getElementById("text-typing");
const words = ["Fullstack Web Developing", "Graphic Design", "Video Editing"];
let index = 0;
let wordIndex = 0;
let isDeleting = false;
let typingSpeed = 140;

function type() {
  const currentWord = words[index];

  if (isDeleting) {
    dynamicText.textContent = currentWord.substring(0, wordIndex - 1);
    wordIndex--;
  } else {
    dynamicText.textContent = currentWord.substring(0, wordIndex + 1);
    wordIndex++;
  }

  if (!isDeleting && wordIndex === currentWord.length + 1) {
    dynamicText.classList.remove("paused");
    setTimeout(() => {
      isDeleting = true;
      typingSpeed = 50;
      dynamicText.classList.add("paused");
    }, 2000);
  } else if (isDeleting && wordIndex === 0) {
    isDeleting = false;
    index = (index + 1) % words.length;
    typingSpeed = 140;
  }

  setTimeout(type, typingSpeed);
}

window.onload = function () {
  type();
};

//? Cursor Custom Handler
document.addEventListener("mousemove", function (e) {
  var cursorCircle = document.getElementById("cursorCircle");
  cursorCircle.style.left = e.pageX - 13 + "px";
  cursorCircle.style.top = e.pageY - 13 + "px";
});

document.addEventListener("click", function (e) {
  var cursorCircle = document.getElementById("cursorCircle");
  cursorCircle.style.transform = "scale(2)";
  cursorCircle.style.backgroundColor = "#f9d731";

  setTimeout(function () {
    cursorCircle.style.transform = "scale(1)";
    cursorCircle.style.backgroundColor = "#ffffff";
  }, 300);
});
