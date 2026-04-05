
import './index.scss'

// function initHeroMedia() {
//   const mediaItems = document.querySelectorAll('.home-hero__media');
//   if (!mediaItems.length) return;

//   const mediaQuery = window.matchMedia('(min-width: 48.061em)');
//   let observer = null;

//   const createVideo = (item) => {
//     if (item.querySelector('video')) return;

//     const videoSrc = item.dataset.video;
//     const posterSrc = item.dataset.poster;

//     if (!videoSrc) return;

//     item.innerHTML = `
//       <video
//         class="home-hero__video"
//         muted
//         playsinline
//         preload="none"
//         ${posterSrc ? `poster="${posterSrc}"` : ''}
//       >
//         <source src="${videoSrc}" type="video/mp4">
//       </video>
//     `;
//   };

//   const removeVideo = (item) => {
//     const video = item.querySelector('video');
//     if (!video) return;

//     video.pause();
//     item.innerHTML = '';
//   };

//   const initObserver = () => {
//     if (observer) {
//       observer.disconnect();
//     }

//     observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           const video = entry.target.querySelector('video');
//           if (!video) return;

//           if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
//             video.play().catch(() => {});
//           } else {
//             video.pause();
//           }
//         });
//       },
//       {
//         threshold: [0, 0.5, 1],
//       }
//     );

//     mediaItems.forEach((item) => {
//       if (item.querySelector('video')) {
//         observer.observe(item);
//       }
//     });
//   };

//   const updateMedia = () => {
//     mediaItems.forEach((item) => {
//       if (mediaQuery.matches) {
//         createVideo(item);
//       } else {
//         removeVideo(item);
//       }
//     });

//     if (mediaQuery.matches) {
//       initObserver();
//     } else if (observer) {
//       observer.disconnect();
//     }
//   };

//   updateMedia();

//   if (typeof mediaQuery.addEventListener === 'function') {
//     mediaQuery.addEventListener('change', updateMedia);
//   } else {
//     mediaQuery.addListener(updateMedia);
//   }
// }

// document.addEventListener('DOMContentLoaded', initHeroMedia);


function initHeroMedia() {
  const mediaItems = document.querySelectorAll('.home-hero__media');
  if (!mediaItems.length) return;

  const mediaQuery = window.matchMedia('(min-width: 30.186em)');
  let observer = null;
  const playedItems = new WeakSet();

  const createVideo = (item) => {
    if (item.querySelector('video')) return;

    const videoSrc = item.dataset.video;
    const posterSrc = item.dataset.poster;

    if (!videoSrc) return;

    item.innerHTML = `
      <video
        class="home-hero__video"
        muted
        playsinline
        preload="metadata"
        ${posterSrc ? `poster="${posterSrc}"` : ''}
      >
        <source src="${videoSrc}" type="video/mp4">
      </video>
    `;
  };

  const removeVideo = (item) => {
    item.innerHTML = '';
  };

  const initObserver = () => {
    if (observer) observer.disconnect();

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = entry.target;
          const video = item.querySelector('video');

          if (!video || playedItems.has(item)) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            playedItems.add(item);
            video.play().catch(() => {});
            observer.unobserve(item);
          }
        });
      },
      {
        threshold: [0, 0.5, 1],
      }
    );

    mediaItems.forEach((item) => {
      if (item.querySelector('video') && !playedItems.has(item)) {
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

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', updateMedia);
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