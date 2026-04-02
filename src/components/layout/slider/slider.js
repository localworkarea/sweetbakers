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
	const isDesktop = window.innerWidth > 820;

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
			820: {
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

	// .home-brands__slider c инициализацией по 4 слайда, с клонированием..
	// if (document.querySelector('.home-brands__slider')) {
	// 	const sliderEl = document.querySelector('.home-brands__slider');
	// 	const wrapperEl = sliderEl.querySelector('.swiper-wrapper');

	// 	// считаем только оригинальные слайды
	// 	const originalSlides = Array.from(wrapperEl.children).filter(el =>
	// 		el.classList.contains('swiper-slide')
	// 	);

	// 	const originalSlidesCount = originalSlides.length;

	// 	// если исходно 4 слайда — дублируем их в конец
	// 	if (originalSlidesCount === 4) {
	// 		originalSlides.forEach(slide => {
	// 			const clone = slide.cloneNode(true);
	// 			clone.classList.remove(
	// 				'swiper-slide-active',
	// 				'swiper-slide-prev',
	// 				'swiper-slide-next',
	// 				'swiper-slide-prev-prev',
	// 				'swiper-slide-next-next',
	// 				'is-left',
	// 				'is-center',
	// 				'is-right'
	// 			);
	// 			wrapperEl.append(clone);
	// 		});
	// 	}

	// 	const renderedSlidesCount = wrapperEl.querySelectorAll('.swiper-slide').length;
	// 	const isMobile = window.innerWidth < 820;

	// 	const hasMoreThanThreeSlides = originalSlidesCount > 3;
	// 	const isExactlyThreeSlides = originalSlidesCount === 3;

	// 	// loop:
	// 	// > 3 слайдов — включаем
	// 	// 3 слайда — только на мобилке
	// 	const shouldEnableLoop = hasMoreThanThreeSlides || (isExactlyThreeSlides && isMobile);

	// 	// centeredSlides:
	// 	// только если исходно слайдов больше 3
	// 	const shouldCenterSlides = hasMoreThanThreeSlides;

	// 	const brandsSwiper = new Swiper('.home-brands__slider', {
	// 		modules: [Navigation],
		
	// 		observer: true,
	// 		observeParents: true,
	// 		resizeObserver: true,
	// 		watchOverflow: true,
		
	// 		slidesPerView: 1,
	// 		slidesPerGroup: 1,
	// 		spaceBetween: 70,
	// 		speed: 600,
		
	// 		loop: shouldEnableLoop,
	// 		centeredSlides: shouldCenterSlides,
		
	// 		navigation: {
	// 			prevEl: '.home-brands__btn.swiper-button-prev',
	// 			nextEl: '.home-brands__btn.swiper-button-next',
	// 			addIcons: false,
	// 		},
		
	// 		breakpoints: {
	// 			820: {
	// 				slidesPerView: 3,
	// 				slidesPerGroup: 1,
	// 				spaceBetween: 74,
	// 				centeredSlides: shouldCenterSlides,
	// 			},
	// 		},
		
	// 		on: {
	// 			init(swiper) {
	// 				updateThreeSlidesClasses(swiper);
	// 				updateExtraClasses(swiper);
	// 			},
			
	// 			slideChange(swiper) {
	// 				updateThreeSlidesClasses(swiper);
	// 				updateExtraClasses(swiper);
	// 			},
			
	// 			breakpoint(swiper) {
	// 				swiper.update();
	// 				updateThreeSlidesClasses(swiper);
	// 				updateExtraClasses(swiper);
	// 			},
			
	// 			resize(swiper) {
	// 				swiper.update();
	// 				updateThreeSlidesClasses(swiper);
	// 				updateExtraClasses(swiper);
	// 			},
	// 		},
	// 	});

	// 	window.addEventListener('orientationchange', () => {
	// 		setTimeout(() => {
	// 			brandsSwiper.update();
	// 			updateThreeSlidesClasses(brandsSwiper);
	// 			updateExtraClasses(brandsSwiper);
	// 		}, 100);
	// 	});

	// 	function updateThreeSlidesClasses(swiper) {
	// 		const slides = Array.from(swiper.slides);
	// 		const isDesktop = window.innerWidth >= 820;
		
	// 		slides.forEach(slide => {
	// 			slide.classList.remove('is-left', 'is-center', 'is-right');
	// 		});
		
	// 		// классы нужны только если исходно было ровно 3 слайда
	// 		if (!isDesktop || originalSlidesCount !== 3) return;
		
	// 		if (slides[0]) slides[0].classList.add('is-left');
	// 		if (slides[1]) slides[1].classList.add('is-center');
	// 		if (slides[2]) slides[2].classList.add('is-right');
	// 	}

	// 	function updateExtraClasses(swiper) {
	// 		const slides = Array.from(swiper.slides);
		
	// 		slides.forEach(slide => {
	// 			slide.classList.remove('swiper-slide-prev-prev', 'swiper-slide-next-next');
	// 		});
		
	// 		// extra-классы нужны только когда после подготовки слайдов их реально больше 4
	// 		if (renderedSlidesCount <= 4) return;
		
	// 		const prevSlide = slides.find(slide => slide.classList.contains('swiper-slide-prev'));
	// 		const nextSlide = slides.find(slide => slide.classList.contains('swiper-slide-next'));
		
	// 		const canAddExtraClass = (slide) => {
	// 			return slide &&
	// 				!slide.classList.contains('swiper-slide-active') &&
	// 				!slide.classList.contains('swiper-slide-prev') &&
	// 				!slide.classList.contains('swiper-slide-next');
	// 		};
		
	// 		const prevPrevSlide = prevSlide ? prevSlide.previousElementSibling : null;
	// 		const nextNextSlide = nextSlide ? nextSlide.nextElementSibling : null;
		
	// 		if (canAddExtraClass(prevPrevSlide)) {
	// 			prevPrevSlide.classList.add('swiper-slide-prev-prev');
	// 		}
		
	// 		if (canAddExtraClass(nextNextSlide)) {
	// 			nextNextSlide.classList.add('swiper-slide-next-next');
	// 		}
	// 	}
	// }


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