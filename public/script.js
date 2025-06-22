// Navbar Mobile Handle
/* const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("show");
});
 */
window.onload = function () {
  type();
  const savedName = localStorage.getItem("playerName");
  if (savedName) {
    document.getElementById("playerName").value = savedName;
  }
};

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

//? Pop Up Certificate Handler
let isOpenCertificate = false;
const popUpButtonDicoding = document.getElementById("pop-up-button-dicoding");
const popUpButtonFreeCodeCamp = document.getElementById(
  "pop-up-button-freecodecamp"
);
const popUpButtonBWA = document.getElementById("pop-up-button-bwa");
const popUpButtonMySkills = document.getElementById("pop-up-button-myskills");

const popup = document.getElementById("pop-up-certificate");
const buttonCloseCertificate = document.getElementById("close-certificate");

const popUpDicoding = `<div id="pop-up-certificate" class="pop-up-certificate">
      <div class="content-pop-up" id="content-pop-up">
        <div class="header-certificate">
          <span>Certificate</span>
          <div id="close-certificate" class="x-symbol-header">
            <svg
              fill="#1d1d1d"
              height="10px"
              width="10px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 460.775 460.775"
              xml:space="preserve"
            >
              <path
                d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
              />
            </svg>
          </div>
        </div>
        <div class="content-certificate">
          <div>
            <img
              src="assets/image/ser3.png"
              alt="Certificate"
              class="img-certificate"
            />
          </div>
          <div>
            <img
              src="assets/image/ser4.png"
              alt="Certificate"
              class="img-certificate"
            />
          </div>
        </div>
        <!--    <div class="footer-certificate">Footer</div> -->
      </div>
    </div>`;

const popUpFreeCodeCamp = `<div id="pop-up-certificate" class="pop-up-certificate">
      <div class="content-pop-up" id="content-pop-up">
        <div class="header-certificate">
          <span>Certificate</span>
          <div id="close-certificate" class="x-symbol-header">
            <svg
              fill="#1d1d1d"
              height="10px"
              width="10px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 460.775 460.775"
              xml:space="preserve"
            >
              <path
                d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
              />
            </svg>
          </div>
        </div>
        <div class="content-certificate">
          <div>
            <img
              src="assets/image/ser7.png"
              alt="Certificate"
              class="img-certificate"
            />
          </div>
          <div>
            <img
              src="assets/image/ser8.png"
              alt="Certificate"
              class="img-certificate"
            />
          </div>
          <div>
            <img
              src="assets/image/ser9.png"
              alt="Certificate"
              class="img-certificate"
            />
          </div>
          <div>
            <img
              src="assets/image/ser10.png"
              alt="Certificate"
              class="img-certificate"
            />
          </div>
        </div>
        <!--    <div class="footer-certificate">Footer</div> -->
      </div>
    </div>`;

const popUpBWA = `<div id="pop-up-certificate" class="pop-up-certificate">
      <div class="content-pop-up" id="content-pop-up">
        <div class="header-certificate">
          <span>Certificate</span>
          <div id="close-certificate" class="x-symbol-header">
            <svg
              fill="#1d1d1d"
              height="10px"
              width="10px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 460.775 460.775"
              xml:space="preserve"
            >
              <path
                d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
              />
            </svg>
          </div>
        </div>
        <div class="content-certificate">
          <div>
            <img
              src="assets/image/ser1.png"
              alt="Certificate"
              class="img-certificate"
            />
          </div>
          <div>
            <img
              src="assets/image/ser6.png"
              alt="Certificate"
              class="img-certificate"
            />
          </div>
        </div>
        <!--    <div class="footer-certificate">Footer</div> -->
      </div>
    </div>`;

const popUpMySkills = `<div id="pop-up-certificate" class="pop-up-certificate">
      <div class="content-pop-up" id="content-pop-up">
        <div class="header-certificate">
          <span>Certificate</span>
          <div id="close-certificate" class="x-symbol-header">
            <svg
              fill="#1d1d1d"
              height="10px"
              width="10px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 460.775 460.775"
              xml:space="preserve"
            >
              <path
                d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
              />
            </svg>
          </div>
        </div>
        <div class="content-certificate">
          <div>
            <img
              src="assets/image/ser2.png"
              alt="Certificate"
              class="img-certificate"
            />
          </div>
          <div>
            <img
              src="assets/image/ser11.png"
              alt="Certificate"
              class="img-certificate"
            />
          </div>
          <div>
            <img
              src="assets/image/ser12.png"
              alt="Certificate"
              class="img-certificate"
            />
          </div>
        </div>
        <!--    <div class="footer-certificate">Footer</div> -->
      </div>
    </div>`;

popUpButtonDicoding.addEventListener("click", () => {
  isOpenCertificate = true;
  const popUpContainer = document.getElementById("content-pop-up-certificate");
  popUpContainer.innerHTML = popUpDicoding;

  const buttonCloseCertificate = document.getElementById("close-certificate");
  buttonCloseCertificate.addEventListener("click", () => {
    isOpenCertificate = false;
    popUpContainer.innerHTML = "";
  });
});

popUpButtonFreeCodeCamp.addEventListener("click", () => {
  isOpenCertificate = true;
  const popUpContainer = document.getElementById("content-pop-up-certificate");
  popUpContainer.innerHTML = popUpFreeCodeCamp;

  const buttonCloseCertificate = document.getElementById("close-certificate");
  buttonCloseCertificate.addEventListener("click", () => {
    isOpenCertificate = false;
    popUpContainer.innerHTML = "";
  });
});

popUpButtonBWA.addEventListener("click", () => {
  isOpenCertificate = true;
  const popUpContainer = document.getElementById("content-pop-up-certificate");
  popUpContainer.innerHTML = popUpBWA;

  const buttonCloseCertificate = document.getElementById("close-certificate");
  buttonCloseCertificate.addEventListener("click", () => {
    isOpenCertificate = false;
    popUpContainer.innerHTML = "";
  });
});

popUpButtonMySkills.addEventListener("click", () => {
  isOpenCertificate = true;
  const popUpContainer = document.getElementById("content-pop-up-certificate");
  popUpContainer.innerHTML = popUpMySkills;

  const buttonCloseCertificate = document.getElementById("close-certificate");
  buttonCloseCertificate.addEventListener("click", () => {
    isOpenCertificate = false;
    popUpContainer.innerHTML = "";
  });
});

document.addEventListener("click", function handleClickOutside(event) {
  if (isOpenCertificate) {
    const contentPopUp = document.getElementById("content-pop-up");
    const isClickInside = contentPopUp.contains(event.target);
    const isClickFolderDicoding = popUpButtonDicoding.contains(event.target);
    const isClickFolderFreeCodeCamp = popUpButtonFreeCodeCamp.contains(
      event.target
    );
    const isClickFolderBWA = popUpButtonBWA.contains(event.target);
    const isClickFolderMySkills = popUpButtonMySkills.contains(event.target);

    if (
      !isClickInside &&
      !isClickFolderDicoding &&
      !isClickFolderFreeCodeCamp &&
      !isClickFolderBWA &&
      !isClickFolderMySkills
    ) {
      console.log("close");
      const popUpContainer = document.getElementById(
        "content-pop-up-certificate"
      );
      popUpContainer.innerHTML = "";
      isOpenCertificate = false;
    }
  }
});

//? Hero Button Hover
const btnContact = document.querySelector(".btn-contact");
const icon = btnContact.querySelector("i");

btnContact.addEventListener("mouseenter", () => {
  icon.style.color = "#141414";
});

btnContact.addEventListener("mouseleave", () => {
  icon.style.color = "#f9d731";
});

//? Overview Profile Handler
// const overviewLeft = document.querySelector(".overview-left");
// const shadow = document.querySelector(".shadow");

// overviewLeft.addEventListener("mousemove", (e) => {
//   const { offsetX, offsetY, target } = e;
//   const { offsetWidth: width, offsetHeight: height } = target;

//   // Menghitung posisi kursor dalam persen
//   const x = (offsetX / width) * 100;
//   const y = (offsetY / height) * 100;

//   // Mengatur posisi kotak bayangan sesuai kursor
//   shadow.style.transform = `translate(${x}%, ${y}%)`;
// });

// overviewLeft.addEventListener("mouseenter", () => {
//   shadow.style.display = "block"; // Menampilkan bayangan saat mouse masuk
// });

// overviewLeft.addEventListener("mouseleave", () => {
//   shadow.style.display = "none"; // Menyembunyikan bayangan saat mouse keluar
// });

const buttonBarItems = document.querySelectorAll(".button-redirect");
const sections = document.querySelectorAll(".content-section");

buttonBarItems.forEach((item) => {
  item.addEventListener("click", () => {
    sections.forEach((section) => {
      section.classList.remove("active");
    });

    const targetId = item.getAttribute("data-target");
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.classList.add("active");
    }
  });
});

//? Clock Handler
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  document.getElementById("hours").textContent = formattedHours;
  document.getElementById("minutes").textContent = formattedMinutes;
  document.getElementById("seconds").textContent = formattedSeconds;
  document.getElementById("ampm").textContent = ampm;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = days[now.getDay()];
  document.getElementById("day").textContent = currentDay;
}

setInterval(updateClock, 1000);

updateClock();

//? Github Stat Handler
async function fetchGitHubStats(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();

    /*    document.getElementById("name").textContent = `${data.name}`;
    document.getElementById("followers").textContent = `${data.followers}`;
    document.getElementById("following").textContent = `${data.following}`; */
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
  }
}

fetchGitHubStats("AlvitoDian");

//? Toggle Theme Handler
document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggle-theme");
  const root = document.documentElement;

  if (localStorage.getItem("theme") === "dark") {
    root.style.setProperty("--background-color-1", "rgb(32, 28, 7)");
    root.style.setProperty(
      "--background-color-2",
      "linear-gradient(180deg, rgba(32, 28, 7, 1) 0%, rgba(0, 0, 0, 1) 100%)"
    );
    root.style.setProperty("--text-color", "#ffffff");
    root.style.setProperty("--shape-blur", "70px");
    root.style.setProperty("--shadow-navbar", "0px 0px 35px 5px #F9D731");
    root.style.setProperty("--border-bottom-navbar", "#f9d731 2px solid");
    toggleSwitch.checked = true;
  } else {
    root.style.setProperty("--background-color-1", "rgb(255, 255, 255)");
    root.style.setProperty(
      "--background-color-2",
      "linear-gradient(180deg,rgba(255, 255, 255, 1) 0%,rgba(255, 255, 255, 1) 100%)"
    );
    root.style.setProperty("--text-color", "#000000");
    root.style.setProperty("--shape-blur", "0px");
    root.style.setProperty(
      "--shadow-navbar",
      "0px 8px 10px 0px rgba(0, 0, 0, 0.2)"
    );
    root.style.setProperty("--border-bottom-navbar", "#f9d731 0px solid");
  }

  toggleSwitch.addEventListener("change", () => {
    if (toggleSwitch.checked) {
      root.style.setProperty("--background-color-1", "rgb(32, 28, 7)");
      root.style.setProperty(
        "--background-color-2",
        "linear-gradient(180deg, rgba(32, 28, 7, 1) 0%, rgba(0, 0, 0, 1) 100%)"
      );
      root.style.setProperty("--text-color", "#ffffff");
      root.style.setProperty("--shape-blur", "70px");
      root.style.setProperty("--shadow-navbar", "0px 0px 35px 5px #F9D731");
      root.style.setProperty("--border-bottom-navbar", "#f9d731 2px solid");
      localStorage.setItem("theme", "dark");
    } else {
      root.style.setProperty("--background-color-1", "rgb(255, 255, 255)");
      root.style.setProperty(
        "--background-color-2",
        "linear-gradient(180deg,rgba(255, 255, 255, 1) 0%,rgba(255, 255, 255, 1) 100%)"
      );
      root.style.setProperty("--text-color", "#000000");
      root.style.setProperty("--shape-blur", "0px");
      root.style.setProperty(
        "--shadow-navbar",
        "0px 8px 10px 0px rgba(0, 0, 0, 0.2)"
      );
      root.style.setProperty("--border-bottom-navbar", "#f9d731 0px solid");
      localStorage.setItem("theme", "light");
    }
  });
});

//? Mini Game Handler
const gameContainer = document.getElementById("mini-game-container");
const btnStart = document.getElementById("btn-start");
const scoreDisplay = document.getElementById("score");
const resultModal = document.getElementById("resultModal");
const finalScore = document.getElementById("final-score");
const rankScore = document.getElementById("rank-score");
const comboText = document.getElementById("combo-text");
const closeButton = document.getElementById("close-button");
const startGameBtn = document.querySelector("button[onclick='startGame()']");
const countdownText = document.getElementById("time");

let score = 0;
let circlesGenerated = 0;
let comboCount = 0;
let comboTimer;
let gameInterval;
let selectedDifficulty = "";
let circlesClicked = 0;
let gameStartTime;
let circleClicked = false;
let missedClick = 0;
const music = new Audio("assets/music/music2.mp3");
const hitSound = new Audio("assets/music/hit.mp3");
const comboSound = new Audio("assets/music/combo.mp3");
const startSound = new Audio("assets/music/confirm.mp3");
const MIN_GAME_DURATION = 25000;

const difficultyButtons = document.querySelectorAll(".difficulty-btn");

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    difficultyButtons.forEach((btn) => btn.classList.remove("selected"));

    button.classList.add("selected");

    selectedDifficulty = button.id.replace("Btn", "").toLowerCase();

    updateStartButton();
  });
});

function updateStartButton() {
  if (selectedDifficulty) {
    startGameBtn.disabled = false;
  }
}

function openModal() {
  document.getElementById("gameModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("gameModal").style.display = "none";
}

function showCombo() {
  comboText.style.display = "block";
  setTimeout(() => {
    comboText.style.display = "none";
  }, 2000);
}

function updateScore() {
  scoreDisplay.textContent = `${score}x`;
}

function startCountdown() {
  if (!leaderboard.classList.contains("close")) {
    leaderboard.classList.remove("open");
    leaderboard.classList.add("close");
  }

  playerName = document.getElementById("playerName").value.trim();
  music.volume = 1;

  if (!playerName) {
    alert("Silakan masukkan nama Anda!");
    return;
  }

  localStorage.setItem("playerName", playerName);

  const countdownElement = document.getElementById("countdown");
  let countdownValue = 3;

  countdownElement.innerText = countdownValue;
  countdownElement.style.display = "block";
  btnStart.style.display = "none";

  closeModal();
  music.play();
  music.loop = true;
  startSound.currentTime = 0;
  startSound.play();

  const countdownTimer = setInterval(() => {
    countdownValue--;
    countdownElement.innerText = countdownValue;

    if (countdownValue === 0) {
      clearInterval(countdownTimer);
      countdownElement.style.display = "none";
      startGame();
    }
  }, 1000);
}

function startGame() {
  score = 0;
  comboCount = 0;
  circlesClicked = 0;
  missedClick = 0;
  updateScore();
  let circleClicked = false;
  gameStartTime = Date.now();

  const gameDurationTimer = setInterval(() => {
    const elapsedTime = Date.now() - gameStartTime;
    const remainingTime = MIN_GAME_DURATION - elapsedTime;

    const secondsRemaining = Math.max(Math.floor(remainingTime / 1000), 0);
    const formattedTime = `00:${
      secondsRemaining < 10 ? "0" : ""
    }${secondsRemaining}`;
    countdownText.innerText = formattedTime;

    if (remainingTime <= 0) {
      clearInterval(gameDurationTimer);
      endGame();
    }
  }, 1000);

  switch (selectedDifficulty) {
    case "easy":
      gameInterval = 1000;
      break;
    case "medium":
      gameInterval = 800;
      break;
    case "hard":
      gameInterval = 400;
      break;
    case "hell":
      gameInterval = 180;
      break;
    default:
      gameInterval = 800;
      break;
  }

  function createCircle() {
    const circle = document.createElement("div");
    circle.classList.add("circle");

    const x = Math.random() * (gameContainer.clientWidth - 50);
    const y = Math.random() * (gameContainer.clientHeight - 50);

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    circle.addEventListener("click", () => {
      comboCount++;
      circlesClicked++;
      circleClicked = false;
      hitSound.currentTime = 0;
      hitSound.play();

      if (comboCount === 5) {
        score *= 2;
        updateScore();
        comboCount = 0;
        showCombo();
        comboSound.currentTime = 0;
        comboSound.play();
      } else {
        score++;
        updateScore();
      }
      clearTimeout(comboTimer);
      comboTimer = setTimeout(() => {
        comboCount = 0;
      }, 2000);

      circle.remove();
    });

    setTimeout(() => {
      if (circle.parentNode) {
        if (!circleClicked) {
          missedClick++;
        }
        circle.remove();
      }
    }, 1000);

    gameContainer.appendChild(circle);
  }

  gameInterval = setInterval(createCircle, gameInterval);
}

function endGame() {
  clearInterval(gameInterval);
  finalScore.textContent = `Skor Akhir: ${score}x`;
  resultModal.style.display = "flex";
  btnStart.style.display = "flex";

  let fadeOutInterval = setInterval(() => {
    if (music.volume > 0.05) {
      music.volume -= 0.05;
    } else {
      clearInterval(fadeOutInterval);
      music.pause();
      music.currentTime = 0;
    }
  }, 100);

  const totalCircles = circlesClicked + missedClick;
  const percentage =
    totalCircles > 0 ? (circlesClicked / totalCircles) * 100 : 0;

  let rank = "D";

  if (percentage === 100) {
    rank = "SSS";
  } else if (percentage >= 95) {
    rank = "S";
  } else if (percentage >= 85) {
    rank = "A";
  } else if (percentage >= 70) {
    rank = "B";
  } else if (percentage >= 50) {
    rank = "C";
  } else {
    rank = "D";
  }

  if (rankScore) {
    rankScore.textContent = rank;

    switch (rank) {
      case "SSS":
        rankScore.style.color = "#f9d731";
        break;
      case "S":
        rankScore.style.color = "#f9d731";
        break;
      case "A":
        rankScore.style.color = "#007bff";
        break;
      case "B":
        rankScore.style.color = "#28a745";
        break;
      case "C":
        rankScore.style.color = "#e59be8";
        break;
      case "D":
        rankScore.style.color = "#dc3545";
        break;
      default:
        rankScore.style.color = "#dc3545";
    }
  }

  const playerName = localStorage.getItem("playerName");
  const scoreData = score;
  const date = new Date().toISOString();

  const payload = {
    name: playerName,
    score: scoreData,
    date: date,
  };

  fetch("/result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      getLeaderboard();
    })
    .catch((error) => {
      console.error("Terjadi kesalahan:", error);
    });
}

closeButton.addEventListener("click", function () {
  score = 0;
  circlesGenerated = 0;
  comboCount = 0;
  updateScore();
  resultModal.style.display = "none";
});

function getLeaderboard() {
  fetch("/leaderboard")
    .then((response) => response.json())
    .then((data) => {
      const leaderboardList = document.getElementById("leaderboard-list");
      leaderboardList.innerHTML = "";

      data.forEach((result, index) => {
        const leaderboardItem = document.createElement("div");
        leaderboardItem.classList.add("leaderboard-list-item");

        let rankStyle = "";
        let crownIcon = "";
        if (index === 0) {
          rankStyle = "color: gold;";
          crownIcon =
            '<i class="fas fa-crown" style="margin-left: 10px; color: gold;"></i>';
        } else if (index === 1) {
          rankStyle = "color: silver;";
        }

        leaderboardItem.innerHTML = `
          <div style="display: flex; align-items: center;">
            <span style="min-width: 30px; ${rankStyle}">${index + 1}</span>
            <span style=" ${rankStyle}">${result.name}</span>
            ${crownIcon}  <!-- Menambahkan ikon mahkota untuk urutan pertama -->
          </div>
          <div>
            <span style=" ${rankStyle}">${result.score}</span>
          </div>
        `;
        leaderboardList.appendChild(leaderboardItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching leaderboard:", error);
    });
}

document.addEventListener("DOMContentLoaded", getLeaderboard);

const leaderboard = document.getElementById("leaderboard");
const toggleBtn = document.getElementById("toggleLeaderboard");

let isOpen = false;

toggleBtn.addEventListener("click", () => {
  if (leaderboard.classList.contains("open")) {
    leaderboard.classList.remove("open");
    leaderboard.classList.add("close");
    toggleBtn.textContent = "☰";
  } else {
    leaderboard.classList.remove("close");
    leaderboard.classList.add("open");
    toggleBtn.textContent = "×";
  }
  isOpen = !isOpen;
});
