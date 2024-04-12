document.addEventListener("DOMContentLoaded", function () {
  let loadingOverlay = document.getElementById("loading-overlay");
  let loadingText = document.getElementById("loading-text");
  let loadingSpinner = document.getElementById("loading-spinner");
  let checkmark = document.getElementById("checkmark");
  const loadingBar = document.getElementById("myLoadingBar");

  const images = document.querySelectorAll("img");
  const allTotalImages = images.length;
  const totalImages = Math.ceil(allTotalImages * 0.1);
  let imagesLoaded = 0;
  console.log(totalImages);
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
      }, 1000);
      console.log(imagesLoaded);
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

  if (totalImages === 0) {
    loadingText.innerText = "No Assets in Document!";
  }
});
