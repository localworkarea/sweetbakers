document.addEventListener("click", onProductCardClick);
function onProductCardClick(e) {
  const trigger = e.target.closest('[data-prod] [data-fls-popup-link="popup-product"]');
  if (!trigger) return;
  const productCard = trigger.closest("[data-prod]");
  if (!productCard) return;
  const modal = document.querySelector('[data-fls-popup="popup-product"]');
  if (!modal) return;
  fillProductModal(productCard, modal);
}
function fillProductModal(productCard, modal) {
  const productInfo = productCard.querySelector("[data-prod-info]");
  if (!productInfo) return;
  const modalHead = modal.querySelector("[data-modal-head]");
  const modalTitle = modal.querySelector("[data-modal-title]");
  const modalSubtitle = modal.querySelector("[data-modal-subtitle]");
  const modalDescriptionWrap = modal.querySelector("[data-modal-description-wrap]");
  const modalDescription = modal.querySelector("[data-modal-description]");
  const modalBlock1 = modal.querySelector("[data-modal-block-1]");
  const modalWeightRow = modal.querySelector("[data-modal-weight-row]");
  const modalLifeRow = modal.querySelector("[data-modal-life-row]");
  const modalWeight = modal.querySelector("[data-modal-weight]");
  const modalLife = modal.querySelector("[data-modal-life]");
  const modalBlock2 = modal.querySelector("[data-modal-block-2]");
  const modalImage = modal.querySelector("[data-modal-image]");
  const title = getText(productInfo, "[data-prod-title]");
  const subtitle = getText(productInfo, "[data-prod-subtitle]");
  const description = getHTML(productInfo, "[data-prod-description]");
  const weight = getText(productInfo, "[data-prod-weight]");
  const shelfLife = getText(productInfo, "[data-prod-shelf-life]");
  if (modalTitle) {
    modalTitle.textContent = title || "";
  }
  if (modalSubtitle) {
    if (subtitle) {
      modalSubtitle.textContent = subtitle;
      showElement(modalSubtitle);
    } else {
      modalSubtitle.textContent = "";
      hideElement(modalSubtitle);
    }
  }
  if (modalHead) {
    const hasHeadContent = !!title || !!subtitle;
    toggleElement(modalHead, hasHeadContent);
  }
  if (modalDescription) {
    if (description) {
      modalDescription.innerHTML = description;
      showElement(modalDescriptionWrap);
    } else {
      modalDescription.innerHTML = "";
      hideElement(modalDescriptionWrap);
    }
  }
  if (modalWeight) {
    modalWeight.textContent = weight || "";
  }
  if (modalLife) {
    modalLife.textContent = shelfLife || "";
  }
  if (modalWeightRow) {
    toggleElement(modalWeightRow, !!weight);
  }
  if (modalLifeRow) {
    toggleElement(modalLifeRow, !!shelfLife);
  }
  if (modalBlock1) {
    toggleElement(modalBlock1, !!weight || !!shelfLife);
  }
  renderModalPacks(productInfo, modalBlock2);
  fillModalImage(productCard, modalImage);
}
function renderModalPacks(productInfo, modalBlock2) {
  if (!modalBlock2) return;
  const modalBoxes = modalBlock2.querySelector(".popup-product__boxes");
  if (!modalBoxes) {
    hideElement(modalBlock2);
    return;
  }
  modalBoxes.innerHTML = "";
  const productPacks = productInfo.querySelectorAll("[data-prod-pack]");
  if (!productPacks.length) {
    hideElement(modalBlock2);
    return;
  }
  let hasAtLeastOnePack = false;
  productPacks.forEach((pack) => {
    const packType = getText(pack, "[data-prod-pack-type]");
    const packValue = getText(pack, "[data-prod-pack-value]");
    const packImage = pack.getAttribute("data-prod-pack-image")?.trim() || "";
    if (!packType && !packValue && !packImage) return;
    const packBox = document.createElement("div");
    packBox.className = "popup-product__box";
    if (packImage) {
      const img = document.createElement("img");
      img.className = "popup-product__box-img";
      img.src = packImage;
      img.width = 60;
      img.height = 60;
      img.alt = "Image";
      packBox.appendChild(img);
    }
    if (packType) {
      const type = document.createElement("div");
      type.className = "popup-product__box-t";
      type.textContent = packType;
      packBox.appendChild(type);
    }
    if (packValue) {
      const value = document.createElement("div");
      value.className = "popup-product__box-c";
      value.textContent = packValue;
      packBox.appendChild(value);
    }
    modalBoxes.appendChild(packBox);
    hasAtLeastOnePack = true;
  });
  toggleElement(modalBlock2, hasAtLeastOnePack);
}
function fillModalImage(productCard, modalImage) {
  if (!modalImage) return;
  const modalSource = modalImage.querySelector("source");
  const modalImg = modalImage.querySelector("img");
  const productSource = productCard.querySelector(".product-card__image source");
  const productImg = productCard.querySelector(".product-card__image img");
  const mobSrc = productSource?.getAttribute("srcset")?.trim() || "";
  const pcSrc = productImg?.getAttribute("src")?.trim() || "";
  const alt = productImg?.getAttribute("alt")?.trim() || "image";
  if (!mobSrc && !pcSrc) {
    if (modalSource) modalSource.removeAttribute("srcset");
    if (modalImg) {
      modalImg.removeAttribute("src");
      modalImg.setAttribute("alt", "image");
    }
    hideElement(modalImage);
    return;
  }
  if (modalSource) {
    if (mobSrc) {
      modalSource.setAttribute("srcset", mobSrc);
    } else {
      modalSource.removeAttribute("srcset");
    }
  }
  if (modalImg) {
    if (pcSrc) {
      modalImg.setAttribute("src", pcSrc);
    } else {
      modalImg.removeAttribute("src");
    }
    modalImg.setAttribute("alt", alt);
  }
  showElement(modalImage);
}
function getText(parent, selector) {
  const el = parent.querySelector(selector);
  return el?.textContent?.trim() || "";
}
function getHTML(parent, selector) {
  const el = parent.querySelector(selector);
  return el?.innerHTML?.trim() || "";
}
function hideElement(element) {
  if (!element) return;
  element.hidden = true;
}
function showElement(element) {
  if (!element) return;
  element.hidden = false;
}
function toggleElement(element, state) {
  if (!element) return;
  element.hidden = !state;
}
document.addEventListener("DOMContentLoaded", () => {
  initProductCardImageFrames();
});
function initProductCardImageFrames() {
  const updateFrames = debounce(setProductCardImageFrames, 120);
  updateFrames();
  window.addEventListener("load", updateFrames);
  window.addEventListener("resize", updateFrames);
  const images = document.querySelectorAll(".product-card__image img");
  images.forEach((img) => {
    if (img.complete) return;
    img.addEventListener("load", updateFrames);
  });
}
function setProductCardImageFrames() {
  const productLists = document.querySelectorAll(".products__list");
  if (!productLists.length) return;
  const isDesktop = window.matchMedia("(min-width: 51.311em)").matches;
  const itemsPerRow = isDesktop ? 3 : 2;
  productLists.forEach((list) => {
    const cards = Array.from(list.querySelectorAll(".product-card"));
    if (!cards.length) return;
    const imageBlocks = cards.map((card) => card.querySelector(".product-card__image")).filter(Boolean);
    imageBlocks.forEach((image) => {
      image.style.minHeight = "";
    });
    for (let i = 0; i < cards.length; i += itemsPerRow) {
      const rowCards = cards.slice(i, i + itemsPerRow);
      const rowImages = rowCards.map((card) => card.querySelector(".product-card__image")).filter(Boolean);
      if (!rowImages.length) continue;
      let maxHeight = 0;
      rowImages.forEach((image) => {
        const currentHeight = image.offsetHeight;
        if (currentHeight > maxHeight) {
          maxHeight = currentHeight;
        }
      });
      rowImages.forEach((image) => {
        image.style.minHeight = `${maxHeight}px`;
      });
    }
  });
}
function debounce(fn, delay = 100) {
  let timeout = null;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
