// Research highlights carousel on the homepage.
// Each <div class="highlight-slide"> inside .highlights-track is one slide.
// Arrows, dots, swiping and autoplay are added only when there are two or more slides.
(function () {
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function makeButton(className, label, text) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.setAttribute("aria-label", label);
    button.textContent = text;
    return button;
  }

  function init(root) {
    var viewport = root.querySelector(".highlights-viewport");
    var track = root.querySelector(".highlights-track");
    var slides = Array.prototype.slice.call(track.children);
    var count = slides.length;

    if (count < 2) {
      root.classList.add("is-single");
      return;
    }

    var index = 0;
    var timer = null;
    var hovered = false;
    var focused = false;
    var delay = parseInt(root.getAttribute("data-autoplay"), 10) || 0;
    var prev = makeButton("highlights-prev", "Previous highlight", "‹");
    var next = makeButton("highlights-next", "Next highlight", "›");
    var dotsBox = document.createElement("div");
    dotsBox.className = "highlights-dots";

    var dots = slides.map(function (slide, i) {
      Array.prototype.forEach.call(slide.querySelectorAll("a, img"), function (el) {
        el.draggable = false;
      });
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", (i + 1) + " of " + count);
      var dot = makeButton("", "Show highlight " + (i + 1), "");
      dot.addEventListener("click", function () { go(i); restart(); });
      dotsBox.appendChild(dot);
      return dot;
    });

    root.appendChild(prev);
    root.appendChild(next);
    root.appendChild(dotsBox);

    function go(i) {
      index = (i + count) % count;
      track.style.transform = "translateX(" + (-100 * index) + "%)";
      slides.forEach(function (slide, j) {
        var active = j === index;
        slide.setAttribute("aria-hidden", active ? "false" : "true");
        slide.inert = !active;
        dots[j].classList.toggle("is-active", active);
      });
    }

    function stop() {
      clearInterval(timer);
      timer = null;
    }

    function start() {
      if (!delay || reduceMotion || timer || hovered || focused || document.hidden) return;
      timer = setInterval(function () { go(index + 1); }, delay);
    }

    function restart() {
      stop();
      start();
    }

    prev.addEventListener("click", function () { go(index - 1); restart(); });
    next.addEventListener("click", function () { go(index + 1); restart(); });

    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") { go(index - 1); restart(); }
      if (event.key === "ArrowRight") { go(index + 1); restart(); }
    });

    // Pause while the reader is looking at or interacting with the carousel.
    root.addEventListener("mouseenter", function () { hovered = true; stop(); });
    root.addEventListener("mouseleave", function () { hovered = false; start(); });
    root.addEventListener("focusin", function () { focused = true; stop(); });
    root.addEventListener("focusout", function (event) {
      if (root.contains(event.relatedTarget)) return;
      focused = false;
      start();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { stop(); } else { start(); }
    });

    // Swipe left/right; a swipe must not also open the slide's link.
    var startX = null;
    var swiped = false;
    viewport.addEventListener("pointerdown", function (event) {
      startX = event.clientX;
      swiped = false;
    });
    viewport.addEventListener("pointerup", function (event) {
      if (startX === null) return;
      var dx = event.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) {
        swiped = true;
        go(dx < 0 ? index + 1 : index - 1);
        restart();
      }
    });
    viewport.addEventListener("pointercancel", function () { startX = null; });
    viewport.addEventListener("click", function (event) {
      if (swiped) {
        event.preventDefault();
        swiped = false;
      }
    }, true);

    go(0);
    start();
  }

  Array.prototype.forEach.call(document.querySelectorAll(".highlights"), init);
})();
