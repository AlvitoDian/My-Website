window.addEventListener("load", function () {
  var loadingOverlay = document.getElementById("loading-overlay");
  var loadingText = document.getElementById("loading-text");
  const loadingBar = document.getElementById("myLoadingBar");
  var progress = 0;

  function updateProgress(textStatus) {
    progress += 25;
    loadingText.textContent = textStatus + " (" + progress + "%)";
    loadingBar.style.setProperty("--loading-bar-width", progress + "%");
  }

  updateProgress("HTML Loaded");
  setTimeout(function () {
    updateProgress("Loading CSS");
    setTimeout(function () {
      updateProgress("Loading Javscript");
      setTimeout(function () {
        updateProgress("Loading Images");
        setTimeout(function () {
          loadingText.textContent = "Done";
          loadingOverlay.classList.add("loaded");
        }, 500);
      }, 500);
    }, 500);
  }, 500);
});
