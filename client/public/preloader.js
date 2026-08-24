(function () {
  var DURATION = 1000; // bar fills left-to-right in exactly 1s
  var barEl = document.getElementById("loader-bar-fill");
  var loader = document.getElementById("preloader");
  if (!barEl || !loader) return;

  function finishLoading() {
    setTimeout(function () {
      loader.classList.add("loader-hidden");
      setTimeout(function () {
        loader.remove();
      }, 600);
    }, 150); // brief hold at 100% before fading out and opening the site
  }

  window.addEventListener("load", function () {
    // Two rAFs so the browser commits the 0% width first — otherwise
    // the transition from 0% to 100% can get collapsed into one frame.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        barEl.style.width = "100%";
      });
    });
    setTimeout(finishLoading, DURATION);
  });
})();
