document.addEventListener("DOMContentLoaded", function () {
  var loadingOverlay = document.getElementById("loading-overlay");
  var loadingText = document.getElementById("loading-text");
  const loadingBar = document.getElementById("myLoadingBar");

  const images = document.querySelectorAll("img");
  const totalImages = images.length;
  let imagesLoaded = 0;

  function incrementImagesLoaded() {
    imagesLoaded++;
    var percentLoaded = Math.floor((imagesLoaded / totalImages) * 100);

    loadingText.innerText = "Loading" + " (" + percentLoaded + "%)";
    loadingBar.style.width = `${percentLoaded}%`;
    loadingBar.style.setProperty("--loading-bar-width", percentLoaded + "%");

    if (imagesLoaded === totalImages) {
      loadingText.innerText = "Done!";
      setTimeout(function () {
        loadingOverlay.classList.add("loaded");
      }, 1000);
    }
  }

  images.forEach(function (img) {
    if (img.complete) {
      incrementImagesLoaded();
    } else {
      img.addEventListener("load", function () {
        incrementImagesLoaded();
      });
    }
  });

  if (totalImages === 0) {
    loadingText.innerText = "No Assets in Document!";
  }
});
