
import { bodyUnlock, addTouchAttr, addLoadedAttr, isMobile, FLS } from "@js/common/functions.js"

import "./golink.scss"


document.addEventListener("DOMContentLoaded", () => {
	goLink();
});

window.addEventListener("load", () => {
	handleHashScroll();
});

const GO_LINK_OFFSET = 60;
const GO_LINK_DELAY = 200;

function goLink() {
	if (!document.querySelector("[data-fls-golink]")) return;

	document.addEventListener("click", async (e) => {
		const link = e.target.closest("[data-fls-golink]");
		if (!link) return;

		const targetKey = link.dataset.flsGolink?.trim();
		if (!targetKey) return;

		const href = link.getAttribute("href")?.trim() || "";
		const isSamePage = isSamePageHref(href);

		if (isSamePage) {
			e.preventDefault();

			const target = document.querySelector(`[data-goid="${targetKey}"]`);
			if (!target) return;

			const needDelay = closeMenuAndUnlock();

			if (needDelay) {
				await wait(GO_LINK_DELAY);
			}

			scrollToTarget(target, {
				updateHash: true,
			});
		} else {
			closeMenuAndUnlock();
		}
	});
}

function handleHashScroll() {
	const hash = window.location.hash;
	if (!hash) return;

	const targetKey = decodeURIComponent(hash.slice(1)).trim();
	if (!targetKey) return;

	const tryScroll = (attempt = 0) => {
		const target = document.querySelector(`[data-goid="${targetKey}"]`);

		if (target) {
			scrollToTarget(target, {
				updateHash: false,
				duration: getScrollDuration(target),
			});
			return;
		}

		if (attempt < 40) {
			setTimeout(() => tryScroll(attempt + 1), 100);
		}
	};

	requestAnimationFrame(() => {
		setTimeout(() => {
			tryScroll();
		}, 80);
	});
}

function scrollToTarget(target, { updateHash = false, duration = null } = {}) {
	if (!target) return;

	const targetKey = target.dataset.goid?.trim();
	const targetY = getTargetScrollY(target);
	const currentY = window.scrollY;
	const distance = Math.abs(targetY - currentY);

	const finalDuration = duration ?? (
		distance < 300 ? 1.4 :
		distance < 900 ? 1.8 :
		3
	);

	if (updateHash && targetKey) {
		history.pushState(null, "", `#${encodeURIComponent(targetKey)}`);
	}

	if (window.lenis && typeof window.lenis.scrollTo === "function") {
		window.lenis.scrollTo(targetY, {
			duration: finalDuration,
			easing: (t) => 1 - Math.pow(1 - t, 4),
			lock: false,
			force: true,
		});
		return;
	}

	window.scrollTo({
		top: targetY,
		behavior: "smooth",
	});
}

function getTargetScrollY(target) {
	const rect = target.getBoundingClientRect();
	return rect.top + window.scrollY - GO_LINK_OFFSET;
}

function getScrollDuration(target) {
	const targetY = getTargetScrollY(target);
	const currentY = window.scrollY;
	const distance = Math.abs(targetY - currentY);

	if (distance < 300) return 1.4;
	if (distance < 900) return 1.8;
	return 2;
}

function closeMenuAndUnlock() {
	let needDelay = false;

	if (document.documentElement.hasAttribute("data-menu-open")) {
		document.documentElement.removeAttribute("data-menu-open");
	}

	if (document.documentElement.hasAttribute("data-fls-scrolllock")) {
		needDelay = true;
		bodyUnlock(0);
	}

	return needDelay;
}

function isSamePageHref(href) {
	if (!href || href === "#" || href.startsWith("#")) return true;

	try {
		const url = new URL(href, window.location.origin);
		return url.pathname === window.location.pathname;
	} catch {
		return false;
	}
}

function wait(ms = 0) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

