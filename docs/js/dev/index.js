import "./popup.min.js";
import "./dynamic.min.js";
import "./common.min.js";
function initHeroMedia() {
  const mediaItems = document.querySelectorAll(".home-hero__media");
  if (!mediaItems.length) return;
  const mediaQuery = window.matchMedia("(min-width: 30.186em)");
  let observer = null;
  const playedItems = /* @__PURE__ */ new WeakSet();
  const createVideo = (item) => {
    if (item.querySelector("video")) return;
    const videoSrc = item.dataset.video;
    const posterSrc = item.dataset.poster;
    if (!videoSrc) return;
    item.innerHTML = `
      <video
        class="home-hero__video"
        muted
        playsinline
        preload="metadata"
        ${posterSrc ? `poster="${posterSrc}"` : ""}
      >
        <source src="${videoSrc}" type="video/mp4">
      </video>
    `;
  };
  const removeVideo = (item) => {
    item.innerHTML = "";
  };
  const initObserver = () => {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = entry.target;
          const video = item.querySelector("video");
          if (!video || playedItems.has(item)) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            playedItems.add(item);
            video.play().catch(() => {
            });
            observer.unobserve(item);
          }
        });
      },
      {
        threshold: [0, 0.5, 1]
      }
    );
    mediaItems.forEach((item) => {
      if (item.querySelector("video") && !playedItems.has(item)) {
        observer.observe(item);
      }
    });
  };
  const updateMedia = () => {
    mediaItems.forEach((item) => {
      if (mediaQuery.matches) {
        createVideo(item);
      } else {
        removeVideo(item);
      }
    });
    if (mediaQuery.matches) {
      initObserver();
    } else if (observer) {
      observer.disconnect();
    }
  };
  updateMedia();
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", updateMedia);
  } else {
    mediaQuery.addListener(updateMedia);
  }
}
function initPartnershipSvgStroke() {
  const svgs = document.querySelectorAll(".home-partnership__svg-a");
  if (!svgs.length) return;
  svgs.forEach((svg) => {
    const paths = svg.querySelectorAll("path");
    if (!paths.length) return;
    paths.forEach((path, index) => {
      const length = path.getTotalLength();
      path.style.setProperty("--path-length", `${length}px`);
    });
  });
}
function initPartnersMarqueeDelay() {
  const items = document.querySelectorAll(".partners-marquee__item img");
  if (!items.length) return;
  items.forEach((img, index) => {
    img.style.setProperty("--delay", `${index * 0.05}s`);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  initHeroMedia();
  initPartnershipSvgStroke();
  initPartnersMarqueeDelay();
});
class Parallax {
  constructor(elements) {
    if (elements.length) {
      this.elements = Array.from(elements).map((el) => new Parallax.Each(el, this.options));
    }
  }
  destroyEvents() {
    this.elements.forEach((el) => {
      el.destroyEvents();
    });
  }
  setEvents() {
    this.elements.forEach((el) => {
      el.setEvents();
    });
  }
}
Parallax.Each = class {
  constructor(parent) {
    this.parent = parent;
    this.elements = this.parent.querySelectorAll("[data-fls-parallax]");
    this.animation = this.animationFrame.bind(this);
    this.offset = 0;
    this.value = 0;
    this.smooth = parent.dataset.flsParallaxSmooth ? Number(parent.dataset.flsParallaxSmooth) : 15;
    this.setEvents();
  }
  setEvents() {
    this.animationID = window.requestAnimationFrame(this.animation);
  }
  destroyEvents() {
    window.cancelAnimationFrame(this.animationID);
  }
  animationFrame() {
    const topToWindow = this.parent.getBoundingClientRect().top;
    const heightParent = this.parent.offsetHeight;
    const heightWindow = window.innerHeight;
    const positionParent = {
      top: topToWindow - heightWindow,
      bottom: topToWindow + heightParent
    };
    const centerPoint = this.parent.dataset.flsParallaxCenter ? this.parent.dataset.flsParallaxCenter : "center";
    if (positionParent.top < 30 && positionParent.bottom > -30) {
      switch (centerPoint) {
        // верхній точці (початок батька стикається верхнього краю екрану)
        case "top":
          this.offset = -1 * topToWindow;
          break;
        // центрі екрана (середина батька у середині екрана)
        case "center":
          this.offset = heightWindow / 2 - (topToWindow + heightParent / 2);
          break;
        // Початок: нижня частина екрана = верхня частина батька
        case "bottom":
          this.offset = heightWindow - (topToWindow + heightParent);
          break;
      }
    }
    this.value += (this.offset - this.value) / this.smooth;
    this.animationID = window.requestAnimationFrame(this.animation);
    this.elements.forEach((el) => {
      const parameters = {
        axis: el.dataset.axis ? el.dataset.axis : "v",
        direction: el.dataset.flsParallaxDirection ? el.dataset.flsParallaxDirection + "1" : "-1",
        coefficient: el.dataset.flsParallaxCoefficient ? Number(el.dataset.flsParallaxCoefficient) : 5,
        additionalProperties: el.dataset.flsParallaxProperties ? el.dataset.flsParallaxProperties : ""
      };
      this.parameters(el, parameters);
    });
  }
  parameters(el, parameters) {
    if (parameters.axis == "v") {
      el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`;
    } else if (parameters.axis == "h") {
      el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`;
    }
  }
};
if (document.querySelector("[data-fls-parallax-parent]")) {
  new Parallax(document.querySelectorAll("[data-fls-parallax-parent]"));
}
class MousePRLX {
  constructor(props, data = null) {
    let defaultConfig = {
      init: true
    };
    this.config = Object.assign(defaultConfig, props);
    if (this.config.init) {
      const paralaxMouse = document.querySelectorAll("[data-fls-mouse]");
      if (paralaxMouse.length) {
        this.paralaxMouseInit(paralaxMouse);
      }
    }
  }
  paralaxMouseInit(paralaxMouse) {
    paralaxMouse.forEach((el) => {
      const paralaxMouseWrapper = el.closest("[data-fls-mouse-wrapper]");
      const paramСoefficientX = +el.dataset.flsMouseCx || 100;
      const paramСoefficientY = +el.dataset.flsMouseCy || 100;
      const directionX = el.hasAttribute("data-fls-mouse-dxr") ? -1 : 1;
      const directionY = el.hasAttribute("data-fls-mouse-dyr") ? -1 : 1;
      const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;
      let positionX = 0, positionY = 0;
      let coordXprocent = 0, coordYprocent = 0;
      setMouseParallaxStyle();
      if (paralaxMouseWrapper) {
        mouseMoveParalax(paralaxMouseWrapper);
      } else {
        mouseMoveParalax();
      }
      function setMouseParallaxStyle() {
        const distX = coordXprocent - positionX;
        const distY = coordYprocent - positionY;
        positionX = positionX + distX * paramAnimation / 1e3;
        positionY = positionY + distY * paramAnimation / 1e3;
        el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0) rotate(0.02deg);`;
        requestAnimationFrame(setMouseParallaxStyle);
      }
      function mouseMoveParalax(wrapper = window) {
        wrapper.addEventListener("mousemove", function(e) {
          const offsetTop = el.getBoundingClientRect().top + window.scrollY;
          if (offsetTop >= window.scrollY || offsetTop + el.offsetHeight >= window.scrollY) {
            const parallaxWidth = window.innerWidth;
            const parallaxHeight = window.innerHeight;
            const coordX = e.clientX - parallaxWidth / 2;
            const coordY = e.clientY - parallaxHeight / 2;
            coordXprocent = coordX / parallaxWidth * 100;
            coordYprocent = coordY / parallaxHeight * 100;
          }
        });
      }
    });
  }
}
document.querySelector("[data-fls-mouse]") ? window.addEventListener("load", new MousePRLX({})) : null;
document.addEventListener("DOMContentLoaded", () => {
  marquee();
});
const marquee = () => {
  const $marqueeArray = document.querySelectorAll("[data-fls-marquee]");
  if (!$marqueeArray.length) return;
  const getElSize = ($el) => $el?.offsetWidth || 0;
  const parseMediaAttr = ($wrapper) => {
    const media = $wrapper.getAttribute("data-fls-marquee-media");
    if (!media) return null;
    const parts = media.split(",").map((item) => item.trim());
    if (parts.length !== 2) return null;
    const value = parseFloat(parts[0]);
    const type = parts[1];
    if (isNaN(value) || !["max", "min"].includes(type)) return null;
    return { value, type };
  };
  const createMediaQueryList = ($wrapper) => {
    const mediaData = parseMediaAttr($wrapper);
    if (!mediaData) return null;
    const query = mediaData.type === "max" ? `(max-width: ${mediaData.value}px)` : `(min-width: ${mediaData.value}px)`;
    return window.matchMedia(query);
  };
  const instances = /* @__PURE__ */ new Map();
  const createMarquee = ($wrapper) => {
    if (instances.has($wrapper)) return;
    const hasValidSizes = () => {
      if (!$wrapper || !$marqueeInner) return false;
      const wrapperWidth = getElSize($wrapper);
      if (wrapperWidth <= 0) return false;
      const children = Array.from($marqueeInner.children);
      if (!children.length) return false;
      const hasRealItemSize = children.some((item) => getElSize(item) > 0);
      return hasRealItemSize;
    };
    const ATTR = {
      inner: "data-fls-marquee-inner",
      item: "data-fls-marquee-item"
    };
    let $marqueeInner = null;
    let $items = null;
    const dataMarqueeSpace = parseFloat($wrapper.getAttribute("data-fls-marquee-space"));
    const speed = parseFloat($wrapper.getAttribute("data-fls-marquee-speed")) / 10 || 100;
    const direction = $wrapper.getAttribute("data-fls-marquee-direction");
    const isReverse = direction === "right";
    const isDraggable = $wrapper.hasAttribute("data-fls-marquee-drag");
    let currentX = 0;
    let lastFrameTime = performance.now();
    let firstScreenVisibleSize = 0;
    let isDragging = false;
    let isPaused = false;
    let startX = 0;
    let startY = 0;
    let dragStartX = 0;
    let velocity = 0;
    let cacheArray = [];
    let rafId = null;
    let onPointerDown = null;
    let onPointerMove = null;
    let onPointerUp = null;
    let onMouseLeave = null;
    let onMouseEnterPause = null;
    let onMouseLeavePause = null;
    const buildStructure = () => {
      const $existingInner = $wrapper.querySelector(`[${ATTR.inner}]`);
      if ($existingInner) {
        $marqueeInner = $existingInner;
        $items = $marqueeInner.querySelectorAll(`[${ATTR.item}]`);
        return !!$items.length;
      }
      const $children = Array.from($wrapper.children);
      if (!$children.length) return false;
      $children.forEach(($el) => $el.setAttribute(ATTR.item, ""));
      $wrapper.innerHTML = `<div ${ATTR.inner}>${$wrapper.innerHTML}</div>`;
      $marqueeInner = $wrapper.querySelector(`[${ATTR.inner}]`);
      $items = $wrapper.querySelectorAll(`[${ATTR.item}]`);
      return !!$marqueeInner && !!$items.length;
    };
    if (!buildStructure()) return;
    const itemMargin = parseFloat(getComputedStyle($items[0]).getPropertyValue("margin-right")) || 0;
    const spaceBetween = !isNaN(itemMargin) ? itemMargin : !isNaN(dataMarqueeSpace) ? dataMarqueeSpace : 30;
    const addDuplicateElements = () => {
      const parentWidth = getElSize($wrapper);
      if (parentWidth <= 0) return false;
      let sumSize = 0;
      firstScreenVisibleSize = 0;
      let $children = Array.from($marqueeInner.children);
      if (!cacheArray.length) {
        cacheArray = $children.map(($item) => $item.cloneNode(true));
      } else {
        $children = cacheArray.map(($item) => $item.cloneNode(true));
      }
      $marqueeInner.style.display = "flex";
      $marqueeInner.innerHTML = "";
      $children.slice().reverse().forEach(($item) => {
        const $clone = $item.cloneNode(true);
        $clone.style.marginRight = `${spaceBetween}px`;
        $clone.style.flexShrink = 0;
        $marqueeInner.insertBefore($clone, $marqueeInner.firstChild);
      });
      $children.forEach(($item) => {
        $item.style.marginRight = `${spaceBetween}px`;
        $item.style.flexShrink = 0;
        $marqueeInner.append($item);
        const size = getElSize($item);
        if (size <= 0) return;
        sumSize += size + spaceBetween;
        firstScreenVisibleSize += size + spaceBetween;
      });
      if (firstScreenVisibleSize <= 0) {
        $marqueeInner.innerHTML = "";
        cacheArray.forEach(($item) => {
          const $clone = $item.cloneNode(true);
          $clone.style.marginRight = `${spaceBetween}px`;
          $clone.style.flexShrink = 0;
          $marqueeInner.append($clone);
        });
        return false;
      }
      const targetSize = parentWidth * 2 + firstScreenVisibleSize;
      let index = 0;
      let safety = 0;
      while (sumSize < targetSize && $children.length > 0) {
        if (!$children[index]) index = 0;
        const $clone = $children[index].cloneNode(true);
        $clone.style.marginRight = `${spaceBetween}px`;
        $clone.style.flexShrink = 0;
        $marqueeInner.appendChild($clone);
        const size = getElSize($clone);
        if (size <= 0) {
          if (++safety > 2e3) break;
          index++;
          continue;
        }
        sumSize += size + spaceBetween;
        index++;
        if (++safety > 2e3) break;
      }
      if (firstScreenVisibleSize <= 0) return false;
      return true;
    };
    const render = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;
      lastFrameTime = now;
      const easing = 0.05;
      const maxSpeed = (isReverse ? 1 : -1) * (speed / 1e3);
      const targetSpeed = isDragging || isPaused ? 0 : maxSpeed;
      velocity += (targetSpeed - velocity) * easing;
      currentX += velocity * delta;
      if (currentX <= -firstScreenVisibleSize * 2) {
        currentX += firstScreenVisibleSize;
      }
      if (currentX >= -firstScreenVisibleSize) {
        currentX -= firstScreenVisibleSize;
      }
      $marqueeInner.style.transform = `translateX(${currentX}px)`;
      rafId = requestAnimationFrame(render);
    };
    const initDrag = () => {
      $marqueeInner.style.cursor = isDraggable ? "grab" : "";
      if (isDraggable) $marqueeInner.style.touchAction = "pan-y";
      if (!isDraggable) return;
      const getPointerX = (e) => e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
      const getPointerY = (e) => e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;
      let isPointerDown = false;
      let lockAxis = null;
      const moveThreshold = 6;
      const angleRatio = 1.2;
      let dragStartTime = 0;
      onPointerDown = (e) => {
        isPointerDown = true;
        isDragging = false;
        lockAxis = null;
        startX = getPointerX(e);
        startY = getPointerY(e);
        dragStartX = currentX;
        dragStartTime = performance.now();
        if (e.type === "mousedown") e.preventDefault();
        $marqueeInner.style.cursor = "grabbing";
        window.addEventListener("mousemove", onPointerMove, { passive: false });
        window.addEventListener("mouseup", onPointerUp, { passive: true });
        window.addEventListener("touchmove", onPointerMove, { passive: false });
        window.addEventListener("touchend", onPointerUp, { passive: true });
        window.addEventListener("touchcancel", onPointerUp, { passive: true });
      };
      onPointerMove = (e) => {
        if (!isPointerDown) return;
        const x = getPointerX(e);
        const y = getPointerY(e);
        const dx = x - startX;
        const dy = y - startY;
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        if (!lockAxis) {
          if (adx < moveThreshold && ady < moveThreshold) return;
          if (adx > ady * angleRatio) {
            lockAxis = "x";
            isDragging = true;
            isPaused = true;
            dragStartX = currentX;
            startX = x;
            startY = y;
          } else if (ady > adx * angleRatio) {
            lockAxis = "y";
          } else {
            return;
          }
        }
        if (lockAxis === "y") return;
        if (e.cancelable) e.preventDefault();
        const delta = x - startX;
        currentX = dragStartX + delta;
      };
      onPointerUp = () => {
        if (isDragging) {
          const dragDistance = currentX - dragStartX;
          const dragDuration = Math.max(performance.now() - dragStartTime, 16);
          const rawVelocity = dragDistance / dragDuration;
          const maxInertia = 1.5;
          const minThreshold = 0.1;
          velocity = Math.abs(rawVelocity) > minThreshold ? Math.max(-maxInertia, Math.min(maxInertia, rawVelocity)) : 0;
        }
        isPointerDown = false;
        isDragging = false;
        lockAxis = null;
        isPaused = false;
        $marqueeInner.style.cursor = "grab";
        window.removeEventListener("mousemove", onPointerMove);
        window.removeEventListener("mouseup", onPointerUp);
        window.removeEventListener("touchmove", onPointerMove);
        window.removeEventListener("touchend", onPointerUp);
        window.removeEventListener("touchcancel", onPointerUp);
      };
      onMouseLeave = () => {
        if (document.pointerLockElement) return;
        if (!isPointerDown) return;
        onPointerUp();
      };
      $marqueeInner.addEventListener("mousedown", onPointerDown);
      $marqueeInner.addEventListener("touchstart", onPointerDown, { passive: true });
      $marqueeInner.addEventListener("mouseleave", onMouseLeave);
    };
    const destroy = () => {
      cancelAnimationFrame(rafId);
      rafId = null;
      currentX = 0;
      velocity = 0;
      isDragging = false;
      isPaused = false;
      if ($marqueeInner) {
        $marqueeInner.style.cursor = "";
        $marqueeInner.style.touchAction = "";
        $marqueeInner.style.transform = "";
        if (onPointerDown) {
          $marqueeInner.removeEventListener("mousedown", onPointerDown);
          $marqueeInner.removeEventListener("touchstart", onPointerDown);
        }
        if (onMouseLeave) {
          $marqueeInner.removeEventListener("mouseleave", onMouseLeave);
        }
        if (onMouseEnterPause) {
          $marqueeInner.removeEventListener("mouseenter", onMouseEnterPause);
        }
        if (onMouseLeavePause) {
          $marqueeInner.removeEventListener("mouseleave", onMouseLeavePause);
        }
        const originalItems = cacheArray.length ? cacheArray.map(($item) => $item.cloneNode(true)) : Array.from($marqueeInner.querySelectorAll(`[${ATTR.item}]`)).slice(0, $items.length).map(($item) => $item.cloneNode(true));
        $wrapper.innerHTML = "";
        originalItems.forEach(($item) => {
          $item.removeAttribute(ATTR.item);
          $item.style.marginRight = "";
          $item.style.flexShrink = "";
          $wrapper.appendChild($item);
        });
      }
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("touchcancel", onPointerUp);
      instances.delete($wrapper);
    };
    const init = () => {
      let attempts = 0;
      const maxAttempts = 60;
      const tryInit = () => {
        attempts++;
        if (!hasValidSizes()) {
          if (attempts < maxAttempts) {
            requestAnimationFrame(tryInit);
          }
          return;
        }
        const isReady = addDuplicateElements();
        if (!isReady || firstScreenVisibleSize <= 0) {
          if (attempts < maxAttempts) {
            requestAnimationFrame(tryInit);
          }
          return;
        }
        currentX = 0;
        velocity = 0;
        isDragging = false;
        isPaused = false;
        lastFrameTime = performance.now();
        initDrag();
        if ($wrapper.hasAttribute("data-fls-marquee-pause")) {
          onMouseEnterPause = () => {
            if (!isDragging) isPaused = true;
          };
          onMouseLeavePause = () => {
            isPaused = false;
          };
          $marqueeInner.addEventListener("mouseenter", onMouseEnterPause);
          $marqueeInner.addEventListener("mouseleave", onMouseLeavePause);
        }
        rafId = requestAnimationFrame(render);
      };
      tryInit();
    };
    init();
    instances.set($wrapper, {
      destroy
    });
  };
  const destroyMarquee = ($wrapper) => {
    const instance = instances.get($wrapper);
    if (!instance) return;
    instance.destroy();
  };
  $marqueeArray.forEach(($wrapper) => {
    const mediaQueryList = createMediaQueryList($wrapper);
    let initRaf1 = null;
    let initRaf2 = null;
    const runCreate = () => {
      cancelAnimationFrame(initRaf1);
      cancelAnimationFrame(initRaf2);
      destroyMarquee($wrapper);
      initRaf1 = requestAnimationFrame(() => {
        initRaf2 = requestAnimationFrame(() => {
          createMarquee($wrapper);
        });
      });
    };
    const runDestroy = () => {
      cancelAnimationFrame(initRaf1);
      cancelAnimationFrame(initRaf2);
      destroyMarquee($wrapper);
    };
    if (!mediaQueryList) {
      runCreate();
      return;
    }
    const handleMediaChange = (e) => {
      if (e.matches) {
        runCreate();
      } else {
        runDestroy();
      }
    };
    handleMediaChange(mediaQueryList);
    mediaQueryList.addEventListener("change", handleMediaChange);
  });
  window.addEventListener("beforeunload", () => {
    $marqueeArray.forEach(($wrapper) => destroyMarquee($wrapper));
  });
};
