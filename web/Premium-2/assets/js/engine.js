/* ==========================================================================
   ENGINE.JS — Scroll-Driven Animation Engine (do not edit)
   ==========================================================================
   This file makes the invitation "scroll = zoom/pan/fade through scenes"
   behavior work. It reads the data in scenes.js and, on every scroll
   event, smoothly interpolates each element's transform/opacity between
   keyframes.

   You should not need to touch this file. To change WHAT happens, edit
   scenes.js (the animation data) or config.js (the content). To change
   HOW it looks, edit css/style.css.
   ========================================================================== */

const elementCache = {
  scrollContainer: null,
  scrollContent: null,
  stage: null,
  elements: new Map(),
  debugText: null,
};

// IDs of the elements that live on the fixed "stage" (the zoom/pan layer
// pinned behind the scrollable content). Order doesn't matter for layout
// since z-index/positioning is controlled in CSS + inline styles.
const STAGE_ELEMENT_IDS = [
  "cover",
  "guest",
  "quotes",
  "bride",
  "groom",
  "events",
  "dresscode",
  "verse",
];

/* ==========================================================================
   COUPLE REVEAL ORDER — reads CONFIG.coupleRevealOrder (config.js) and, if
   set to "bride-first", swaps the animation timing between the "bride" and
   "groom" elements across every scene in scenes.js so the bride's name
   reveals first instead of the groom's.

   HOW IT WORKS: in scenes.js, whichever scene object currently has a
   "groom" key controls WHEN/WHERE the groom's name appears (and likewise
   for "bride"). This function walks every scene and, wherever it finds a
   "groom" and/or "bride" key, swaps their VALUES (the actual keyframe
   timing) while leaving everything else untouched. The "bride" DOM element
   (which always shows the bride's own name/photo/Instagram, filled in by
   app.js from CONFIG) ends up animating on whatever timeline used to
   belong to "groom" — i.e. it now appears first — and vice versa.

   You never need to touch this function — just change
   CONFIG.coupleRevealOrder in config.js.
   ========================================================================== */
function applyCoupleRevealOrder() {
  if (CONFIG.coupleRevealOrder !== "bride-first") return; // "groom-first" = default scenes.js order, nothing to do

  scenes.forEach((scene) => {
    const hasGroom = Object.prototype.hasOwnProperty.call(scene, "groom");
    const hasBride = Object.prototype.hasOwnProperty.call(scene, "bride");
    if (!hasGroom && !hasBride) return;

    const groomData = scene.groom;
    const brideData = scene.bride;

    if (hasGroom) {
      scene.bride = groomData;
    } else {
      delete scene.bride;
    }

    if (hasBride) {
      scene.groom = brideData;
    } else {
      delete scene.groom;
    }
  });
}

function initialize() {
  applyCoupleRevealOrder();

  elementCache.scrollContainer = document.getElementById("scrollContainer");
  elementCache.scrollContent = document.getElementById("scrollContent");
  elementCache.stage = document.getElementById("stage");
  elementCache.debugText = document.getElementById("debugText");

  // Build one empty full-height "section" per scene, so the page has the
  // correct total scroll height. The very last section also receives the
  // rest of the page (RSVP, gallery, gift, footer, etc.) via #lastContainer.
  for (let i = 0; i <= scenes.length; i++) {
    const section = document.createElement("div");
    section.className = "scroll-section";
    section.id = "section-" + i;
    elementCache.scrollContent.appendChild(section);
    if (i == scenes.length) {
      const lastContainer = document.getElementById("lastContainer");
      if (lastContainer) section.appendChild(lastContainer);
    }
  }

  // Move the animated "stage" elements (cover, guest greeting, quotes,
  // bride/groom names, event details, dresscode, verse) into the fixed
  // stage layer so they can be transformed independently of scroll.
  STAGE_ELEMENT_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      elementCache.stage.appendChild(el);
      elementCache.elements.set(id, el);
    }
  });

  // Register every element marked .animated-element (this also covers any
  // extra decorative elements like background/foreground flowers) and flag
  // which ones contain clickable children (links/buttons) so their pointer
  // events can be toggled based on visibility.
  document.querySelectorAll(".animated-element").forEach((el) => {
    elementCache.elements.set(el.id, el);
    el.hasClickableChildren = el.querySelectorAll(".clickable").length > 0;
  });

  const musicButton = document.getElementById("music-button");
  if (musicButton) {
    document.getElementById("mobileContainer").appendChild(musicButton);
  }

  // One-time default: hide every registered element until its own scene
  // explicitly gives it a position/opacity. Without this, elements whose
  // first appearance is several scenes away sit at the browser's default
  // (visible, untransformed) and pile up on screen before their turn.
  // This runs ONCE (not every frame) so elements that are intentionally
  // meant to persist across scenes (bg, flowers, couple, bottomGradient)
  // keep whatever value their own keyframes last set, instead of being
  // force-hidden whenever a later scene doesn't happen to mention them.
  elementCache.elements.forEach((el) => {
    el.style.opacity = 0;
    if (el.hasClickableChildren) {
      el.querySelectorAll(".clickable").forEach((child) => {
        child.style.pointerEvents = "none";
      });
    }
  });

  updateSceneProgress(0);
  initializeCoverButton();
  requestAnimationFrame(animate);
}

function initializeCoverButton() {
  const coverButton = document.getElementById("coverButton");
  const arrowDown = document.getElementById("arrowDown");

  // Lock scrolling until the user taps "Open Invitation".
  elementCache.scrollContainer.style.overflowY = "hidden";
  arrowDown.style.display = "none";

  coverButton.addEventListener("click", () => {
    elementCache.scrollContainer.style.overflowY = "scroll";

    // Auto-advance one viewport height so the cover animation starts.
    const currentTop = elementCache.scrollContainer.scrollTop;
    const viewportHeight = window.innerHeight;
    elementCache.scrollContainer.scrollTo({
      top: currentTop + viewportHeight,
      behavior: "smooth",
    });

    coverButton.style.display = "none";
    arrowDown.style.display = "inline";

    let ticking = false;
    elementCache.scrollContainer.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    if (typeof playBackgroundMusic === "function") playBackgroundMusic();
  });
}

let currentSceneIndex = 0;
let currentScrollProgress = 0;
let targetScrollProgress = 0;
let isScrolling = false;

function handleScroll() {
  const viewportHeight = elementCache.scrollContainer.clientHeight;
  targetScrollProgress = Math.min(
    Math.max(0, elementCache.scrollContainer.scrollTop / viewportHeight),
    scenes.length
  );
  updateStageVisibility();
}

// Past the last defined scene, the page becomes a normal scrolling page
// (countdown+RSVP overlay, gallery, gift, footer). This checks the raw
// scroll fraction directly (not the eased currentScrollProgress / scene
// index) because the eased value only asymptotically approaches the
// clamped max and may never actually reach it.
//
// NOTE: the stage's opacity is deliberately NOT faded to 0 here anymore.
// The countdown+RSVP overlay (".overlay-panel" in style.css) is a
// translucent veil meant to let the couple/reeds photo — still sitting on
// the stage (bg/flower1/flower2/flower3/couple) — show through it, so the
// stage needs to stay visible past the last scene now. #lastContainer is
// raised above the stage in z-index (see style.css) so its own content
// (countdown, RSVP, gallery, gift, footer) still receives taps/clicks
// normally even though the stage renders underneath it.
function updateStageVisibility() {
  const viewportHeight = elementCache.scrollContainer.clientHeight;
  const rawProgress = elementCache.scrollContainer.scrollTop / viewportHeight;
  const pastLastScene = rawProgress >= scenes.length - 0.02;

  // Pointer events on the stage's own leftover buttons/links (cover button,
  // Instagram links, etc. — already faded to opacity 0 by this point in the
  // scroll) are still turned off here, just so they can't be tabbed/tapped
  // into by accident once they're invisible.
  elementCache.stage.style.pointerEvents = pastLastScene ? "none" : "";

  // The final section (countdown/RSVP/gallery/footer) is much taller than
  // one viewport and needs to scroll freely. Mandatory scroll-snap keeps
  // pulling it back to its top the moment a scroll gesture ends anywhere
  // inside it, which feels like the page is "stuck" at the countdown.
  // Turn snapping off once the user has scrolled into that section.
  const enteredLastSection = rawProgress >= scenes.length - 0.5;
  elementCache.scrollContainer.style.scrollSnapType = enteredLastSection
    ? "none"
    : "";
}

function animate() {
  const smoothingFactor = scenes[currentSceneIndex]?.smoothingFactor ?? 0.015;
  currentScrollProgress +=
    (targetScrollProgress - currentScrollProgress) * smoothingFactor;

  if (Math.abs(targetScrollProgress - currentScrollProgress) > 0.001) {
    updateSceneProgress(currentScrollProgress);
    isScrolling = true;
  } else if (isScrolling) {
    isScrolling = false;
    snapToNearestScene();
  }

  requestAnimationFrame(animate);
}

function snapToNearestScene() {
  const nearestScene = Math.round(targetScrollProgress);
  if (Math.abs(targetScrollProgress - nearestScene) > 0.1) {
    elementCache.scrollContainer.scrollTo({
      top: nearestScene * window.innerHeight,
      behavior: "smooth",
    });
  }
}

function updateSceneProgress(scrollValue) {
  currentSceneIndex = Math.floor(scrollValue);
  const sceneProgress = scrollValue - currentSceneIndex;

  if (elementCache.debugText) {
    elementCache.debugText.innerHTML =
      "Current Scene: " +
      currentSceneIndex +
      "<br>Scene Progress: " +
      sceneProgress.toFixed(2) +
      "<br>Overall Progress: " +
      scrollValue.toFixed(2);
  }

  const scene = scenes[currentSceneIndex];
  if (!scene) return;

  Object.entries(scene).forEach(([elementId, config]) => {
    if (!config.keyframes) return; // skips "smoothingFactor" entry

    const el = elementCache.elements.get(elementId);
    if (!el) return;

    const value = getValueAtProgress(config.keyframes, sceneProgress, config.speed);

    el.style.transform =
      "translate(" + value.x + "px," + value.y + "px) scale(" + value.scale + ") rotate(" + value.rotate + "deg)";
    el.style.opacity = value.opacity;
    el.style.zIndex = config.zIndex ?? "auto";

    if (el.hasClickableChildren) {
      const pointerEvents = value.opacity > 0.5 ? "auto" : "none";
      el.querySelectorAll(".clickable").forEach((child) => {
        child.style.pointerEvents = pointerEvents;
      });
    }
  });
}

function getValueAtProgress(keyframes, sceneProgress, speed = 1) {
  const adjustedProgress = Math.min(1, sceneProgress * (1 + (speed - 1) * 0.1));

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (
      adjustedProgress >= keyframes[i].progress &&
      adjustedProgress <= keyframes[i + 1].progress
    ) {
      const t =
        (adjustedProgress - keyframes[i].progress) /
        (keyframes[i + 1].progress - keyframes[i].progress);

      return {
        x: lerp(keyframes[i].x, keyframes[i + 1].x, t),
        y: lerp(keyframes[i].y, keyframes[i + 1].y, t),
        scale: lerp(keyframes[i].scale, keyframes[i + 1].scale, t),
        rotate: lerp(keyframes[i].rotate, keyframes[i + 1].rotate, t),
        opacity: lerp(keyframes[i].opacity, keyframes[i + 1].opacity, t),
      };
    }
  }
  return keyframes[keyframes.length - 1];
}

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

window.addEventListener("load", initialize);
