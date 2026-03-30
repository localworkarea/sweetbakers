
import { addTouchAttr, bodyLockStatus, bodyLockToggle, slideToggle,slideDown,slideUp, FLS } from "@js/common/functions.js"

import './header.scss'


export function menuInit() {
	document.addEventListener("click", function (e) {
		if (bodyLockStatus && e.target.closest('[data-menu]')) {
			bodyLockToggle()
			document.documentElement.toggleAttribute("data-menu-open")
		}
	})
}

document.querySelector('[data-menu]') ?
	window.addEventListener('load', menuInit) : null


const subMenuInit = () => {
	const menuItems = document.querySelectorAll('.menu-has-sublist');
	if (!menuItems.length) return;

	menuItems.forEach(item => {
		const link = item.querySelector('.menu-header__link');
		const submenu = item.querySelector('.submenu');

		if (!link || !submenu) return;

		// начальное состояние
		if (submenu.hasAttribute('data-submenu-open')) {
			submenu.hidden = false;
			item.classList.add('--show-submenu');
		} else {
			slideUp(submenu, 0);
		}

		const clickHandler = (e) => {
			e.preventDefault();

			slideToggle(submenu, 300);
			item.classList.toggle('--show-submenu');
		};

		link.addEventListener('click', clickHandler);

		item._submenuHandler = clickHandler;
	});
};

const menuDestroy = () => {
	const menuItems = document.querySelectorAll('.menu-has-sublist');

	if (!menuItems.length) return;

	menuItems.forEach(item => {
		const link = item.querySelector('.menu-header__link');
		const submenu = item.querySelector('.submenu');

		if (!link || !submenu) return;

		// удаляем обработчик
		if (item._submenuHandler) {
			link.removeEventListener('click', item._submenuHandler);
			delete item._submenuHandler;
		}

		// возвращаем как было (показываем)
		submenu.hidden = false;
		submenu.style.removeProperty('height');
		submenu.style.removeProperty('overflow');
		submenu.style.removeProperty('transition-duration');
		submenu.style.removeProperty('transition-property');

		item.classList.remove('--show-submenu');
	});
};

const media = window.matchMedia('(max-width: 62.061em)');

const handleMedia = (e) => {
	if (e.matches) {
		subMenuInit();
	} else {
		menuDestroy();
	}
};

// init
handleMedia(media);

// listener
media.addEventListener('change', handleMedia);


