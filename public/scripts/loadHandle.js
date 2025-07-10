document.addEventListener("DOMContentLoaded", function () {
  function createParticles() {
    const particleContainer = document.querySelector(".bg-particles");
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 6 + "s";
      particle.style.animationDuration = Math.random() * 3 + 3 + "s";
      particleContainer.appendChild(particle);
    }
  }

  let loadingOverlay = document.getElementById("loading-overlay");
  let loadingText = document.getElementById("loading-text");
  let loadingSpinner = document.getElementById("loading-spinner");
  let checkmark = document.getElementById("checkmark");
  const loadingBar = document.getElementById("myLoadingBar");

  const images = document.querySelectorAll("img");
  const allTotalImages = images.length;
  const totalImages = Math.ceil(allTotalImages * 0.1);
  let imagesLoaded = 0;
  function incrementImagesLoaded(imgSrc) {
    imagesLoaded++;
    let percentLoaded = Math.floor((imagesLoaded / totalImages) * 100);

    let imgFileName = imgSrc.substring(imgSrc.lastIndexOf("/") + 1);

    loadingText.innerText =
      "Loading " + imgFileName + " (" + percentLoaded + "%)";
    loadingBar.style.width = `${percentLoaded}%`;
    loadingBar.style.setProperty("--loading-bar-width", percentLoaded + "%");

    if (imagesLoaded === totalImages) {
      loadingText.innerText = "Done!";
      loadingSpinner.style.display = "none";
      checkmark.style.display = "block";

      setTimeout(function () {
        loadingOverlay.classList.add("loaded");
      }, 500);
      setTimeout(function () {
        if (loadingOverlay) {
          loadingOverlay.remove();
        }
      }, 2500);

      setTimeout(function () {}, 2000);
    }
  }

  images.forEach(function (img, index) {
    if (index < totalImages) {
      if (img.complete) {
        incrementImagesLoaded(img.src);
      } else {
        img.addEventListener("load", function () {
          incrementImagesLoaded(img.src);
        });
      }
    }
  });

  // createParticles();

  if (totalImages === 0) {
    loadingText.innerText = "No Assets in Document!";
  }
});
