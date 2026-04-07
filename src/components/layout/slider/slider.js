import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
/*
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
*/

import "./slider.scss";
// import 'swiper/css/bundle';

// Ініціалізація слайдерів
function initSliders() {
	if (document.querySelector('.home-hero__slider')) {
		new Swiper('.home-hero__slider', {
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			
			loop: true,
			
			navigation: {
				prevEl: '.home-hero__nav .swiper-button-prev',
				nextEl: '.home-hero__nav .swiper-button-next',
				addIcons: false,
			},
			breakpoints: {
				320: {
					speed: 500,
				},
				480: {
					speed: 800,
				},
			},
			// Події
			on: {

			}
		});
	}

	if (document.querySelector('.home-brands__slider')) {

	const sliderEl = document.querySelector('.home-brands__slider');
	const wrapperEl = sliderEl.querySelector('.swiper-wrapper');

	// считаем только оригинальные слайды
	const originalSlides = Array.from(wrapperEl.children).filter(slide =>
		slide.classList.contains('swiper-slide')
	);

	const originalSlidesCount = originalSlides.length;
	const isDesktop = window.innerWidth > 821;

	// если ширина больше 820 и слайдов <= 4, дублируем все слайды в конец
	if (isDesktop && originalSlidesCount <= 4) {
		originalSlides.forEach(slide => {
			const clone = slide.cloneNode(true);

			clone.classList.remove(
				'swiper-slide-active',
				'swiper-slide-prev',
				'swiper-slide-next',
				'swiper-slide-prev-prev',
				'swiper-slide-next-next'
			);

			wrapperEl.append(clone);
		});
	}

	const brandsSwiper = new Swiper('.home-brands__slider', {
		modules: [Navigation],

		observer: true,
		observeParents: true,
		resizeObserver: true,
		watchOverflow: true,

		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 70,
		speed: 600,

		loop: true,

		navigation: {
			prevEl: '.home-brands__btn.swiper-button-prev',
			nextEl: '.home-brands__btn.swiper-button-next',
			addIcons: false,
		},

		breakpoints: {
			830: {
				slidesPerView: 3,
				slidesPerGroup: 1,
				spaceBetween: 74,
				centeredSlides: true,
			},
		},

		on: {
			init(swiper) {
				updateExtraClasses(swiper);
			},

			slideChange(swiper) {
				updateExtraClasses(swiper);
			},

			breakpoint(swiper) {
				swiper.update();
				updateExtraClasses(swiper);
			},

			resize(swiper) {
				swiper.update();
				updateExtraClasses(swiper);
			},
		},
	});

	window.addEventListener('orientationchange', () => {
		setTimeout(() => {
			brandsSwiper.update();
			updateExtraClasses(brandsSwiper);
		}, 100);
	});

		function updateExtraClasses(swiper) {
			const slides = Array.from(swiper.slides);
		
			slides.forEach(slide => {
				slide.classList.remove('swiper-slide-prev-prev', 'swiper-slide-next-next');
			});
		
			// extra-классы нужны только когда после подготовки слайдов их реально больше 4
			const prevSlide = slides.find(slide => slide.classList.contains('swiper-slide-prev'));
			const nextSlide = slides.find(slide => slide.classList.contains('swiper-slide-next'));
		
			const canAddExtraClass = (slide) => {
				return slide &&
					!slide.classList.contains('swiper-slide-active') &&
					!slide.classList.contains('swiper-slide-prev') &&
					!slide.classList.contains('swiper-slide-next');
			};
		
			const prevPrevSlide = prevSlide ? prevSlide.previousElementSibling : null;
			const nextNextSlide = nextSlide ? nextSlide.nextElementSibling : null;
		
			if (canAddExtraClass(prevPrevSlide)) {
				prevPrevSlide.classList.add('swiper-slide-prev-prev');
			}
		
			if (canAddExtraClass(nextNextSlide)) {
				nextNextSlide.classList.add('swiper-slide-next-next');
			}
		}
	}


	if (document.querySelector('.home-banner__slider')) {
		new Swiper('.home-banner__slider', {
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			speed: 600,

			loop: true,
			navigation: {
				prevEl: '.home-banner__btn.swiper-button-prev',
				nextEl: '.home-banner__btn.swiper-button-next',
				addIcons: false,
			},
			/*
			// Брейкпоінти
			breakpoints: {
				640: {
					slidesPerView: 1,
					spaceBetween: 0,
					autoHeight: true,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1268: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			},
			*/
			// Події
			on: {

			}
		});
	}



	// if (document.querySelector('.swiper')) {
	// 	new Swiper('.swiper', {
	// 		modules: [Navigation],
	// 		observer: true,
	// 		observeParents: true,
	// 		slidesPerView: 1,
	// 		spaceBetween: 0,
	// 		speed: 800,

	// 		//loop: true,

	// 		/*
	// 		// Ефекти
	// 		effect: 'fade',
	// 		autoplay: {
	// 			delay: 3000,
	// 			disableOnInteraction: false,
	// 		},
	// 		*/

	// 		// Пагінація
	// 		/*
	// 		pagination: {
	// 			el: '.swiper-pagination',
	// 			clickable: true,
	// 		},
	// 		*/

	// 		// Скроллбар
	// 		/*
	// 		scrollbar: {
	// 			el: '.swiper-scrollbar',
	// 			draggable: true,
	// 		},
	// 		*/

	// 		// Кнопки "вліво/вправо"
	// 		navigation: {
	// 			prevEl: '.swiper-button-prev',
	// 			nextEl: '.swiper-button-next',
	// 		},
	// 		/*
	// 		// Брейкпоінти
	// 		breakpoints: {
	// 			640: {
	// 				slidesPerView: 1,
	// 				spaceBetween: 0,
	// 				autoHeight: true,
	// 			},
	// 			768: {
	// 				slidesPerView: 2,
	// 				spaceBetween: 20,
	// 			},
	// 			992: {
	// 				slidesPerView: 3,
	// 				spaceBetween: 20,
	// 			},
	// 			1268: {
	// 				slidesPerView: 4,
	// 				spaceBetween: 30,
	// 			},
	// 		},
	// 		*/
	// 		// Події
	// 		on: {

	// 		}
	// 	});
	// }
}
document.querySelector('[data-fls-slider]') ?
	window.addEventListener("load", initSliders) : null